<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\Permisos;
use Controllers\HistorialActController;

class PermisosController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('permisos/index', []);
    }

    public static function guardarAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');
    
        try {
            // DEBUG: Log para ver qué llega
            error_log("POST recibido: " . print_r($_POST, true));
            
            $_POST['app_id'] = filter_var($_POST['app_id'], FILTER_SANITIZE_NUMBER_INT);
            
            if ($_POST['app_id'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar una aplicación válida'
                ]);
                exit;
            }

            $_POST['permiso_tipo'] = trim(htmlspecialchars($_POST['permiso_tipo']));
            
            if (empty($_POST['permiso_tipo'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar un tipo de permiso'
                ]);
                exit;
            }
            
            $tipos_validos = ['LECTURA', 'ESCRITURA', 'MODIFICACION', 'ELIMINACION', 'REPORTE'];
            if (!in_array($_POST['permiso_tipo'], $tipos_validos)) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El tipo de permiso no es válido'
                ]);
                exit;
            }
            
            $_POST['permiso_desc'] = ucwords(strtolower(trim(htmlspecialchars($_POST['permiso_desc']))));
            
            $cantidad_desc = strlen($_POST['permiso_desc']);
            
            if ($cantidad_desc < 5) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Descripción debe de tener mas de 4 caracteres'
                ]);
                exit;
            }

            $verificarPermisoExistente = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE app_id = '{$_POST['app_id']}' AND permiso_tipo = '{$_POST['permiso_tipo']}' AND permiso_situacion = 1");

            if (count($verificarPermisoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe un permiso de este tipo para esta aplicación'
                ]);
                exit;
            }

            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = {$_POST['app_id']}";
            $app_data = self::fetchFirst($sql_app);
            
            $permiso = new Permisos($_POST);
            $resultado = $permiso->crear();

            if($resultado['resultado'] == 1){
                $descripcion = "Creó permiso {$_POST['permiso_tipo']} para aplicación {$app_data['app_nombre_corto']}";
                
               HistorialActController::registrarActividad('PERMISOS', 'CREAR', $descripcion, 'permisos/guardar');
                
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Permiso creado correctamente',
                ]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error al crear el permiso',
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
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $sql = "SELECT 
                        p.*,
                        a.app_nombre_corto
                    FROM pmlx_permiso p 
                    INNER JOIN pmlx_aplicacion a ON p.app_id = a.app_id 
                    WHERE p.permiso_situacion = 1 
                    ORDER BY a.app_nombre_corto, p.permiso_tipo";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Permisos obtenidos correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los permisos',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $id = $_POST['permiso_id'];
        
        $_POST['app_id'] = filter_var($_POST['app_id'], FILTER_SANITIZE_NUMBER_INT);
        
        if ($_POST['app_id'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar una aplicación válida'
            ]);
            return;
        }

        $_POST['permiso_tipo'] = trim(htmlspecialchars($_POST['permiso_tipo']));
        
        if (empty($_POST['permiso_tipo'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar un tipo de permiso'
            ]);
            return;
        }
        
        $tipos_validos = ['LECTURA', 'ESCRITURA', 'MODIFICACION', 'ELIMINACION', 'REPORTE'];
        if (!in_array($_POST['permiso_tipo'], $tipos_validos)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El tipo de permiso no es válido'
            ]);
            return;
        }

        $_POST['permiso_desc'] = ucwords(strtolower(trim(htmlspecialchars($_POST['permiso_desc']))));

        $cantidad_desc = strlen($_POST['permiso_desc']);

        if ($cantidad_desc < 5) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Descripción debe de tener mas de 4 caracteres'
            ]);
            return;
        }

        try {
            $verificarPermisoExistente = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE app_id = '{$_POST['app_id']}' AND permiso_tipo = '{$_POST['permiso_tipo']}' AND permiso_situacion = 1 AND permiso_id != {$id}");

            if (count($verificarPermisoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otro permiso de este tipo para esta aplicación'
                ]);
                return;
            }

            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = {$_POST['app_id']}";
            $app_data = self::fetchFirst($sql_app);

            $sql = "UPDATE pmlx_permiso SET 
                    app_id = '{$_POST['app_id']}',
                    permiso_tipo = '{$_POST['permiso_tipo']}',
                    permiso_desc = '{$_POST['permiso_desc']}'
                    WHERE permiso_id = {$id}";
            
            $resultado = self::SQL($sql);

            $descripcion = "Modificó permiso {$_POST['permiso_tipo']} para aplicación {$app_data['app_nombre_corto']}";
            
            HistorialActController::registrarActividad('PERMISOS', 'ACTUALIZAR', $descripcion, 'permisos/modificar');

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La información del permiso ha sido modificada exitosamente'
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
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
            
            $verificarAsignaciones = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_permiso_id = {$id} AND asignacion_situacion = 1");

            if (count($verificarAsignaciones) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'No se puede eliminar el permiso porque está asignado a usuarios'
                ]);
                return;
            }

            $sql_permiso = "SELECT p.permiso_tipo, a.app_nombre_corto 
                           FROM pmlx_permiso p 
                           INNER JOIN pmlx_aplicacion a ON p.app_id = a.app_id 
                           WHERE p.permiso_id = $id";
            $permiso_data = self::fetchFirst($sql_permiso);
            
            $ejecutar = Permisos::EliminarPermiso($id);

            if ($permiso_data) {
                $descripcion = "Eliminó permiso {$permiso_data['permiso_tipo']} de aplicación {$permiso_data['app_nombre_corto']}";
                
              HistorialActController::registrarActividad('PERMISOS', 'ELIMINAR', $descripcion, 'permisos/eliminar');
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

    public static function buscarAplicacionesAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            // CORREGIDO: Era "pmxl_aplicacion" ahora es "pmlx_aplicacion"
            $sql = "SELECT app_id, app_nombre_corto FROM pmlx_aplicacion WHERE app_situacion = 1 ORDER BY app_nombre_corto";
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
}