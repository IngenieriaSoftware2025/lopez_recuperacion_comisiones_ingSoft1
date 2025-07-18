<?php

namespace Controllers;

use Exception;
use Model\ActiveRecord;
use MVC\Router;

class EstadisticasController extends ActiveRecord
{

   public static function renderizarPagina(Router $router)
   {
       $router->render('estadisticas/index', []);
   }

   // Test API
   public static function testAPI() {
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'API funcionando correctamente',
               'data' => ['status' => 'OK', 'timestamp' => date('Y-m-d H:i:s')]
           ]);
       } catch (Exception $e) {
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error en test API: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Usuarios últimos 30 días
   public static function buscarUsuariosUltimos30DiasAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       DATE(usuario_fecha_creacion) as fecha_registro, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                   GROUP BY DATE(usuario_fecha_creacion) 
                   ORDER BY fecha_registro DESC
                   LIMIT 30";
                   
           error_log("SQL Usuarios últimos 30 días: " . $sql);
           $data = self::fetchArray($sql);
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios de los últimos 30 días obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarUsuariosUltimos30DiasAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios de los últimos 30 días: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Usuarios por nombre (inicial)
   public static function buscarUsuariosPorNombreAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       LEFT(usuario_nom1, 1) as inicial_nombre, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_nom1 IS NOT NULL
                       AND usuario_nom1 != ''
                   GROUP BY LEFT(usuario_nom1, 1)
                   ORDER BY cantidad DESC
                   LIMIT 15";
                   
           error_log("SQL Usuarios por inicial: " . $sql);
           $data = self::fetchArray($sql);
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por inicial del nombre obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarUsuariosPorNombreAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por inicial del nombre: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Personal por rango
   public static function buscarPersonalPorRangoAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       personal_rango as rango, 
                       COUNT(*) as cantidad 
                   FROM pmlx_personal_comisiones 
                   WHERE personal_situacion = 1
                   GROUP BY personal_rango 
                   ORDER BY cantidad DESC";
                   
           error_log("SQL Personal por rango: " . $sql);
           $data = self::fetchArray($sql);
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Personal por rango obtenido correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarPersonalPorRangoAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener personal por rango: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Usuarios por correo (dominio)
   public static function buscarUsuariosPorCorreoAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       SUBSTRING_INDEX(usuario_correo, '@', -1) as dominio_correo, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_correo IS NOT NULL
                       AND usuario_correo LIKE '%@%'
                   GROUP BY SUBSTRING_INDEX(usuario_correo, '@', -1)
                   ORDER BY cantidad DESC
                   LIMIT 10";
                   
           error_log("SQL Usuarios por dominio: " . $sql);
           $data = self::fetchArray($sql);
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por dominio de correo obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarUsuariosPorCorreoAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por dominio de correo: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Comisiones por estado
   public static function buscarComisionesPorEstadoAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       comision_estado as estado, 
                       COUNT(*) as cantidad 
                   FROM pmlx_comision 
                   WHERE comision_situacion = 1
                   GROUP BY comision_estado 
                   ORDER BY cantidad DESC";
                   
           error_log("SQL Comisiones por estado: " . $sql);
           $data = self::fetchArray($sql);
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Comisiones por estado obtenidas correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarComisionesPorEstadoAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener comisiones por estado: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   // Resumen general
   public static function buscarResumenGeneralAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       (SELECT COUNT(*) FROM pmlx_usuario WHERE usuario_situacion = 1) as total_usuarios,
                       (SELECT COUNT(*) FROM pmlx_comision WHERE comision_situacion = 1) as total_comisiones,
                       (SELECT COUNT(*) FROM pmlx_personal_comisiones WHERE personal_situacion = 1) as total_personal,
                       (SELECT COUNT(*) FROM pmlx_aplicacion WHERE aplicacion_situacion = 1) as total_aplicaciones,
                       (SELECT COUNT(*) FROM pmlx_permiso WHERE permiso_situacion = 1) as total_permisos,
                       (SELECT COUNT(*) FROM pmlx_usuario_aplicacion WHERE usuario_aplicacion_situacion = 1) as total_asignaciones_permisos";
                   
           error_log("SQL Resumen general: " . $sql);
           $result = self::fetchArray($sql);
           $data = $result[0] ?? [];
           error_log("Resultado: " . print_r($data, true));

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Resumen general obtenido correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           error_log("Error en buscarResumenGeneralAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener resumen general: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }
}