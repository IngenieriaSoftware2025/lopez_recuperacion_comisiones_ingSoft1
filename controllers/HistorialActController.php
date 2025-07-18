<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\HistorialAct;

class HistorialActController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('historial/index', []);
    }

    public static function registrarActividad($modulo, $accion, $descripcion, $ruta = '')
    {
        try {
            session_start();
            if(isset($_SESSION['usuario_id'])) {
                $historial_actividad = new HistorialAct([
                    'historial_usuario_id' => $_SESSION['usuario_id'],
                    'historial_usuario_nombre' => $_SESSION['user'],
                    'historial_modulo' => $modulo,
                    'historial_accion' => $accion,
                    'historial_descripcion' => $descripcion,
                    'historial_ip' => $_SERVER['REMOTE_ADDR'] ?? 'No disponible',
                    'historial_ruta' => $ruta,
                    'historial_situacion' => 1
                ]);
                $historial_actividad->crear();
            }
        } catch (Exception $e) {
            error_log("Error al registrar actividad: " . $e->getMessage());
        }
    }

    public static function buscarAPI()
    {
        error_log("=== DEBUG buscarAPI INFORMIX ===");
        
        try {
            // Configurar headers
            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');
            
            // Obtener parámetros
            $fecha_inicio = isset($_GET['fecha_inicio']) ? trim($_GET['fecha_inicio']) : null;
            $fecha_fin = isset($_GET['fecha_fin']) ? trim($_GET['fecha_fin']) : null;
            $usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : null;
            $modulo = isset($_GET['modulo']) ? trim($_GET['modulo']) : null;
            $accion = isset($_GET['accion']) ? trim($_GET['accion']) : null;

            error_log("Parámetros: fecha_inicio=$fecha_inicio, fecha_fin=$fecha_fin, usuario_id=$usuario_id, modulo=$modulo, accion=$accion");

            // Construir WHERE para Informix (sintaxis específica)
            $where_conditions = ["historial_situacion = 1"];

            // Para fechas en Informix, usar formato específico
            if ($fecha_inicio && !empty($fecha_inicio)) {
                $where_conditions[] = "historial_fecha_creacion >= '$fecha_inicio 00:00:00'";
            }

            if ($fecha_fin && !empty($fecha_fin)) {
                $where_conditions[] = "historial_fecha_creacion <= '$fecha_fin 23:59:59'";
            }

            if ($usuario_id && $usuario_id > 0) {
                $where_conditions[] = "historial_usuario_id = $usuario_id";
            }

            if ($modulo && !empty($modulo)) {
                $where_conditions[] = "historial_modulo = '$modulo'";
            }

            if ($accion && !empty($accion)) {
                $where_conditions[] = "historial_accion = '$accion'";
            }

            $where = implode(" AND ", $where_conditions);
            
            // SQL compatible con Informix - SIN DATE_FORMAT (no existe en Informix)
            $sql = "SELECT 
                        historial_id,
                        historial_usuario_id,
                        historial_usuario_nombre,
                        historial_modulo,
                        historial_accion,
                        historial_descripcion,
                        historial_ip,
                        historial_ruta,
                        historial_fecha_creacion,
                        historial_situacion
                    FROM pmlx_historial_act 
                    WHERE $where 
                    ORDER BY historial_fecha_creacion DESC, historial_id DESC";

            error_log("SQL Query Informix: " . $sql);

            // Usar el método fetchArray de ActiveRecord para Informix
            $data = self::fetchArray($sql);

            if ($data === false || $data === null) {
                throw new Exception("Error al ejecutar la consulta o sin resultados");
            }

            // Formatear fechas manualmente después de obtener los datos
            if (is_array($data)) {
                foreach ($data as &$row) {
                    if (isset($row['historial_fecha_creacion'])) {
                        // Formatear fecha manualmente
                        $fecha = $row['historial_fecha_creacion'];
                        if ($fecha) {
                            // Convertir a formato legible
                            $timestamp = strtotime($fecha);
                            if ($timestamp !== false) {
                                $row['historial_fecha_creacion'] = date('d/m/Y H:i:s', $timestamp);
                            }
                        }
                    }
                }
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Actividades obtenidas correctamente',
                'data' => $data ?: [],
                'total' => count($data ?: [])
            ], JSON_UNESCAPED_UNICODE);

        } catch (Exception $e) {
            error_log("ERROR en buscarAPI: " . $e->getMessage());
            
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener las actividades',
                'detalle' => $e->getMessage(),
                'data' => []
            ], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }

    public static function buscarUsuariosAPI()
    {
        error_log("=== DEBUG buscarUsuariosAPI INFORMIX ===");
        
        try {
            // Configurar headers
            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');
            
            // SQL simple compatible con Informix
            $sql = "SELECT DISTINCT 
                        historial_usuario_id, 
                        historial_usuario_nombre 
                    FROM pmlx_historial_act 
                    WHERE historial_situacion = 1 
                        AND historial_usuario_id IS NOT NULL 
                        AND historial_usuario_nombre IS NOT NULL
                    ORDER BY historial_usuario_nombre";
                    
            error_log("SQL Usuarios Informix: " . $sql);
            
            // Usar fetchArray de ActiveRecord
            $data = self::fetchArray($sql);

            if ($data === false || $data === null) {
                // Si no hay datos, devolver array vacío pero sin error
                $data = [];
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Usuarios obtenidos correctamente',
                'data' => $data,
                'total' => count($data)
            ], JSON_UNESCAPED_UNICODE);

        } catch (Exception $e) {
            error_log("ERROR en buscarUsuariosAPI: " . $e->getMessage());
            
            http_response_code(200);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los usuarios',
                'detalle' => $e->getMessage(),
                'data' => []
            ], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }

    // Método de prueba para verificar la tabla
    public static function verificarTablaAPI()
    {
        try {
            header('Content-Type: application/json; charset=utf-8');
            
            // Consulta muy simple para probar
            $sql = "SELECT COUNT(*) as total FROM pmlx_historial_act WHERE historial_situacion = 1";
            $result = self::fetchArray($sql);
            
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Tabla verificada correctamente',
                'data' => $result,
                'sql' => $sql
            ], JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al verificar tabla',
                'detalle' => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }
}