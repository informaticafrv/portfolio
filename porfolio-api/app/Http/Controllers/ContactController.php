<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        if ($request->filled('website')) {
            return response()->json(['message' => 'OK']);
        }

        $validated = $request->validate([
            'name'    => ['required', 'string', 'min:2', 'max:100'],
            'email'   => ['required', 'email', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        try {
            Mail::to(env('MAIL_CONTACT_TO'))->send(new ContactMail($validated));
        } catch (\Exception) {
            return response()->json(['message' => 'Error al enviar el mensaje.'], 500);
        }

        return response()->json(['message' => 'Mensaje enviado correctamente.']);
    }
}
