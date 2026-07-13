<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service' => new ServicePackageResource($this->whenLoaded('servicePackage')),
            'service_title' => $this->whenLoaded('servicePackage', fn () => $this->servicePackage->title),
            'client' => new UserResource($this->whenLoaded('client')),
            'reservation_date' => $this->reservation_date?->toDateString(),
            'guests_count' => $this->guests_count,
            'status' => $this->status,
            'total_price' => (float) $this->total_price,
            'payment_voucher_url' => $this->payment_voucher_url,
            'special_requests' => $this->special_requests,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
