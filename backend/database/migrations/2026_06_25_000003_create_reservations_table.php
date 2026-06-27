<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('service_package_id')
                ->constrained('service_packages')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->date('reservation_date');
            $table->integer('guests_count');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])
                ->default('pending');
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['client_id', 'status']);
            $table->index(['service_package_id', 'reservation_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
