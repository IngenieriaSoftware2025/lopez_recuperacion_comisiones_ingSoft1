<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\ActiveRecord;
use Model\ComisionPersonal;
use Controllers\HistorialActController;

class ComisionPersonalController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        $router->render('comisionpersonal/index', []);
    }

    public static function guardarAPI()
    {
        getHeadersApi();
    
        try {
            $_POST['personal_nom1'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_nom1']))));
            
            $cantidad_nombre = strlen($_POST['personal_nom1']);
            
            if ($cantidad_nombre < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Primer nombre debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            $_POST['personal_nom2'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_nom2']))));
            
            $cantidad_nombre = strlen($_POST['personal_nom2']);
            
            if ($cantidad_nombre < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Segundo nombre debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            $_POST['personal_ape1'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_ape1']))));
            $cantidad_apellido = strlen($_POST['personal_ape1']);
            
            if ($cantidad_apellido < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Primer apellido debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            $_POST['personal_ape2'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_ape2']))));
            $cantidad_apellido = strlen($_POST['personal_ape2']);
            
            if ($cantidad_apellido < 2) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Segundo apellido debe de tener mas de 1 caracteres'
                ]);
                exit;
            }
            
            $_POST['personal_tel'] = filter_var($_POST['personal_tel'], FILTER_SANITIZE_NUMBER_INT);
            if (strlen($_POST['personal_tel']) != 8) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El telefono debe de tener 8 numeros'
                ]);
                exit;
            }
            
            $_POST['personal_dpi'] = trim(htmlspecialchars($_POST['personal_dpi']));
            if (strlen($_POST['personal_dpi']) != 13) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'La cantidad de digitos del DPI debe de ser igual a 13'
                ]);
                exit;
            }

            $verificarDpiExistente = self::fetchArray("SELECT personal_id FROM pmlx_personal_comisiones WHERE personal_dpi = '{$_POST['personal_dpi']}' AND personal_situacion = 1");

            if (count($verificarDpiExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe un personal registrado con este DPI'
                ]);
                exit;
            }
            
            $_POST['personal_correo'] = filter_var($_POST['personal_correo'], FILTER_SANITIZE_EMAIL);
            
            if (!filter_var($_POST['personal_correo'], FILTER_VALIDATE_EMAIL)){
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El correo electronico no es valido'
                ]);
                exit;
            }

            $verificarCorreoExistente = self::fetchArray("SELECT personal_id FROM pmlx_personal_comisiones WHERE personal_correo = '{$_POST['personal_correo']}' AND personal_situacion = 1");

            if (count($verificarCorreoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe un personal registrado con este correo electrónico'
                ]);
                exit;
            }
            
            $_POST['personal_direccion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_direccion']))));
            $_POST['personal_rango'] = strtoupper(trim(htmlspecialchars($_POST['personal_rango'])));
            
            if (!in_array($_POST['personal_rango'], ['OFICIAL', 'ESPECIALISTA', 'TROPA', 'PLANILLERO'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El rango debe ser OFICIAL, ESPECIALISTA, TROPA o PLANILLERO'
                ]);
                exit;
            }
            
            $_POST['personal_unidad'] = strtoupper(trim(htmlspecialchars($_POST['personal_unidad'])));
            
            if (!in_array($_POST['personal_unidad'], ['BRIGADA DE COMUNICACIONES', 'INFORMATICA'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'La unidad debe ser BRIGADA DE COMUNICACIONES o INFORMATICA'
                ]);
                exit;
            }
            
            $_POST['personal_situacion'] = 1;
            
            $personal = new ComisionPersonal($_POST);
            $resultado = $personal->crear();

            if($resultado['resultado'] == 1){
                $nombre_completo = $_POST['personal_nom1'] . ' ' . $_POST['personal_ape1'];
                
               // HistorialActController::registrarActividad('COMISION_PERSONAL', 'CREAR', 'Registró personal: ' . $nombre_completo, 'comisionpersonal/guardar');
                
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Personal registrado correctamente',
                ]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error en registrar al personal',
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
            $sql = "SELECT * FROM pmlx_personal_comisiones WHERE personal_situacion = 1 ORDER BY personal_nom1 ASC";
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

    public static function modificarAPI()
    {
        getHeadersApi();

        $id = $_POST['personal_id'];
        $_POST['personal_nom1'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_nom1']))));

        $cantidad_nombre = strlen($_POST['personal_nom1']);

        if ($cantidad_nombre < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Primer nombre debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        $_POST['personal_nom2'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_nom2']))));

        $cantidad_nombre = strlen($_POST['personal_nom2']);

        if ($cantidad_nombre < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Segundo nombre debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        $_POST['personal_ape1'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_ape1']))));
        $cantidad_apellido = strlen($_POST['personal_ape1']);

        if ($cantidad_apellido < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Primer apellido debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        $_POST['personal_ape2'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_ape2']))));
        $cantidad_apellido = strlen($_POST['personal_ape2']);

        if ($cantidad_apellido < 2) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Segundo apellido debe de tener mas de 1 caracteres'
            ]);
            return;
        }

        $_POST['personal_tel'] = filter_var($_POST['personal_tel'], FILTER_SANITIZE_NUMBER_INT);

        if (strlen($_POST['personal_tel']) != 8) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El telefono debe de tener 8 numeros'
            ]);
            return;
        }

        $_POST['personal_dpi'] = trim(htmlspecialchars($_POST['personal_dpi']));

        if (strlen($_POST['personal_dpi']) != 13) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad de digitos del DPI debe de ser igual a 13'
            ]);
            return;
        }

        $_POST['personal_correo'] = filter_var($_POST['personal_correo'], FILTER_SANITIZE_EMAIL);

        if (!filter_var($_POST['personal_correo'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El correo electronico no es valido'
            ]);
            return;
        }

        $_POST['personal_direccion'] = ucwords(strtolower(trim(htmlspecialchars($_POST['personal_direccion']))));
        $_POST['personal_rango'] = strtoupper(trim(htmlspecialchars($_POST['personal_rango'])));
        
        if (!in_array($_POST['personal_rango'], ['OFICIAL', 'ESPECIALISTA', 'TROPA', 'PLANILLERO'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El rango debe ser OFICIAL, ESPECIALISTA, TROPA o PLANILLERO'
            ]);
            return;
        }
        
        $_POST['personal_unidad'] = strtoupper(trim(htmlspecialchars($_POST['personal_unidad'])));
        
        if (!in_array($_POST['personal_unidad'], ['BRIGADA DE COMUNICACIONES', 'INFORMATICA'])) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La unidad debe ser BRIGADA DE COMUNICACIONES o INFORMATICA'
            ]);
            return;
        }

        try {
            $verificarDpiExistente = self::fetchArray("SELECT personal_id FROM pmlx_personal_comisiones WHERE personal_dpi = '{$_POST['personal_dpi']}' AND personal_situacion = 1 AND personal_id != {$id}");

            if (count($verificarDpiExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otro personal registrado con este DPI'
                ]);
                return;
            }

            $verificarCorreoExistente = self::fetchArray("SELECT personal_id FROM pmlx_personal_comisiones WHERE personal_correo = '{$_POST['personal_correo']}' AND personal_situacion = 1 AND personal_id != {$id}");

            if (count($verificarCorreoExistente) > 0) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Ya existe otro personal registrado con este correo electrónico'
                ]);
                return;
            }

            $sql = "UPDATE pmlx_personal_comisiones SET 
                    personal_nom1 = '{$_POST['personal_nom1']}',
                    personal_nom2 = '{$_POST['personal_nom2']}',
                    personal_ape1 = '{$_POST['personal_ape1']}',
                    personal_ape2 = '{$_POST['personal_ape2']}',
                    personal_tel = '{$_POST['personal_tel']}',
                    personal_dpi = '{$_POST['personal_dpi']}',
                    personal_correo = '{$_POST['personal_correo']}',
                    personal_direccion = '{$_POST['personal_direccion']}',
                    personal_rango = '{$_POST['personal_rango']}',
                    personal_unidad = '{$_POST['personal_unidad']}'
                    WHERE personal_id = {$id}";
            
            $resultado = self::SQL($sql);

            $nombre_completo = $_POST['personal_nom1'] . ' ' . $_POST['personal_ape1'];
            
           // HistorialActController::registrarActividad('COMISION_PERSONAL', 'ACTUALIZAR', 'Modificó personal: ' . $nombre_completo, 'comisionpersonal/modificar');

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La información del personal ha sido modificada exitosamente'
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
            
            $sql_personal = "SELECT personal_nom1, personal_ape1 FROM pmlx_personal_comisiones WHERE personal_id = $id";
            $personal_data = self::fetchFirst($sql_personal);
            
            $ejecutar = ComisionPersonal::EliminarComisionPersonal($id);

            if ($personal_data) {
                $nombre_completo = $personal_data['personal_nom1'] . ' ' . $personal_data['personal_ape1'];
                
               // HistorialActController::registrarActividad('COMISION_PERSONAL', 'ELIMINAR', 'Eliminó personal: ' . $nombre_completo, 'comisionpersonal/eliminar');
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