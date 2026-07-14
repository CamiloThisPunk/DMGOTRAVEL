<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ClientProfileController extends Controller
{
    /**
     * Update the authenticated client's profile (name and phone).
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => $user
        ]);
    }

    /**
     * Delete the authenticated client's account.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        
        // Prevent admins from deleting their account via this client endpoint
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'No puedes eliminar una cuenta de administrador desde aquí.'], 403);
        }

        // Delete user's tokens to immediately invalidate sessions
        $user->tokens()->delete();
        
        // Delete the user
        $user->delete();

        return response()->json([
            'message' => 'Cuenta eliminada exitosamente'
        ]);
    }
}
