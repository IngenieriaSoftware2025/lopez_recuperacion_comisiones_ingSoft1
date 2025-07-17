<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\Comision;
use Controllers\HistorialActController;

class ComisionController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('comisiones/index', []);
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

            $_POST['comision_titulo'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_titulo']))));

            $cantidad_titulo = strlen($_POST['comision_titulo']);

            if ($cantidad_titulo < 5) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Título debe de tener mas de 4 caracteres'
                ]);
                exit;
            }

            if ($cantidad_titulo > 250) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Título no puede exceder los 250 caracteres'
                ]);
                exit;
            }

            $_POST['comision_descripcion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_descripcion']))));

            $cantidad_descripcion = strlen($_POST['comision_descripcion']);

            if ($cantidad_descripcion < 10) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Descripción debe de tener mas de 9 caracteres'
                ]);
                exit;
            }

            $_POST['comision_comando'] = strtoupper(trim(htmlspecialchars($_POST['comision_comando'])));

            if (!in_array($_POST['comision_comando'], ['BRIGADA DE COMUNICACIONES', 'INFORMATICA'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Comando debe ser BRIGADA DE COMUNICACIONES o INFORMATICA'
                ]);
                exit;
            }

            $_POST['comision_fecha_inicio'] = trim(htmlspecialchars($_POST['comision_fecha_inicio']));

            if (empty($_POST['comision_fecha_inicio'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe seleccionar una fecha de inicio'
                ]);
                exit;
            }

            $_POST['comision_duracion'] = filter_var($_POST['comision_duracion'], FILTER_SANITIZE_NUMBER_INT);

            if ($_POST['comision_duracion'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'La duración debe ser mayor a 0'
                ]);
                exit;
            }

            $_POST['comision_duracion_tipo'] = strtoupper(trim(htmlspecialchars($_POST['comision_duracion_tipo'])));

            if (!in_array($_POST['comision_duracion_tipo'], ['HORAS', 'DIAS'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Tipo de duración debe ser HORAS o DIAS'
                ]);
                exit;
            }

            $_POST['comision_ubicacion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_ubicacion']))));

            $cantidad_ubicacion = strlen($_POST['comision_ubicacion']);

            if ($cantidad_ubicacion < 5) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ubicación debe de tener mas de 4 caracteres'
                ]);
                exit;
            }

            $_POST['comision_observaciones'] = trim(htmlspecialchars($_POST['comision_observaciones']));

            $_POST['personal_asignado_id'] = filter_var($_POST['personal_asignado_id'], FILTER_SANITIZE_NUMBER_INT);

            if (empty($_POST['personal_asignado_id']) || $_POST['personal_asignado_id'] <= 0) {
                $_POST['personal_asignado_id'] = null;
            }

            $_POST['comision_usuario_creo'] = filter_var($_POST['comision_usuario_creo'], FILTER_SANITIZE_NUMBER_INT);

            if ($_POST['comision_usuario_creo'] <= 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Debe especificar el usuario que crea la comisión'
                ]);
                exit;
            }

            $verificarComisionExistente = self::fetchArray("SELECT comision_id FROM pmlx_comision WHERE comision_titulo = '{$_POST['comision_titulo']}' AND comision_comando = '{$_POST['comision_comando']}' AND comision_situacion = 1");

            if (count($verificarComisionExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe una comisión registrada con este título para el mismo comando'
                ]);
                exit;
            }

            $fecha_inicio = $_POST['comision_fecha_inicio'];

            if ($_POST['comision_duracion_tipo'] == 'HORAS') {
                $fecha_fin = date('Y-m-d', strtotime($fecha_inicio . ' + ' . $_POST['comision_duracion'] . ' hours'));
            } else {
                $fecha_fin = date('Y-m-d', strtotime($fecha_inicio . ' + ' . $_POST['comision_duracion'] . ' days'));
            }

            $_POST['comision_fecha_inicio'] = date('m/d/Y', strtotime($fecha_inicio));
            $_POST['comision_fecha_fin'] = date('m/d/Y', strtotime($fecha_fin));
            $_POST['comision_estado'] = 'PROGRAMADA';
            $_POST['comision_situacion'] = 1;

            unset($_POST['comision_fecha_creacion']);

            $comision = new Comision($_POST);
            $resultado = $comision->crear();

            if ($resultado['resultado'] == 1) {
                //HistorialActController::registrarActividad('COMISIONES', 'CREAR', 'Registró comisión: ' . $_POST['comision_titulo'], 'comisiones/guardar');

                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Comisión registrada correctamente',
                ]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error en registrar la comisión',
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

    public static function buscarPersonalAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');

        try {
            $sql = "SELECT personal_id, personal_nom1, personal_ape1, personal_rango, personal_unidad 
                    FROM pmlx_personal_comisiones 
                    WHERE personal_situacion = 1 
                    ORDER BY personal_nom1";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Personal obtenido correctamente',
                'data' => $data
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener el personal',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function buscarAPI()
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');

        try {
            $sql = "SELECT 
                          c.comision_id,
                            c.comision_titulo,
                            c.comision_descripcion,
                            c.comision_comando,
                            c.comision_fecha_inicio,
                            c.comision_duracion,
                            c.comision_duracion_tipo,
                            c.comision_fecha_fin,
                            c.comision_ubicacion,
                            c.comision_observaciones,
                            c.comision_estado,
                            c.comision_fecha_creacion,
                            c.comision_usuario_creo,
                            c.personal_asignado_id,
                            c.comision_situacion,
                            COALESCE(u.usuario_nom1, 'Usuario') as usuario_nom1,
                            COALESCE(u.usuario_ape1, 'Desconocido') as usuario_ape1,
                            p.personal_nom1,
                            p.personal_ape1 as personal_apellido
                            FROM pmlx_comision c 
                            LEFT JOIN pmlx_usuario u ON c.comision_usuario_creo = u.usuario_id
                            LEFT JOIN pmlx_personal_comisiones p ON c.personal_asignado_id = p.personal_id
                            WHERE c.comision_situacion = 1 
                            ORDER BY c.comision_fecha_creacion DESC";
                                        $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Comisiones obtenidas correctamente',
                'data' => $data
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener las comisiones',
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

        $id = $_POST['comision_id'];
        $_POST['comision_titulo'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_titulo']))));

        $cantidad_titulo = strlen($_POST['comision_titulo']);

        if ($cantidad_titulo < 5) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Título debe de tener mas de 4 caracteres'
            ]);
            return;
        }

        if ($cantidad_titulo > 250) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Título no puede exceder los 250 caracteres'
            ]);
            return;
        }

        $_POST['comision_descripcion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_descripcion']))));

        $cantidad_descripcion = strlen($_POST['comision_descripcion']);

        if ($cantidad_descripcion < 10) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Descripción debe de tener mas de 9 caracteres'
            ]);
            return;
        }

        $_POST['comision_comando'] = strtoupper(trim(htmlspecialchars($_POST['comision_comando'])));

        if (!in_array($_POST['comision_comando'], ['BRIGADA DE COMUNICACIONES', 'INFORMATICA'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Comando debe ser BRIGADA DE COMUNICACIONES o INFORMATICA'
            ]);
            return;
        }

        $_POST['comision_fecha_inicio'] = trim(htmlspecialchars($_POST['comision_fecha_inicio']));

        if (empty($_POST['comision_fecha_inicio'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Debe seleccionar una fecha de inicio'
            ]);
            return;
        }

        $_POST['comision_duracion'] = filter_var($_POST['comision_duracion'], FILTER_SANITIZE_NUMBER_INT);

        if ($_POST['comision_duracion'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La duración debe ser mayor a 0'
            ]);
            return;
        }

        $_POST['comision_duracion_tipo'] = strtoupper(trim(htmlspecialchars($_POST['comision_duracion_tipo'])));

        if (!in_array($_POST['comision_duracion_tipo'], ['HORAS', 'DIAS'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Tipo de duración debe ser HORAS o DIAS'
            ]);
            return;
        }

        $_POST['comision_ubicacion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['comision_ubicacion']))));

        $cantidad_ubicacion = strlen($_POST['comision_ubicacion']);

        if ($cantidad_ubicacion < 5) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Ubicación debe de tener mas de 4 caracteres'
            ]);
            return;
        }

        $_POST['comision_observaciones'] = trim(htmlspecialchars($_POST['comision_observaciones']));

        try {
            $verificarComisionExistente = self::fetchArray("SELECT comision_id FROM pmlx_comision WHERE comision_titulo = '{$_POST['comision_titulo']}' AND comision_comando = '{$_POST['comision_comando']}' AND comision_situacion = 1 AND comision_id != {$id}");

            if (count($verificarComisionExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otra comisión registrada con este título para el mismo comando'
                ]);
                return;
            }

            $fecha_inicio = $_POST['comision_fecha_inicio'];

            if ($_POST['comision_duracion_tipo'] == 'HORAS') {
                $fecha_fin = date('Y-m-d', strtotime($fecha_inicio . ' + ' . $_POST['comision_duracion'] . ' hours'));
            } else {
                $fecha_fin = date('Y-m-d', strtotime($fecha_inicio . ' + ' . $_POST['comision_duracion'] . ' days'));
            }

            $fecha_inicio_formateada = date('m/d/Y', strtotime($fecha_inicio));
            $fecha_fin_formateada = date('m/d/Y', strtotime($fecha_fin));

            $sql = "UPDATE pmlx_comision SET 
                    comision_titulo = '{$_POST['comision_titulo']}',
                    comision_descripcion = '{$_POST['comision_descripcion']}',
                    comision_comando = '{$_POST['comision_comando']}',
                    comision_fecha_inicio = '{$fecha_inicio_formateada}',
                    comision_duracion = '{$_POST['comision_duracion']}',
                    comision_duracion_tipo = '{$_POST['comision_duracion_tipo']}',
                    comision_fecha_fin = '{$fecha_fin_formateada}',
                    comision_ubicacion = '{$_POST['comision_ubicacion']}',
                    comision_observaciones = '{$_POST['comision_observaciones']}',
                    comision_estado = '{$_POST['comision_estado']}',
                    personal_asignado_id = " . ($_POST['personal_asignado_id'] ? $_POST['personal_asignado_id'] : 'NULL') . "
                    WHERE comision_id = {$id}";

            $resultado = self::SQL($sql);

            //  HistorialActController::registrarActividad('COMISIONES', 'ACTUALIZAR', 'Modificó comisión: ' . $_POST['comision_titulo'], 'comisiones/modificar');

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La información de la comisión ha sido modificada exitosamente'
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

            $sql_comision = "SELECT comision_titulo FROM pmlx_comision WHERE comision_id = $id";
            $comision_data = self::fetchFirst($sql_comision);

            $ejecutar = Comision::EliminarComision($id);

            if ($comision_data) {
                // HistorialActController::registrarActividad('COMISIONES', 'ELIMINAR', 'Eliminó comisión: ' . $comision_data['comision_titulo'], 'comisiones/eliminar');
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
