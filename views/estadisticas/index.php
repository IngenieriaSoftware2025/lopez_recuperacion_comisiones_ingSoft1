<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas - Sistema de Comisiones</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12 text-center">
                <h1 class="text-primary">Estadísticas del Sistema de Comisiones</h1>
            </div>
        </div>

        <!-- Cards de Resumen General -->
        <div class="row mb-4">
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Usuarios</h6>
                                <h3 id="totalUsuarios">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-users fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Comisiones</h6>
                                <h3 id="totalComisiones">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clipboard-list fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Personal</h6>
                                <h3 id="totalPersonal">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-user-tie fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Aplicaciones</h6>
                                <h3 id="totalAplicaciones">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-desktop fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-secondary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Permisos</h6>
                                <h3 id="totalPermisos">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-shield-alt fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-4 mb-3">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Asignaciones</h6>
                                <h3 id="totalAsignaciones">0</h3>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-tasks fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficas Principales -->
        <div class="row mb-4">
            <!-- Gráfica 1: Usuarios Últimos 30 Días -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Usuarios Registrados - Últimos 30 Días</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 400px;">
                            <canvas id="grafico1"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfica 2: Usuarios por Nombre -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Top 10 - Usuarios por Nombre</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 400px;">
                            <canvas id="grafico2"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <!-- Gráfica 3: Personal por Rango -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-warning text-white">
                        <h5 class="mb-0">Personal Militar por Rango</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 400px;">
                            <canvas id="grafico3"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfica 4: Usuarios por Correo -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-danger text-white">
                        <h5 class="mb-0">Usuarios por Dominio de Correo</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 400px;">
                            <canvas id="grafico4"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráfica 5: Comisiones por Estado -->
        <div class="row mb-4">
            <div class="col-lg-8 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Comisiones por Estado</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 400px;">
                            <canvas id="grafico5"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Información del Sistema -->
            <div class="col-lg-4 col-md-12 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0">Información del Sistema</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Base de Datos:</strong> Informix
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-success">
                                    <i class="fas fa-clock me-2"></i>
                                    <strong>Última Actualización:</strong><br>
                                    <small id="ultimaActualizacion">Cargando...</small>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-warning">
                                    <i class="fas fa-sync-alt me-2"></i>
                                    <strong>Auto-actualización:</strong><br>
                                    <small>Cada 5 minutos</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botones de Acción -->
        <div class="row mb-4">
            <div class="col-12 text-center">
                <button id="btnActualizarEstadisticas" class="btn btn-primary btn-lg me-3">
                    <i class="fas fa-sync-alt"></i> Actualizar Estadísticas
                </button>
                <button id="btnExportarEstadisticas" class="btn btn-success btn-lg">
                    <i class="fas fa-download"></i> Exportar Datos
                </button>
            </div>
        </div>

        <!-- Footer -->
        <div class="row">
            <div class="col-12 text-center">
                <p class="text-muted">Sistema de Gestión de Comisiones Militares - Comando de Informática y Tecnología, 2025 ©</p>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Actualizar timestamp
        document.getElementById('ultimaActualizacion').textContent = new Date().toLocaleString();
    </script>
    <script src="<?= asset('build/js/estadisticas/index.js') ?>"></script>
</body>
</html>