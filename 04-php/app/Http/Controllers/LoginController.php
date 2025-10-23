<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class LoginController extends Controller
{
    /**
     * Login for API (returns JWT token)
     */
    public function login(Request $request)
    {
        $usuario = User::where('email', $request->email)->first();
       
        if ($usuario == null) {
            return response()->json([
                'mensaje' => 'usuario invalido',
            ], 400);
        }
        if (Hash::check($request->password, $usuario->password)) {
            $key=env('JWT_SECRET');
            $algoritmo=env('JWT_ALGORITHM');
            
            $time = time();
            $token = array(
                'iat' => $time, // Tiempo que inició el token
                'exp' => $time + (1200 * 60), // Tiempo que expirará el token (+1 hora)
                'data' => [ // información del usuario
                    'user_id' => $usuario->id,
                ],
            );
            $jwt = JWT::encode($token, $key, $algoritmo);
            return response()->json([
                'mensaje' => 'Se logró autenticar al usuario',
                        'token' => $jwt,
                        'type' => 'bearer',
                        'expires' => $time + (1200 * 60),
                        'usuario' => $usuario
            ], 200);
        } else {
            return response()->json([
                'mensaje' => 'Contraseña invalida',
                'status' => 400
            ], 400);
        }
    }

    /**
     * Login for Web (redirects to dashboard)
     */
    public function webLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $usuario = User::where('email', $request->email)->first();
       
        if ($usuario == null) {
            return back()->withErrors([
                'email' => 'Usuario no encontrado.',
            ])->withInput();
        }

        if (Hash::check($request->password, $usuario->password)) {
            $key = env('JWT_SECRET');
            $algoritmo = env('JWT_ALGORITHM');
            
            $time = time();
            $token = array(
                'iat' => $time,
                'exp' => $time + (1200 * 60),
                'data' => [
                    'user_id' => $usuario->id,
                ],
            );
            $jwt = JWT::encode($token, $key, $algoritmo);
            
            // Guardar el token en sesión
            session([
                'token' => $jwt,
                'user' => $usuario,
            ]);

            return redirect()->route('dashboard');
        } else {
            return back()->withErrors([
                'password' => 'Contraseña incorrecta.',
            ])->withInput();
        }
    }
}
