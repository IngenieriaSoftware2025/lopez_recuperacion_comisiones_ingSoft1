<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="build/js/app.js"></script>
    <link rel="shortcut icon" href="<?= asset('images/cit.png') ?>" type="image/x-icon">
    <link rel="stylesheet" href="<?= asset('build/styles.css') ?>">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <title>DemoApp</title>
</head>
<style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .navbar-brand {
            font-weight: 600;
            font-size: 1.3rem;
        }
        
        .tarjeta-bienvenida {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            padding: 30px;
            margin: 30px 0;
        }
        
        .tarjeta-modulo {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 20px;
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: block;
        }
        
        .tarjeta-modulo:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-decoration: none;
            color: inherit;
        }
        
        .icono-modulo {
            font-size: 3rem;
            margin-bottom: 15px;
            display: block;
        }
        
        .icono-personal { color: #28a745; }
        .icono-inventario { color: #007bff; }
        .icono-entregas { color: #fd7e14; }
        .icono-estadisticas { color: #6f42c1; }
        .icono-pedidos { color: #dc3545; }
        .icono-configuracion { color: #6c757d; }
        
        .titulo-modulo {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .descripcion-modulo {
            color: #666;
            font-size: 0.9rem;
        }
        
        .btn-logout {
            background: #dc3545;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
        }
        
        .btn-logout:hover {
            background: #c82333;
        }

        .info-usuario {
            color: white;
        }

        .menu-usuario {
            display: flex;
            align-items: center;
        }

        .item-usuario {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }

        .item-usuario:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            text-decoration: none;
        }

        .peligro:hover {
            background-color: #dc3545;
        }

        .nav-link {
            display: flex;
            align-items: center;
        }

        .nav-link i {
            margin-right: 8px;
        }
    </style>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand" href="/ejemplo/">
                <img src="<?= asset('./images/cit.png') ?>" width="35px" alt="cit">
                Aplicaciones
            </a>
            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="margin: 0;">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/">
                            <i class="bi bi-house-fill"></i>Inicio
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/usuario">
                            <i class="bi bi-people-fill"></i>Usuarios
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/aplicacion">
                            <i class="bi bi-app-indicator"></i>Aplicación
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/comisiones">
                            <i class="bi bi-currency-dollar"></i>Asig Comisiones
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal">
                            <i class="bi bi-person-badge"></i>Personal
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/permisos">
                            <i class="bi bi-shield-check"></i>Permisos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos">
                            <i class="bi bi-person-check"></i>Asig Permisos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/mapa">
                            <i class="bi bi-geo-alt-fill"></i>Mapas
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/estadisticas">
                            <i class="bi bi-bar-chart-fill"></i>Estadísticas
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/lopez_recuperacion_comisiones_ingSoft1/historial">
                            <i class="bi bi-clock-history"></i>Historial
                        </a>
                    </li>
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-gear-fill"></i>Configuración
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" id="dropwdownRevision" style="margin: 0;">
                            <li>
                                <a class="dropdown-item nav-link text-white" href="/aplicaciones/nueva">
                                    <i class="bi bi-plus-circle-fill"></i>Subitem
                                </a>
                            </li>
                        </ul>
                    </div>
                </ul>
                <div class="info-usuario">
                    <div class="dropdown-usuario">
                        <div class="menu-usuario" id="menuUsuario">
                            <a href="/lopez_recuperacion_comisiones_ingSoft1/logout" class="item-usuario peligro">
                                <i class="bi bi-power"></i>
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    <div class="progress fixed-bottom" style="height: 6px;">
        <div class="progress-bar progress-bar-animated bg-danger" id="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    
    <div class="container-fluid pt-5 mb-4" style="min-height: 85vh">
        <?php echo $contenido; ?>
    </div>
    
    <div class="container-fluid">
        <div class="row justify-content-center text-center">
            <div class="col-12">
                <p style="font-size:xx-small; font-weight: bold;">
                    Comando de Informática y Tecnología, <?= date('Y') ?> &copy;
                </p>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>