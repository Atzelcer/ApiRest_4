<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="api-token" content="{{ session('token') }}">
    <title>GESTION DE PERSONAS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark shadow-sm">
        <div class="container">
            <span class="navbar-brand mb-0 h3 fw-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-people-fill me-2" viewBox="0 0 16 16">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
                GESTION DE PERSONAS
            </span>
            <div class="d-flex align-items-center gap-3">
                <span class="badge bg-light text-dark px-3 py-2">
                    {{ session('user')->name ?? 'Usuario' }}
                </span>
                <a href="{{ route('login') }}" class="btn btn-outline-light">
                    SALIR
                </a>
            </div>
        </div>
    </nav>

    <div class="container py-4">
        <div id="alert-container" class="position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>

        <div class="row g-3 mb-4">
            <div class="col-lg-4 col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-body text-center py-4">
                        <h6 class="text-muted text-uppercase mb-2">TOTAL DE PERSONAS</h6>
                        <h2 class="fw-bold mb-0 text-primary" id="totalPersonas">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-body text-center py-4">
                        <h6 class="text-muted text-uppercase mb-2">PAGINA ACTUAL</h6>
                        <h2 class="fw-bold mb-0 text-success" id="paginaActual">1</h2>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-body text-center py-4">
                        <h6 class="text-muted text-uppercase mb-2">REGISTROS POR PAGINA</h6>
                        <h2 class="fw-bold mb-0 text-info">10</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-center">
                    <div class="col-lg-8 col-md-7">
                        <div class="input-group input-group-lg">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="bi bi-search"></i>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                            <input type="text" class="form-control border-start-0" id="searchInput" placeholder="BUSCAR POR NOMBRE, APELLIDO, CI O EMAIL...">
                            <button class="btn btn-success px-4" onclick="buscarPersonas()">
                                <strong>BUSCAR</strong>
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-5">
                        <button class="btn btn-primary btn-lg w-100" onclick="abrirModalCrear()">
                            <strong>+ NUEVA PERSONA</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow border-0">
            <div class="card-header bg-white py-3">
                <h5 class="mb-0 fw-bold">LISTA DE PERSONAS</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-striped align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="fw-bold sortable" onclick="ordenarTabla('id')" style="cursor: pointer;">
                                    ID 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-chevron-expand ms-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
                                    </svg>
                                </th>
                                <th class="fw-bold sortable" onclick="ordenarTabla('nombres')" style="cursor: pointer;">
                                    NOMBRES
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-chevron-expand ms-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
                                    </svg>
                                </th>
                                <th class="fw-bold sortable" onclick="ordenarTabla('apellidos')" style="cursor: pointer;">
                                    APELLIDOS
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-chevron-expand ms-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
                                    </svg>
                                </th>
                                <th class="fw-bold">CI</th>
                                <th class="fw-bold">DIRECCION</th>
                                <th class="fw-bold">TELEFONO</th>
                                <th class="fw-bold">EMAIL</th>
                                <th class="text-center fw-bold">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <tr>
                                <td colspan="8" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                    <p class="mt-2 text-muted">CARGANDO DATOS...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white py-3">
                <nav class="d-flex justify-content-center">
                    <ul class="pagination mb-0" id="pagination"></ul>
                </nav>
            </div>
        </div>
    </div>

    <div class="modal fade" id="personaModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content shadow-lg border-0">
                <div class="modal-header border-bottom">
                    <h5 class="modal-title fw-bold" id="modalTitle">NUEVA PERSONA</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="personaForm">
                        <input type="hidden" id="personaId">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="nombres" class="form-label fw-semibold">
                                    NOMBRES <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-lg" id="nombres" required placeholder="Ingrese los nombres">
                            </div>
                            <div class="col-md-6">
                                <label for="apellidos" class="form-label fw-semibold">
                                    APELLIDOS <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-lg" id="apellidos" required placeholder="Ingrese los apellidos">
                            </div>
                            <div class="col-md-6">
                                <label for="ci" class="form-label fw-semibold">
                                    CI <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-lg" id="ci" required placeholder="Ingrese el CI">
                            </div>
                            <div class="col-md-6">
                                <label for="telefono" class="form-label fw-semibold">
                                    TELEFONO <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-lg" id="telefono" required placeholder="Ingrese el telefono">
                            </div>
                            <div class="col-12">
                                <label for="direccion" class="form-label fw-semibold">
                                    DIRECCION <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-lg" id="direccion" required placeholder="Ingrese la direccion">
                            </div>
                            <div class="col-12">
                                <label for="email" class="form-label fw-semibold">
                                    EMAIL <span class="text-danger">*</span>
                                </label>
                                <input type="email" class="form-control form-control-lg" id="email" required placeholder="ejemplo@correo.com">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top bg-light">
                    <button type="button" class="btn btn-secondary btn-lg px-4" data-bs-dismiss="modal">
                        CANCELAR
                    </button>
                    <button type="button" class="btn btn-success btn-lg px-5" onclick="guardarPersona()">
                        <strong>GUARDAR</strong>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/api-service.js') }}"></script>
    <script src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>
