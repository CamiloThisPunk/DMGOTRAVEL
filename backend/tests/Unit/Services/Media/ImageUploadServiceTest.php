<?php

namespace Tests\Unit\Services\Media;

use App\Services\Media\ImageUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImageUploadServiceTest extends TestCase
{
    use RefreshDatabase;

    private ImageUploadService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ImageUploadService::class);
        Storage::fake('public');
    }

    public function test_can_store_valid_image(): void
    {
        $file = UploadedFile::fake()->create('test.jpg', 100, 'image/jpeg');
        
        $path = $this->service->storeImage($file);

        $this->assertIsString($path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_cannot_store_invalid_mime_type(): void
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Invalid image type');

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        
        $this->service->storeImage($file);
    }

    public function test_can_delete_existing_image(): void
    {
        $file = UploadedFile::fake()->create('test.png', 100, 'image/png');
        $path = $this->service->storeImage($file);
        
        $result = $this->service->deleteImage($path);
        
        $this->assertTrue($result);
        Storage::disk('public')->assertMissing($path);
    }
    
    public function test_returns_false_when_deleting_non_existent_image(): void
    {
        $result = $this->service->deleteImage('non-existent.jpg');
        $this->assertFalse($result);
    }

    public function test_throws_exception_on_store_failure(): void
    {
        $file = \Mockery::mock(UploadedFile::class);
        $file->shouldReceive('getMimeType')->andReturn('image/jpeg');
        $file->shouldReceive('store')->andReturn(false);

        $this->expectException(\Symfony\Component\HttpFoundation\File\Exception\FileException::class);
        
        $this->service->storeImage($file);
    }
}
