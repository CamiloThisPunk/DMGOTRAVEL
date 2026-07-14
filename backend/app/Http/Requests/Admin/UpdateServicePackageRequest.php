<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServicePackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:servicio,paquete'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'capacity' => ['sometimes', 'required', 'integer', 'min:1'],
            'duration' => ['sometimes', 'integer', 'min:1'],
            'image_360' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'image_360_url' => ['nullable', 'string', 'url', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'itinerary' => ['nullable', 'string'], // As JSON string from form data
        ];
    }
}
