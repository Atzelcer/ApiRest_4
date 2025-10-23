<?php
require_once 'config.php';

if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>GESTION DE PERSONAS</h1>
            <button id="btnLogout" class="btn-logout">CERRAR SESIÓN</button>
        </header>

        <div class="toolbar">
            <input type="text" id="txtBuscar" placeholder="Buscar por ID, nombre, apellido o CI..." class="search-input">
            <button id="btnCrear" class="btn btn-crear">CREAR</button>
            <button id="btnEditar" class="btn btn-editar">EDITAR</button>
            <button id="btnEliminar" class="btn btn-eliminar">ELIMINAR</button>
            <button id="btnActualizar" class="btn btn-actualizar">ACTUALIZAR</button>
        </div>

        <div class="table-container">
            <table id="tablaPersonas">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRES</th>
                        <th>APELLIDOS</th>
                        <th>CI</th>
                        <th>DIRECCION</th>
                        <th>TELEFONO</th>
                        <th>EMAIL</th>
                    </tr>
                </thead>
                <tbody id="tbodyPersonas">
                    <tr>
                        <td colspan="7" class="loading">Cargando datos...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="modalPersona" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="modalTitulo">CREAR PERSONA</h2>
            <form id="formPersona">
                <input type="hidden" id="personaId">
                <div class="form-group">
                    <label for="nombres">NOMBRES:</label>
                    <input type="text" id="nombres" required>
                </div>
                <div class="form-group">
                    <label for="apellidos">APELLIDOS:</label>
                    <input type="text" id="apellidos" required>
                </div>
                <div class="form-group">
                    <label for="ci">CI (Cédula):</label>
                    <input type="text" id="ci" required>
                </div>
                <div class="form-group">
                    <label for="direccion">DIRECCIÓN:</label>
                    <input type="text" id="direccion" required>
                </div>
                <div class="form-group">
                    <label for="telefono">TELÉFONO:</label>
                    <input type="text" id="telefono" required>
                </div>
                <div class="form-group">
                    <label for="emailPersona">EMAIL:</label>
                    <input type="email" id="emailPersona" required>
                </div>
                <div class="form-actions">
                    <button type="submit" id="btnGuardar" class="btn btn-guardar">GUARDAR</button>
                    <button type="button" id="btnCancelar" class="btn btn-cancelar">CANCELAR</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/dashboard.js"></script>
</body>
</html>
