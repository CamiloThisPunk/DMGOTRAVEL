<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class ImageUploadService
{
    /**
     * Allowed MIME types for 360 images (typically JPEG or PNG)
     */
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    /**
     * Store a 360° image securely.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string
     * @throws \Exception
     */
    public function storeImage(UploadedFile $file, string $path = 'services/360'): string
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES)) {
            throw new \Exception('Invalid image type. Only JPEG, PNG, and WebP are allowed.');
        }

        $storedPath = $file->store($path, 'public');
        
        if (!$storedPath) {
            throw new FileException('Failed to store the image.');
        }

        return $storedPath;
    }

    /**
     * Delete an image from storage.
     *
     * @param string|null $path
     * @return bool
     */
    public function deleteImage(?string $path): bool
    {
        if ($path && Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }
}
