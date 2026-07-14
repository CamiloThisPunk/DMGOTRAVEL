<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePackageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'description' => $this->description,
            'itinerary' => $this->itinerary,
            'price' => (float) $this->price,
            'old_price' => $this->old_price ? (float) $this->old_price : null,
            'capacity' => $this->capacity,
            'duration' => $this->duration,
            'image_360_url' => $this->image_360_url
                ? (str_starts_with($this->image_360_url, 'http') ? $this->image_360_url : url('/api/images?path=' . $this->image_360_url))
                : null,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
