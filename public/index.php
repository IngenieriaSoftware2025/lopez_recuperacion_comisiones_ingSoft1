<?php 
require_once __DIR__ . '/../includes/app.php';


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


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
