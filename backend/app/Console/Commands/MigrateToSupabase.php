<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateToSupabase extends Command
{
    protected $signature = 'app:migrate-data {--u|user=root : Local DB User} {--p|password= : Local DB Password}';
    protected $description = 'Migrate data from local MariaDB to remote Supabase Postgres';

    public function handle()
    {
        $this->info('Configuring local MariaDB connection...');

        Config::set('database.connections.local_mariadb', [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => '3306',
            'database' => 'dmgotravel',
            'username' => $this->option('user'),
            'password' => $this->option('password') ?: '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        $localDb = DB::connection('local_mariadb');
        $remoteDb = DB::connection('pgsql');

        try {
            $localDb->getPdo();
            $this->info('Successfully connected to local MariaDB!');
        } catch (\Exception $e) {
            $this->error('Failed to connect to local MariaDB: ' . $e->getMessage());
            return 1;
        }

        try {
            $remoteDb->getPdo();
            $this->info('Successfully connected to remote Supabase!');
        } catch (\Exception $e) {
            $this->error('Failed to connect to Supabase: ' . $e->getMessage());
            return 1;
        }

        $tables = [
            'users',
            'roles',
            'permissions',
            'model_has_roles',
            'model_has_permissions',
            'role_has_permissions',
            'service_packages',
            'reservations',
        ];

        // Disable foreign key checks on remote PG for the session
        $remoteDb->statement("SET session_replication_role = 'replica';");

        foreach ($tables as $table) {
            $this->info("Migrating table: {$table}");
            
            // Clean remote table
            $remoteDb->statement("TRUNCATE TABLE {$table} CASCADE");
            
            // Fetch local data
            $rows = $localDb->table($table)->get()->map(function($item) {
                return (array) $item;
            })->toArray();
            
            if (empty($rows)) {
                $this->warn("No data found in {$table}");
                continue;
            }

            // Insert into remote in chunks
            $chunks = array_chunk($rows, 100);
            foreach ($chunks as $chunk) {
                $remoteDb->table($table)->insert($chunk);
            }
            
            // Update PG sequence if table has 'id' column
            if (Schema::connection('local_mariadb')->hasColumn($table, 'id')) {
                $remoteDb->statement("SELECT setval(pg_get_serial_sequence('{$table}', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM {$table};");
            }

            $this->info("Migrated " . count($rows) . " rows for {$table}.");
        }

        // Re-enable FK checks
        $remoteDb->statement("SET session_replication_role = 'origin';");

        $this->info('=====================================');
        $this->info('Migration completed successfully! 🎉');
        $this->info('Important: Since images were saved in your local PC, please re-upload them by editing your packages in the Admin Dashboard.');
        $this->info('=====================================');
        
        return 0;
    }
}
