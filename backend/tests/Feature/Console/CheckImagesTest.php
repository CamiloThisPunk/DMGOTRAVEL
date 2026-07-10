<?php

namespace Tests\Feature\Console;

use App\Models\ServicePackage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckImagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_runs_check_images_command(): void
    {
        $package = ServicePackage::factory()->create([
            'title' => 'Test Package',
            'image_360_url' => 'test_url.jpg',
        ]);

        $this->artisan('app:check-images')
            ->expectsOutput('Test Package -> test_url.jpg')
            ->assertExitCode(0);
    }
}
