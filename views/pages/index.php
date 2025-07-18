<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - Sistema de Dotación Militar</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
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
    </style>
</head>
<body>
   

    <div class="container">
        <div class="tarjeta-bienvenida">
            <div class="row">
                <div class="col-md-12">
                  <div class="text-center">
                    <h2>¡Bienvenido al Programa de asignacion de Comisiones de la Brigada </h2>
                    <p class="lead">Voz y Oido del Mando </p>
                    <p class="text-muted">
                        Trabajando para un Ejército mejor y superior
                    </p>
                    </div>
                </div>
            </div>
        </div>

       
        
        <div class="row">
            <div class="col-lg-4 col-md-6">
                <a href="/lopez_recuperacion_comisiones_ingSoft1/usuario" class="tarjeta-modulo">
                    <div class="text-center">
                        <i class="bi bi-people icono-modulo icono-personal"></i>
                        <div class="titulo-modulo">Personal</div>
                        <div class="descripcion-modulo">
                            Registrar y administrar el personal 
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-lg-4 col-md-6">
                <a href="/lopez_recuperacion_comisiones_ingSoft1/aplicacion" class="tarjeta-modulo">
                    <div class="text-center">
                        <i class="bi bi-boxes icono-modulo icono-inventario"></i>
                        <div class="titulo-modulo">Aplicaciones</div>
                        <div class="descripcion-modulo">
                            Control de permisos en aplicaciones
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-lg-4 col-md-6">
                <a href="/lopez_recuperacion_comisiones_ingSoft1/comisiones" class="tarjeta-modulo">
                    <div class="text-center">
                        <i class="bi bi-clipboard-check icono-modulo icono-pedidos"></i>
                        <div class="titulo-modulo">Comisiones</div>
                        <div class="descripcion-modulo">
                            Asinación de Comisiones 
                        </div>
                    </div>
                </a>
            </div>

              

        </div>
    </div>
<script src="<?= asset('build/js/inicio.js') ?>"></script>
</body>
</html>