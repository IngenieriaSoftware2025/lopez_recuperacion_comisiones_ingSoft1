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

   public static function buscarUsuariosPorSituacionAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT 
                       CASE 
                           WHEN usuario_situacion = 1 THEN 'Activos' 
                           ELSE 'Inactivos' 
                       END as estado, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   GROUP BY usuario_situacion 
                   ORDER BY cantidad DESC";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por situación obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por situación',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarUsuariosPorAnoRegistroAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT 
                       YEAR(usuario_fecha_creacion) as año_registro, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_fecha_creacion IS NOT NULL
                   GROUP BY YEAR(usuario_fecha_creacion) 
                   ORDER BY año_registro DESC";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por año de registro obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por año de registro',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarUsuariosPorDominioCorreoAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT FIRST 10
                       SUBSTRING(usuario_correo FROM POSITION('@' IN usuario_correo) + 1) as dominio_correo, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                   GROUP BY SUBSTRING(usuario_correo FROM POSITION('@' IN usuario_correo) + 1)
                   ORDER BY cantidad DESC";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por dominio de correo obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por dominio de correo',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarUsuariosPorMesAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT 
                       CASE MONTH(usuario_fecha_creacion)
                           WHEN 1 THEN 'Enero'
                           WHEN 2 THEN 'Febrero'
                           WHEN 3 THEN 'Marzo'
                           WHEN 4 THEN 'Abril'
                           WHEN 5 THEN 'Mayo'
                           WHEN 6 THEN 'Junio'
                           WHEN 7 THEN 'Julio'
                           WHEN 8 THEN 'Agosto'
                           WHEN 9 THEN 'Septiembre'
                           WHEN 10 THEN 'Octubre'
                           WHEN 11 THEN 'Noviembre'
                           WHEN 12 THEN 'Diciembre'
                       END as mes, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_fecha_creacion IS NOT NULL
                       AND YEAR(usuario_fecha_creacion) = YEAR(CURRENT)
                   GROUP BY MONTH(usuario_fecha_creacion) 
                   ORDER BY MONTH(usuario_fecha_creacion)";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por mes del año actual obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por mes',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarResumenGeneralAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT 
                       'Total Usuarios' as categoria, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario
                   UNION ALL
                   SELECT 
                       'Usuarios Activos' as categoria, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1
                   UNION ALL
                   SELECT 
                       'Usuarios con Foto' as categoria, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_fotografia IS NOT NULL 
                       AND usuario_fotografia != ''
                   UNION ALL
                   SELECT 
                       'Registros Hoy' as categoria, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE DATE(usuario_fecha_creacion) = TODAY";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Resumen general obtenido correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener el resumen general',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarUsuariosPorInicialNombreAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT FIRST 10
                       UPPER(LEFT(usuario_nom1, 1)) as inicial_nombre, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                   GROUP BY UPPER(LEFT(usuario_nom1, 1))
                   ORDER BY cantidad DESC";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios por inicial del nombre obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios por inicial del nombre',
               'detalle' => $e->getMessage()
           ]);
       }
   }

   public static function buscarUsuariosUltimos30DiasAPI(){
       header('Content-Type: application/json');
       try {
           $sql = "SELECT 
                       DATE(usuario_fecha_creacion) as fecha_registro, 
                       COUNT(*) as cantidad 
                   FROM pmlx_usuario 
                   WHERE usuario_situacion = 1 
                       AND usuario_fecha_creacion >= CURRENT - INTERVAL 30 DAY
                   GROUP BY DATE(usuario_fecha_creacion) 
                   ORDER BY fecha_registro DESC";
           $data = self::fetchArray($sql);

           http_response_code(200);
           echo json_encode([
               'codigo' => 1,
               'mensaje' => 'Usuarios de los últimos 30 días obtenidos correctamente',
               'data' => $data
           ]);
       } catch (Exception $e) {
           http_response_code(400);
           echo json_encode([
               'codigo' => 0,
               'mensaje' => 'Error al obtener usuarios de los últimos 30 días',
               'detalle' => $e->getMessage()
           ]);
       }
   }
}