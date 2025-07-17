<?php 
require_once __DIR__ . '/../includes/app.php';

use Controllers\AplicacionController;
use MVC\Router;
use Controllers\AppController;
use Controllers\UsuarioController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);


//Rutas para usuarios
$router->get('/usuario', [UsuarioController::class,'renderizarPagina']);
$router->post('/usuario/guardar', [UsuarioController::class,'guardarAPI']);
$router->post('/usuario/buscar', [UsuarioController::class,'buscarAPI']);
$router->get('/usuario/imagen', [UsuarioController::class,'mostrarImagen']);
$router->post('/usuario/actualizar', [UsuarioController::class,'actualizarAPI']); // ← AGREGAR ESTA
$router->post('/usuario/eliminar', [UsuarioController::class,'eliminarAPI']); // ← AGREGAR ESTA

// APLICACIONES
$router->get('/aplicacion', [AplicacionController::class, 'renderizarPagina']);
$router->post('/aplicacion/guardarAPI', [AplicacionController::class, 'guardarAPI']);
$router->get('/aplicacion/buscarAPI', [AplicacionController::class, 'buscarAPI']);
$router->post('/aplicacion/modificarAPI', [AplicacionController::class, 'modificarAPI']);
$router->get('/aplicacion/eliminar', [AplicacionController::class, 'EliminarAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
