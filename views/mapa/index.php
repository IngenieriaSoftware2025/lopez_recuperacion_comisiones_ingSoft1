<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Ubicaciones</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        /* Estilos específicos para el mapa */
        #map {
            height: 500px;
            width: 100%;
            border-radius: 8px;
            border: 2px solid #ca57bb73;
            z-index: 1;
        }
        
        /* Asegurar que Leaflet tenga el tamaño correcto */
        .leaflet-container {
            height: 500px !important;
            width: 100% !important;
            background: #a8ddf0;
        }
        
        /* Corregir tiles distorsionados */
        .leaflet-tile {
            width: 256px !important;
            height: 256px !important;
        }
        
        /* Asegurar que el contenedor padre tenga altura */
        .card-body {
            min-height: 550px;
            padding: 1.5rem;
        }
        
        /* Estilo personalizado para la card */
        .custom-card {
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Título del mapa */
        .map-title {
            color: #a10a9fff;
            font-weight: 600;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container-fluid py-4">
        <div class="row justify-content-center p-3">
            <div class="col-12">
                <div class="card custom-card shadow-lg" style="border-radius: 10px; border: 1px solid #007bff;">
                    <div class="card-header bg-primary text-white text-center">
                        <h4 class="mb-0">
                            <i class="fas fa-map-marked-alt me-2"></i>
                            Mapa de Ubicaciones - Sistema de Usuarios
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-12">
                                <h5 class="text-center map-title">
                                    📍 Ubicaciones de Usuarios Registrados
                                </h5>
                            </div>
                        </div>
                        
                        <!-- Contenedor del mapa -->
                        <div class="row">
                            <div class="col-12">
                                <div id="map"></div>
                            </div>
                        </div>
                        
                        <!-- Información adicional -->
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="alert alert-info text-center">
                                    <small>
                                        <i class="fas fa-info-circle me-1"></i>
                                        Haz clic en los marcadores para ver información detallada
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="<?= asset('build/js/mapa/index.js') ?>"></script>
</body>
</html>