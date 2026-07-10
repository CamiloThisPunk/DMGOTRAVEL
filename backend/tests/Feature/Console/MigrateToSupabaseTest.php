<?php

namespace Tests\Feature\Console;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MigrateToSupabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_fails_gracefully_when_no_local_db(): void
    {
        // Should fail because we pass fake credentials or connection is bad
        $this->artisan('app:migrate-data', ['--user' => 'fake_user', '--password' => 'fake_pass'])
            ->assertExitCode(1);
    }

    public function test_it_migrates_data_successfully(): void
    {
        $mockConnection = \Mockery::mock(\Illuminate\Database\Connection::class);
        $mockConnection->shouldReceive('getPdo')->andReturn(true);
        $mockConnection->shouldReceive('statement')->andReturn(true);

        $mockQueryBuilder = \Mockery::mock(\Illuminate\Database\Query\Builder::class);
        // Simulate one row returned for each table
        $mockQueryBuilder->shouldReceive('get')->andReturn(collect([ (object)['id' => 1] ]));
        $mockQueryBuilder->shouldReceive('insert')->andReturn(true);

        $mockConnection->shouldReceive('table')->andReturn($mockQueryBuilder);

        // Mock schema builder for Schema facade
        $mockSchemaBuilder = \Mockery::mock();
        $mockSchemaBuilder->shouldReceive('hasColumn')->andReturn(true);
        $mockConnection->shouldReceive('getSchemaBuilder')->andReturn($mockSchemaBuilder);

        // Intercept all DB::connection() calls
        \Illuminate\Support\Facades\DB::shouldReceive('connection')
            ->andReturn($mockConnection);

        $this->artisan('app:migrate-data', ['--user' => 'test', '--password' => 'test'])
            ->assertExitCode(0);
    }
}
