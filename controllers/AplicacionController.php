<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\Aplicacion;
use Controllers\HistorialActController;

class AplicacionController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('aplicacion/index', []);
    }

    public static function guardarAPI()
    {
        getHeadersApi();
    
        try {
            $_POST['app_nombre_largo'] = ucwords(strtolower(trim(htmlspecialchars($_POST['app_nombre_largo']))));
            
            $cantidad_largo = strlen($_POST['app_nombre_largo']);
            
            if ($cantidad_largo < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre largo debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            if ($cantidad_largo > 250) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre largo no puede exceder los 250 caracteres'
                ]);
                exit;
            }
            
            $_POST['app_nombre_medium'] = ucwords(strtolower(trim(htmlspecialchars($_POST['app_nombre_medium']))));
            
            $cantidad_medium = strlen($_POST['app_nombre_medium']);
            
            if ($cantidad_medium < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre mediano debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            if ($cantidad_medium > 150) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre mediano no puede exceder los 150 caracteres'
                ]);
                exit;
            }
            
            $_POST['app_nombre_corto'] = strtoupper(trim(htmlspecialchars($_POST['app_nombre_corto'])));
            $cantidad_corto = strlen($_POST['app_nombre_corto']);
            
            if ($cantidad_corto < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre corto debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            if ($cantidad_corto > 50) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Nombre corto no puede exceder los 50 caracteres'
                ]);
                exit;
            }

            $verificarNombreCortoExistente = self::fetchArray("SELECT app_id FROM pmlx_aplicacion WHERE app_nombre_corto = '{$_POST['app_nombre_corto']}' AND app_situacion = 1");

            if (count($verificarNombreCortoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe una aplicación con este nombre corto'
                ]);
                exit;
            }

            $verificarNombreLargoExistente = self::fetchArray("SELECT app_id FROM pmlx_aplicacion WHERE app_nombre_largo = '{$_POST['app_nombre_largo']}' AND app_situacion = 1");

            if (count($verificarNombreLargoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe una aplicación con este nombre largo'
                ]);
                exit;
            }
            
            $aplicacion = new Aplicacion($_POST);
            $resultado = $aplicacion->crear();

            if($resultado['resultado'] == 1){
              HistorialActController::registrarActividad('APLICACIONES', 'CREAR', 'Registró aplicación: ' . $_POST['app_nombre_largo'], 'aplicacion/guardar');
                
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Aplicacion registrada correctamente',
                ]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error en registrar la aplicacion',
                ]);
                exit;
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error interno del servidor',
                'detalle' => $e->getMessage(),
            ]);
            exit;
        }
    }

    public static function buscarAPI()
    {
        try {
            $nombre = isset($_GET['nombre']) ? $_GET['nombre'] : null;

            $condiciones = ["app_situacion = 1"];

            if ($nombre) {
                $condiciones[] = "(app_nombre_largo LIKE '%{$nombre}%' OR app_nombre_medium LIKE '%{$nombre}%' OR app_nombre_corto LIKE '%{$nombre}%')";
            }

            $where = implode(" AND ", $condiciones);
            $sql = "SELECT * FROM pmlx_aplicacion WHERE $where ORDER BY app_fecha_creacion DESC";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Aplicaciones obtenidas correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener las aplicaciones',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        getHeadersApi();

        $id = $_POST['app_id'];
        $_POST['app_nombre_largo'] = ucwords(strtolower(trim(htmlspecialchars($_POST['app_nombre_largo']))));

        $cantidad_largo = strlen($_POST['app_nombre_largo']);

        if ($cantidad_largo < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre largo debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        if ($cantidad_largo > 250) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre largo no puede exceder los 250 caracteres'
            ]);
            return;
        }

        $_POST['app_nombre_medium'] = ucwords(strtolower(trim(htmlspecialchars($_POST['app_nombre_medium']))));

        $cantidad_medium = strlen($_POST['app_nombre_medium']);

        if ($cantidad_medium < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre mediano debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        if ($cantidad_medium > 150) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre mediano no puede exceder los 150 caracteres'
            ]);
            return;
        }

        $_POST['app_nombre_corto'] = strtoupper(trim(htmlspecialchars($_POST['app_nombre_corto'])));
        $cantidad_corto = strlen($_POST['app_nombre_corto']);

        if ($cantidad_corto < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre corto debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        if ($cantidad_corto > 50) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Nombre corto no puede exceder los 50 caracteres'
            ]);
            return;
        }

        try {
            $verificarNombreCortoExistente = self::fetchArray("SELECT app_id FROM pmlx_aplicacion WHERE app_nombre_corto = '{$_POST['app_nombre_corto']}' AND app_situacion = 1 AND app_id != {$id}");

            if (count($verificarNombreCortoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otra aplicación con este nombre corto'
                ]);
                return;
            }

            $verificarNombreLargoExistente = self::fetchArray("SELECT app_id FROM pmlx_aplicacion WHERE app_nombre_largo = '{$_POST['app_nombre_largo']}' AND app_situacion = 1 AND app_id != {$id}");

            if (count($verificarNombreLargoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otra aplicación con este nombre largo'
                ]);
                return;
            }

            $sql = "UPDATE pmlx_aplicacion SET 
                    app_nombre_largo = '{$_POST['app_nombre_largo']}',
                    app_nombre_medium = '{$_POST['app_nombre_medium']}',
                    app_nombre_corto = '{$_POST['app_nombre_corto']}'
                    WHERE app_id = {$id}";
            
            $resultado = self::SQL($sql);

            HistorialActController::registrarActividad('APLICACIONES', 'ACTUALIZAR', 'Modificó aplicación: ' . $_POST['app_nombre_largo'], 'aplicacion/modificar');

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La informacion de la aplicacion ha sido modificada exitosamente'
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function EliminarAPI()
    {
        try {
            $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

            $verificarPermisos = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE app_id = {$id} AND permiso_situacion = 1");

            if (count($verificarPermisos) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'No se puede eliminar la aplicación porque tiene permisos asociados'
                ]);
                return;
            }

            $verificarAsignaciones = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_app_id = {$id} AND asignacion_situacion = 1");

            if (count($verificarAsignaciones) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'No se puede eliminar la aplicación porque tiene asignaciones de permisos activas'
                ]);
                return;
            }

            $sql_aplicacion = "SELECT app_nombre_largo FROM pmlx_aplicacion WHERE app_id = $id";
            $aplicacion_data = self::fetchFirst($sql_aplicacion);

            $ejecutar = Aplicacion::EliminarAplicaciones($id);

            if ($aplicacion_data) {
              HistorialActController::registrarActividad('APLICACIONES', 'ELIMINAR', 'Eliminó aplicación: ' . $aplicacion_data['app_nombre_largo'], 'aplicacion/eliminar');
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'El registro ha sido eliminado correctamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Eliminar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
}