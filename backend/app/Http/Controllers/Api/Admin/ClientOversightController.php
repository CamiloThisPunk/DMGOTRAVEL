<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientOversightController extends Controller
{
    /**
     * List all client accounts (read-only).
     */
    public function clients(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 15);

        return UserResource::collection(
            User::clients()->paginate($perPage)
        );
    }

    /**
     * List audit log entries.
     */
    public function logs(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 15);

        return AuditLogResource::collection(
            AuditLog::orderBy('created_at', 'desc')->paginate($perPage)
        );
    }
}
