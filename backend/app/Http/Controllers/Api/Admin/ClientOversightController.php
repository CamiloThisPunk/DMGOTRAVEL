<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class ClientOversightController extends Controller
{
    #[OA\Get(
        path: '/api/admin/clients',
        summary: 'List all client accounts (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Admin Clients'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
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

    #[OA\Get(
        path: '/api/admin/logs',
        summary: 'List audit log entries (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Admin Logs'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
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
