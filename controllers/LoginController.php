<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Exception;

class LoginController extends ActiveRecord
{

    public static function renderizarPagina(Router $router)
    {
        session_start();
        if (isset($_SESSION['login']) && $_SESSION['login'] === true) {
            header('Location: /lopez_recuperacion_comisiones_ingSoft1/inicio');
            exit;
        }
        
        $router->render('login/index', [], 'layout/layoutLogin');
    }

    public static function login() {
        header('Content-Type: application/json');
        
        try {
            // Obtener datos del formulario
            $usuario_correo = htmlspecialchars($_POST['usuario_correo'] ?? '');
            $usuario_contra = $_POST['usuario_contra'] ?? '';

            // Validaciones básicas
            if(empty($usuario_correo) || empty($usuario_contra)) {
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Por favor complete todos los campos'
                ]);
                exit;
            }

            // Validar formato de email
            if(!filter_var($usuario_correo, FILTER_VALIDATE_EMAIL)) {
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El formato del correo electrónico no es válido'
                ]);
                exit;
            }

            // Buscar usuario por correo
            $queryExisteUser = "SELECT usuario_id, usuario_nom1, usuario_nom2, usuario_ape1, usuario_ape2, usuario_correo, usuario_contra, usuario_fotografia 
                               FROM pmlx_usuario 
                               WHERE usuario_correo = '$usuario_correo' AND usuario_situacion = 1";

            $resultado = ActiveRecord::fetchArray($queryExisteUser);

            if (!empty($resultado)) {
                $existeUsuario = $resultado[0];
                $passDB = $existeUsuario['usuario_contra'];

                // Verificar contraseña
                if (password_verify($usuario_contra, $passDB)) {
                    session_start();

                    // Crear nombre completo
                    $nombreCompleto = trim($existeUsuario['usuario_nom1'] . ' ' . 
                                         ($existeUsuario['usuario_nom2'] ?? '') . ' ' . 
                                         $existeUsuario['usuario_ape1'] . ' ' . 
                                         ($existeUsuario['usuario_ape2'] ?? ''));

                    // Guardar datos en sesión
                    $_SESSION['usuario_id'] = $existeUsuario['usuario_id'];
                    $_SESSION['usuario_correo'] = $existeUsuario['usuario_correo'];
                    $_SESSION['usuario_nombre'] = $nombreCompleto;
                    $_SESSION['usuario_nom1'] = $existeUsuario['usuario_nom1'];
                    $_SESSION['usuario_fotografia'] = $existeUsuario['usuario_fotografia'] ?? '';
                    $_SESSION['login'] = true;
                    $_SESSION['login_time'] = time();

                    // Actualizar fecha de último acceso
                    try {
                        $updateQuery = "UPDATE pmlx_usuario SET usuario_fecha_contra = CURRENT WHERE usuario_id = {$existeUsuario['usuario_id']}";
                        ActiveRecord::SQL($updateQuery);
                    } catch (Exception $e) {
                        error_log("Error al actualizar fecha de acceso: " . $e->getMessage());
                    }

                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Usuario logueado exitosamente',
                        'usuario' => [
                            'id' => $existeUsuario['usuario_id'],
                            'nombre' => $nombreCompleto,
                            'correo' => $existeUsuario['usuario_correo']
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'codigo' => 0,
                        'mensaje' => 'La contraseña que ingresó es incorrecta'
                    ]);
                }
            } else {
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'El usuario no existe o está inactivo'
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al intentar loguearse',
                'detalle' => $e->getMessage()
            ]);
        }
        exit;
    }

    public static function logout(){
        session_start();
        
        // Guardar datos para log
        $usuario_id = $_SESSION['usuario_id'] ?? null;
        $usuario_correo = $_SESSION['usuario_correo'] ?? null;
        
        // Limpiar sesión
        $_SESSION = [];
        
        // Destruir cookie de sesión
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        session_destroy();
        
        error_log("Usuario deslogueado - ID: " . $usuario_id . " - Correo: " . $usuario_correo);
        
        header("Location: /lopez_recuperacion_comisiones_ingSoft1/login");
        exit;
    }

    public static function verificarSesion() {
        session_start();
        
        if(!isset($_SESSION['login']) || !$_SESSION['login']) {
            header('Location: /lopez_recuperacion_comisiones_ingSoft1/login');
            exit;
        }
        
        // Verificar timeout de sesión (2 horas)
        if(isset($_SESSION['login_time'])) {
            $sessionTimeout = 2 * 60 * 60; // 2 horas
            if((time() - $_SESSION['login_time']) > $sessionTimeout) {
                static::logout();
            }
        }
        
        return true;
    }
}