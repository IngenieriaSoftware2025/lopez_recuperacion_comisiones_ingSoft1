<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas de Usuarios</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid py-4">

        <div class="bg-primary text-white p-4 rounded-4 mb-4 text-center shadow">
            <h1 class="mb-3">📊 PANEL DE ESTADÍSTICAS DE USUARIOS</h1>
            <p class="mb-0">Análisis completo del sistema de gestión de usuarios</p>
        </div>

        <div class="mb-5">
            <h3 class="text-primary fw-bold text-center mb-4 position-relative">
                ANÁLISIS DE USUARIOS DEL SISTEMA
                <div class="bg-primary mx-auto mt-2" style="width: 80px; height: 3px; border-radius: 2px;"></div>
            </h3>
            <div class="row justify-content-center">
                <div class="col-lg-6 mb-4">
                    <div class="card shadow border-0 rounded-4 h-100" style="min-height: 450px;">
                        <div class="card-header bg-light text-center border-0">
                            <h5 class="text-primary fw-bold mb-0">Usuarios por Situación</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-center" style="height: 320px;">
                                <canvas id="grafico1"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card shadow border-0 rounded-4 h-100" style="min-height: 450px;">
                        <div class="card-header bg-light text-center border-0">
                            <h5 class="text-primary fw-bold mb-0">Usuarios por Año de Registro</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-center" style="height: 320px;">
                                <canvas id="grafico2"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-6 mb-4">
                    <div class="card shadow border-0 rounded-4 h-100" style="min-height: 450px;">
                        <div class="card-header bg-light text-center border-0">
                            <h5 class="text-primary fw-bold mb-0">Usuarios por Dominio de Correo</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-center" style="height: 320px;">
                                <canvas id="grafico3"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card shadow border-0 rounded-4 h-100" style="min-height: 450px;">
                        <div class="card-header bg-light text-center border-0">
                            <h5 class="text-primary fw-bold mb-0">Resumen General del Sistema</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-center" style="height: 320px;">
                                <canvas id="grafico4"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<?= asset('build/js/estadisticas/index.js') ?>"></script>
</body>
</html>