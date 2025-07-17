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

    // MÉTODO CORREGIDO PARA INFORMIX: Usuarios
    public static function buscarUsuariosAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            // Consulta básica para Informix - sin verificar estructura
            $sql = "SELECT usuario_id, usuario_nom1, usuario_ape1, usuario_rol 
                    FROM pmlx_usuario 
                    WHERE usuario_situacion = 1";
            
            error_log("SQL Usuarios: " . $sql);
            $data = self::fetchArray($sql);
            error_log("Resultado usuarios: " . print_r($data, true));

            // Filtrar solo usuarios regulares si existe el campo rol
            $usuarios_filtrados = [];
            foreach ($data as $usuario) {
                // Si no tiene rol o el rol es 'usuario', incluirlo
                if (!isset($usuario['usuario_rol']) || 
                    $usuario['usuario_rol'] == 'usuario' || 
                    $usuario['usuario_rol'] == '' || 
                    $usuario['usuario_rol'] == null) {
                    $usuarios_filtrados[] = $usuario;
                }
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Usuarios obtenidos correctamente',
                'data' => $usuarios_filtrados
            ]);

        } catch (Exception $e) {
            error_log("Error en buscarUsuariosAPI: " . $e->getMessage());
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los usuarios: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    // MÉTODO CORREGIDO PARA INFORMIX: Administradores
    public static function buscarAdministradoresAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            // Consulta básica para Informix
            $sql = "SELECT usuario_id, usuario_nom1, usuario_ape1, usuario_rol 
                    FROM pmlx_usuario 
                    WHERE usuario_situacion = 1";
            
            error_log("SQL Administradores: " . $sql);
            $data = self::fetchArray($sql);
            error_log("Resultado administradores: " . print_r($data, true));

            // Filtrar administradores en PHP
            $administradores = [];
            foreach ($data as $usuario) {
                // Si tiene rol de administrador o no especifica rol (asumir que puede ser admin)
                if (isset($usuario['usuario_rol']) && $usuario['usuario_rol'] == 'administrador') {
                    $administradores[] = $usuario;
                } else if (!isset($usuario['usuario_rol']) || $usuario['usuario_rol'] == '') {
                    // Si no hay rol definido, incluir todos (puedes cambiar esta lógica)
                    $administradores[] = $usuario;
                }
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Administradores obtenidos correctamente',
                'data' => $administradores
            ]);

        } catch (Exception $e) {
            error_log("Error en buscarAdministradoresAPI: " . $e->getMessage());
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los administradores: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    // MÉTODO CORREGIDO PARA INFORMIX: Aplicaciones
    public static function buscarAplicacionesAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $sql = "SELECT app_id, app_nombre_corto FROM pmlx_aplicacion WHERE app_situacion = 1 ORDER BY app_nombre_corto";
            error_log("SQL Aplicaciones: " . $sql);
            $data = self::fetchArray($sql);
            error_log("Resultado aplicaciones: " . print_r($data, true));

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Aplicaciones obtenidas correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log("Error en buscarAplicacionesAPI: " . $e->getMessage());
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener las aplicaciones: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    public static function buscarPermisosAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $app_id = isset($_GET['app_id']) ? (int)$_GET['app_id'] : null;

            if ($app_id && $app_id > 0) {
                $sql = "SELECT permiso_id, permiso_tipo, permiso_desc, app_id
                        FROM pmlx_permiso 
                        WHERE app_id = $app_id AND permiso_situacion = 1 
                        ORDER BY permiso_tipo";
            } else {
                $sql = "SELECT permiso_id, permiso_tipo, permiso_desc, app_id
                        FROM pmlx_permiso 
                        WHERE permiso_situacion = 1 
                        ORDER BY permiso_tipo";
            }
            
            error_log("SQL Permisos: " . $sql);
            $data = self::fetchArray($sql);
            error_log("Resultado permisos: " . print_r($data, true));

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Permisos obtenidos correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log("Error en buscarPermisosAPI: " . $e->getMessage());
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los permisos: ' . $e->getMessage(),
                'data' => []
            ]);
        }
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

            // Verificaciones para Informix - usar prepared statements si es posible
            $usuario_id = (int)$_POST['asignacion_usuario_id'];
            $app_id = (int)$_POST['asignacion_app_id'];
            $permiso_id = (int)$_POST['asignacion_permiso_id'];

            $verificarPermisoExiste = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE permiso_id = $permiso_id AND app_id = $app_id AND permiso_situacion = 1");

            if (count($verificarPermisoExiste) == 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El permiso seleccionado no pertenece a la aplicación elegida'
                ]);
                exit;
            }

            $verificarDuplicado = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_usuario_id = $usuario_id AND asignacion_permiso_id = $permiso_id AND asignacion_situacion = 1");

            if (count($verificarDuplicado) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Este permiso ya está asignado al usuario seleccionado'
                ]);
                exit;
            }

            $sql_usuario = "SELECT usuario_nom1, usuario_ape1 FROM pmlx_usuario WHERE usuario_id = $usuario_id";
            $usuario_data = self::fetchFirst($sql_usuario);
            
            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = $app_id";
            $app_data = self::fetchFirst($sql_app);
            
            $sql_permiso = "SELECT permiso_tipo FROM pmlx_permiso WHERE permiso_id = $permiso_id";
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
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $sql = "SELECT 
                        ap.asignacion_id,
                        ap.asignacion_usuario_id,
                        ap.asignacion_app_id,
                        ap.asignacion_permiso_id,
                        ap.asignacion_usuario_asigno,
                        ap.asignacion_motivo,
                        ap.asignacion_situacion,
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
                    ORDER BY ap.asignacion_id DESC";
            
            error_log("SQL buscarAPI: " . $sql);
            $data = self::fetchArray($sql);
            error_log("Resultado buscarAPI: " . print_r($data, true));

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Asignaciones obtenidas correctamente',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log("Error en buscarAPI: " . $e->getMessage());
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
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $id = (int)$_POST['asignacion_id'];
        
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
            $usuario_id = (int)$_POST['asignacion_usuario_id'];
            $app_id = (int)$_POST['asignacion_app_id'];
            $permiso_id = (int)$_POST['asignacion_permiso_id'];
            $usuario_asigno = (int)$_POST['asignacion_usuario_asigno'];
            $motivo = $_POST['asignacion_motivo'];

            $verificarPermisoExiste = self::fetchArray("SELECT permiso_id FROM pmlx_permiso WHERE permiso_id = $permiso_id AND app_id = $app_id AND permiso_situacion = 1");

            if (count($verificarPermisoExiste) == 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El permiso seleccionado no pertenece a la aplicación elegida'
                ]);
                return;
            }

            $verificarDuplicado = self::fetchArray("SELECT asignacion_id FROM pmlx_asig_permisos WHERE asignacion_usuario_id = $usuario_id AND asignacion_permiso_id = $permiso_id AND asignacion_situacion = 1 AND asignacion_id != $id");

            if (count($verificarDuplicado) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Este permiso ya está asignado al usuario seleccionado'
                ]);
                return;
            }

            $sql_usuario = "SELECT usuario_nom1, usuario_ape1 FROM pmlx_usuario WHERE usuario_id = $usuario_id";
            $usuario_data = self::fetchFirst($sql_usuario);
            
            $sql_app = "SELECT app_nombre_corto FROM pmlx_aplicacion WHERE app_id = $app_id";
            $app_data = self::fetchFirst($sql_app);
            
            $sql_permiso = "SELECT permiso_tipo FROM pmlx_permiso WHERE permiso_id = $permiso_id";
            $permiso_data = self::fetchFirst($sql_permiso);

            $sql = "UPDATE pmlx_asig_permisos SET 
                    asignacion_usuario_id = $usuario_id,
                    asignacion_app_id = $app_id,
                    asignacion_permiso_id = $permiso_id,
                    asignacion_usuario_asigno = $usuario_asigno,
                    asignacion_motivo = '$motivo'
                    WHERE asignacion_id = $id";
            
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
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
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
            
            $ejecutar = AsignacionPermisos::EliminarAsignacion($id);

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
}