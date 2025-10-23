<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource with pagination and search.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Persona::query();

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nombres', 'like', "%{$search}%")
                      ->orWhere('apellidos', 'like', "%{$search}%")
                      ->orWhere('ci', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }


            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);


            $perPage = $request->get('per_page', 15);
            $personas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Personas obtenidas exitosamente',
                'data' => $personas
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las personas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombres' => 'required|string|max:50|min:2',
                'apellidos' => 'required|string|max:50|min:2',
                'ci' => 'required|string|max:12|unique:personas,ci',
                'direccion' => 'required|string|max:100',
                'telefono' => 'required|string|max:15',
                'email' => 'required|email|max:100|unique:personas,email',
            ], [
                'nombres.required' => 'El campo nombres es obligatorio',
                'nombres.min' => 'El nombre debe tener al menos 2 caracteres',
                'apellidos.required' => 'El campo apellidos es obligatorio',
                'apellidos.min' => 'Los apellidos deben tener al menos 2 caracteres',
                'ci.required' => 'El CI es obligatorio',
                'ci.unique' => 'El CI ya está registrado',
                'direccion.required' => 'La dirección es obligatoria',
                'telefono.required' => 'El teléfono es obligatorio',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'El email debe ser válido',
                'email.unique' => 'El email ya está registrado',
            ]);

            $persona = Persona::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Persona creada exitosamente',
                'data' => $persona
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la persona',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param Persona $persona
     * @return JsonResponse
     */
    public function show(Persona $persona): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Persona encontrada',
                'data' => $persona
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la persona',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param Request $request
     * @param Persona $persona
     * @return JsonResponse
     */
    public function update(Request $request, Persona $persona): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombres' => 'sometimes|required|string|max:50|min:2',
                'apellidos' => 'sometimes|required|string|max:50|min:2',
                'ci' => 'sometimes|required|string|max:12|unique:personas,ci,' . $persona->id,
                'direccion' => 'sometimes|required|string|max:100',
                'telefono' => 'sometimes|required|string|max:15',
                'email' => 'sometimes|required|email|max:100|unique:personas,email,' . $persona->id,
            ], [
                'nombres.required' => 'El campo nombres es obligatorio',
                'nombres.min' => 'El nombre debe tener al menos 2 caracteres',
                'apellidos.required' => 'El campo apellidos es obligatorio',
                'apellidos.min' => 'Los apellidos deben tener al menos 2 caracteres',
                'ci.required' => 'El CI es obligatorio',
                'ci.unique' => 'El CI ya está registrado',
                'direccion.required' => 'La dirección es obligatoria',
                'telefono.required' => 'El teléfono es obligatorio',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'El email debe ser válido',
                'email.unique' => 'El email ya está registrado',
            ]);

            $persona->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Persona actualizada exitosamente',
                'data' => $persona
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la persona',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param Persona $persona
     * @return JsonResponse
     */
    public function destroy(Persona $persona): JsonResponse
    {
        try {
            $persona->delete();

            return response()->json([
                'success' => true,
                'message' => 'Persona eliminada exitosamente',
                'data' => null
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la persona',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
