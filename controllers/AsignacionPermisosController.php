<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\AsignacionPermisos;
use Controllers\HistorialActController;

class AsignacionPermisosController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('asignacionpermisos/index', []);
    }

    public static function guardarAPI()
    {
        getHeadersApi();
    
        try {
            $_POST['asignacion_usuario_id'] = filter_var($_POST['asignacion_usuario_id'], FILTER_SANITIZE_NUMBER_INT);
            
            if ($_POST['asignacion_usuario_id'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar un usuario válido'
                ]);
                exit;
            }

            $_POST['asignacion_app_id'] = filter_var($_POST['asignacion_app_id'], FILTER_SANITIZE_NUMBER_INT);
            
            if ($_POST['asignacion_app_id'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar una aplicación válida'
                ]);
                exit;
            }

            $_POST['asignacion_permiso_id'] = filter_var($_POST['asignacion_permiso_id'], FILTER_SANITIZE_NUMBER_INT);
            
            if ($_POST['asignacion_permiso_id'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar un permiso válido'
                ]);
                exit;
            }

            $_POST['asignacion_usuario_asigno'] = filter_var($_POST['asignacion_usuario_asigno'], FILTER_SANITIZE_NUMBER_INT);
            
            if ($_POST['asignacion_usuario_asigno'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe especificar quién asigna el permiso'
                ]);
                exit;
            }

            $_POST['asignacion_motivo'] = trim(htmlspecialchars($_POST['asignacion_motivo']));
            
            $cantidad_motivo = strlen($_POST['asignacion_motivo']);
            
            if ($cantidad_motivo < 5) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El motivo debe tener más de 4 caracteres'
                ]);
                exit;
            }

            $verificarPermisoExiste = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE permiso_id = {$_POST['asignacion_permiso_id']} AND app_id = {$_POST['asignacion_app_id']} AND permiso_situacion = 1");

            if (count($verificarPermisoExiste) == 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El permiso seleccionado no pertenece a la aplicación elegida'
                ]);
                exit;
            }

            $verificarDuplicado = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_usuario_id = {$_POST['asignacion_usuario_id']} AND asignacion_permiso_id = {$_POST['asignacion_permiso_id']} AND asignacion_situacion = 1");

            if (count($verificarDuplicado) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Este permiso ya está asignado al usuario seleccionado'
                ]);
                exit;
            }

            $sql_usuario = "SELECT usuario_nom1, usuario_ape1 FROM pmlx_usuario WHERE usuario_id = {$_POST['asignacion_usuario_id']}";
            $usuario_data = self::fetchFirst($sql_usuario);
            
            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = {$_POST['asignacion_app_id']}";
            $app_data = self::fetchFirst($sql_app);
            
            $sql_permiso = "SELECT permiso_tipo FROM pmlx_permiso WHERE permiso_id = {$_POST['asignacion_permiso_id']}";
            $permiso_data = self::fetchFirst($sql_permiso);
            
           $asignacion = new AsignacionPermisos($_POST);
            $resultado = $asignacion->crear();

            if($resultado['resultado'] == 1){
                $usuario_nombre = $usuario_data['usuario_nom1'] . ' ' . $usuario_data['usuario_ape1'];
                $descripcion = "Asignó permiso {$permiso_data['permiso_tipo']} de {$app_data['app_nombre_corto']} a {$usuario_nombre}";
                
                //HistorialActController::registrarActividad('ASIGNACION_PERMISOS', 'ASIGNAR', $descripcion, 'asignacionpermisos/guardar');
                
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Permiso asignado correctamente',
                ]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error al asignar el permiso',
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
            $sql = "SELECT 
                        ap.*,
                        u.usuario_nom1,
                        u.usuario_ape1,
                        a.app_nombre_corto,
                        p.permiso_tipo,
                        p.permiso_desc,
                        ua.usuario_nom1 as asigno_nom1,
                        ua.usuario_ape1 as asigno_ape1
                    FROM pmlx_asig_permisos ap 
                    INNER JOIN pmlx_usuario u ON ap.asignacion_usuario_id = u.usuario_id
                    INNER JOIN pmlx_aplicacion a ON ap.asignacion_app_id = a.app_id 
                    INNER JOIN pmlx_permiso p ON ap.asignacion_permiso_id = p.permiso_id
                    INNER JOIN pmlx_usuario ua ON ap.asignacion_usuario_asigno = ua.usuario_id
                    WHERE ap.asignacion_situacion = 1 
                    ORDER BY ap.asignacion_fecha_creacion DESC";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Asignaciones obtenidas correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener las asignaciones',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        getHeadersApi();

        $id = $_POST['asignacion_id'];
        
        $_POST['asignacion_usuario_id'] = filter_var($_POST['asignacion_usuario_id'], FILTER_SANITIZE_NUMBER_INT);
        
        if ($_POST['asignacion_usuario_id'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar un usuario válido'
            ]);
            return;
        }

        $_POST['asignacion_app_id'] = filter_var($_POST['asignacion_app_id'], FILTER_SANITIZE_NUMBER_INT);
        
        if ($_POST['asignacion_app_id'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar una aplicación válida'
            ]);
            return;
        }

        $_POST['asignacion_permiso_id'] = filter_var($_POST['asignacion_permiso_id'], FILTER_SANITIZE_NUMBER_INT);
        
        if ($_POST['asignacion_permiso_id'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar un permiso válido'
            ]);
            return;
        }

        $_POST['asignacion_usuario_asigno'] = filter_var($_POST['asignacion_usuario_asigno'], FILTER_SANITIZE_NUMBER_INT);
        
        if ($_POST['asignacion_usuario_asigno'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar un usuario válido'
            ]);
            return;
        }

        $_POST['asignacion_motivo'] = trim(htmlspecialchars($_POST['asignacion_motivo']));
        
        $cantidad_motivo = strlen($_POST['asignacion_motivo']);
        
        if ($cantidad_motivo < 5) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El motivo debe tener más de 4 caracteres'
            ]);
            return;
        }

        try {
            $verificarPermisoExiste = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE permiso_id = {$_POST['asignacion_permiso_id']} AND app_id = {$_POST['asignacion_app_id']} AND permiso_situacion = 1");

            if (count($verificarPermisoExiste) == 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El permiso seleccionado no pertenece a la aplicación elegida'
                ]);
                return;
            }

            $verificarDuplicado = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_usuario_id = {$_POST['asignacion_usuario_id']} AND asignacion_permiso_id = {$_POST['asignacion_permiso_id']} AND asignacion_situacion = 1 AND asignacion_id != {$id}");

            if (count($verificarDuplicado) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Este permiso ya está asignado al usuario seleccionado'
                ]);
                return;
            }

            $sql_usuario = "SELECT usuario_nom1, usuario_ape1 FROM pmlx_usuario WHERE usuario_id = {$_POST['asignacion_usuario_id']}";
            $usuario_data = self::fetchFirst($sql_usuario);
            
            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = {$_POST['asignacion_app_id']}";
            $app_data = self::fetchFirst($sql_app);
            
            $sql_permiso = "SELECT permiso_tipo FROM pmlx_permiso WHERE permiso_id = {$_POST['asignacion_permiso_id']}";
            $permiso_data = self::fetchFirst($sql_permiso);

            $sql = "UPDATE pmlx_asig_permisos SET 
                    asignacion_usuario_id = '{$_POST['asignacion_usuario_id']}',
                    asignacion_app_id = '{$_POST['asignacion_app_id']}',
                    asignacion_permiso_id = '{$_POST['asignacion_permiso_id']}',
                    asignacion_usuario_asigno = '{$_POST['asignacion_usuario_asigno']}',
                    asignacion_motivo = '{$_POST['asignacion_motivo']}'
                    WHERE asignacion_id = {$id}";
            
            $resultado = self::SQL($sql);

            $usuario_nombre = $usuario_data['usuario_nom1'] . ' ' . $usuario_data['usuario_ape1'];
            $descripcion = "Modificó asignación de permiso {$permiso_data['permiso_tipo']} de {$app_data['app_nombre_corto']} para {$usuario_nombre}";
            
            //HistorialActController::registrarActividad('ASIGNACION_PERMISOS', 'ACTUALIZAR', $descripcion, 'asignacionpermisos/modificar');

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La asignación ha sido modificada exitosamente'
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
            
            $sql_asignacion = "SELECT 
                                    u.usuario_nom1, u.usuario_ape1,
                                    a.app_nombre_corto,
                                    p.permiso_tipo
                                FROM pmlx_asig_permisos ap
                                INNER JOIN pmlx_usuario u ON ap.asignacion_usuario_id = u.usuario_id
                                INNER JOIN pmlx_aplicacion a ON ap.asignacion_app_id = a.app_id
                                INNER JOIN pmlx_permiso p ON ap.asignacion_permiso_id = p.permiso_id
                                WHERE ap.asignacion_id = $id";
            $asignacion_data = self::fetchFirst($sql_asignacion);
            
            //$ejecutar = AsignacionPermisos::EliminarAsignacion($id);

            if ($asignacion_data) {
                $usuario_nombre = $asignacion_data['usuario_nom1'] . ' ' . $asignacion_data['usuario_ape1'];
                $descripcion = "Eliminó asignación de permiso {$asignacion_data['permiso_tipo']} de {$asignacion_data['app_nombre_corto']} para {$usuario_nombre}";
                
                //HistorialActController::registrarActividad('ASIGNACION_PERMISOS', 'ELIMINAR', $descripcion, 'asignacionpermisos/eliminar');
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Asignación eliminada correctamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al eliminar la asignación',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function buscarUsuariosAPI()
    {
        try {
            $sql = "SELECT usuario_id, usuario_nom1, usuario_ape1 
                    FROM pmlx_usuario 
                    WHERE usuario_situacion = 1 AND usuario_rol = 'usuario'
                    ORDER BY usuario_nom1";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Usuarios obtenidos correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los usuarios',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function buscarAplicacionesAPI()
    {
        try {
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

    public static function buscarPermisosAPI()
    {
        try {
            $app_id = isset($_GET['app_id']) ? $_GET['app_id'] : null;

            if ($app_id) {
                $sql = "SELECT permiso_id, permiso_tipo, permiso_desc, app_id
                        FROM pmlx_permiso 
                        WHERE app_id = {$app_id} AND permiso_situacion = 1 
                        ORDER BY permiso_tipo";
            } else {
                $sql = "SELECT permiso_id, permiso_tipo, permiso_desc, app_id
                        FROM pmlx_permiso 
                        WHERE permiso_situacion = 1 
                        ORDER BY permiso_tipo";
            }
            
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

    public static function buscarAdministradoresAPI()
    {
        try {
            $sql = "SELECT usuario_id, usuario_nom1, usuario_ape1 
                    FROM pmlx_usuario 
                    WHERE usuario_situacion = 1 AND usuario_rol = 'administrador'
                    ORDER BY usuario_nom1";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Administradores obtenidos correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los administradores',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
}