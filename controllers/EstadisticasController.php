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

   // MÉTODOS ADICIONALES SIMPLIFICADOS

   public static function buscarUsuariosPorDominioCorreoAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           // Versión simplificada sin funciones complejas de string
           $sql = "SELECT 
                       usuario_correo as dominio_correo, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_correo IS NOT NULL
                   GROUP BY usuario_correo
                   ORDER BY cantidad DESC";
                   
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
           error_log("Error en buscarUsuariosPorDominioCorreoAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por dominio de correo: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

     public static function buscarUsuariosPorInicialNombreAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           // Versión simplificada
           $sql = "SELECT 
                       usuario_nom1 as inicial_nombre, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_nom1 IS NOT NULL
                   GROUP BY usuario_nom1
                   ORDER BY cantidad DESC";
                   
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
           error_log("Error en buscarUsuariosPorInicialNombreAPI: " . $e->getMessage());
           http_response_code(200);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por inicial del nombre: ' . $e->getMessage(),
               'data' => []
           ]);
       }
   }

   public static function buscarUsuariosUltimos30DiasAPI(){
       header('Content-Type: application/json');
       header('Access-Control-Allow-Origin: *');
       
       try {
           $sql = "SELECT 
                       usuario_fecha_creacion as fecha_registro, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_fecha_creacion >= (TODAY - 30)
                   GROUP BY usuario_fecha_creacion 
                   ORDER BY fecha_registro DESC";
                   
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
}