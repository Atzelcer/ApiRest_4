<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use Rebing\GraphQL\Support\SelectFields;
use GraphQL;

class CreatePersonaMutation extends Mutation
{
    protected $attributes = [
        'name' => 'createPersona',
        'description' => 'A mutation'
    ];

    public function type(): Type
    {
        return GraphQL::type('Persona');
    }

    public function args(): array
    {
        return [
            // Define los argumentos necesarios para crear una Persona
            'nombres' => ['type' => Type::nonNull(Type::string())],
            'apellidos' => ['type' => Type::nonNull(Type::string())],
            'ci' => ['type' => Type::nonNull(Type::string())],
            'direccion' => ['type' => Type::string()],
            'telefono' => ['type' => Type::string()],
            'email' => ['type' => Type::string()],


        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $fields = $getSelectFields();
        $select = $fields->getSelect();
        $with = $fields->getRelations();

        $persona = Persona::create($args);
        


        return $persona;
    }
}
