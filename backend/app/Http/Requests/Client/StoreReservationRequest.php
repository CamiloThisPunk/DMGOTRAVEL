<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'service_package_id' => ['required', 'integer', 'exists:service_packages,id'],
            'reservation_date' => ['required', 'date', 'after_or_equal:today'],
            'guests_count' => ['required', 'integer', 'min:1'],
            'payment_voucher' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
