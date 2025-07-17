<?php 
require_once __DIR__ . '/../includes/app.php';

use Controllers\AplicacionController;
use MVC\Router;
use Controllers\AppController;
use Controllers\AsignacionPermisosController;
use Controllers\ComisionController;
use Controllers\ComisionPersonalController;
use Controllers\PermisosController;
use Controllers\UsuarioController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);


//Rutas para usuarios
$router->get('/usuario', [UsuarioController::class,'renderizarPagina']);
$router->post('/usuario/guardar', [UsuarioController::class,'guardarAPI']);
$router->post('/usuario/buscar', [UsuarioController::class,'buscarAPI']);
$router->get('/usuario/imagen', [UsuarioController::class,'mostrarImagen']);
$router->post('/usuario/actualizar', [UsuarioController::class,'actualizarAPI']); 
$router->post('/usuario/eliminar', [UsuarioController::class,'eliminarAPI']);

// APLICACIONES
$router->get('/aplicacion', [AplicacionController::class, 'renderizarPagina']);
$router->post('/aplicacion/guardarAPI', [AplicacionController::class, 'guardarAPI']);
$router->get('/aplicacion/buscarAPI', [AplicacionController::class, 'buscarAPI']);
$router->post('/aplicacion/modificarAPI', [AplicacionController::class, 'modificarAPI']);
$router->get('/aplicacion/eliminar', [AplicacionController::class, 'EliminarAPI']);


// COMISIONES
$router->get('/comisiones', [ComisionController::class, 'renderizarPagina']);
$router->post('/comisiones/guardarAPI', [ComisionController::class, 'guardarAPI']);
$router->get('/comisiones/buscarAPI', [ComisionController::class, 'buscarAPI']);
$router->post('/comisiones/modificarAPI', [ComisionController::class, 'modificarAPI']);
$router->get('/comisiones/eliminar', [ComisionController::class, 'EliminarAPI']);
$router->get('/comisiones/buscarPersonalAPI', [ComisionController::class, 'buscarPersonalAPI']);

// PERSONAL COMISIONES
$router->get('/comisionpersonal', [ComisionPersonalController::class, 'renderizarPagina']);
$router->post('/comisionpersonal/guardarAPI', [ComisionPersonalController::class, 'guardarAPI']);
$router->get('/comisionpersonal/buscarAPI', [ComisionPersonalController::class, 'buscarAPI']);
$router->post('/comisionpersonal/modificarAPI', [ComisionPersonalController::class, 'modificarAPI']);
$router->get('/comisionpersonal/eliminar', [ComisionPersonalController::class, 'EliminarAPI']);


// PERMISOS
$router->get('/permisos', [PermisosController::class, 'renderizarPagina']);
$router->post('/permisos/guardarAPI', [PermisosController::class, 'guardarAPI']);
$router->get('/permisos/buscarAPI', [PermisosController::class, 'buscarAPI']);
$router->post('/permisos/modificarAPI', [PermisosController::class, 'modificarAPI']);
$router->get('/permisos/eliminar', [PermisosController::class, 'EliminarAPI']);
$router->get('/permisos/buscarAplicacionesAPI', [PermisosController::class, 'buscarAplicacionesAPI']);
$router->get('/API/verificarPermisos', [AppController::class, 'verificarPermisosAPI']);

// ASIGNACIÓN DE PERMISOS
$router->get('/asignacionpermisos', [AsignacionPermisosController::class, 'renderizarPagina']);
$router->post('/asignacionpermisos/guardarAPI', [AsignacionPermisosController::class, 'guardarAPI']);
$router->get('/asignacionpermisos/buscarAPI', [AsignacionPermisosController::class, 'buscarAPI']);
$router->post('/asignacionpermisos/modificarAPI', [AsignacionPermisosController::class, 'modificarAPI']);
$router->get('/asignacionpermisos/eliminar', [AsignacionPermisosController::class, 'EliminarAPI']);
$router->get('/asignacionpermisos/buscarUsuariosAPI', [AsignacionPermisosController::class, 'buscarUsuariosAPI']);
$router->get('/asignacionpermisos/buscarAplicacionesAPI', [AsignacionPermisosController::class, 'buscarAplicacionesAPI']);
$router->get('/asignacionpermisos/buscarPermisosAPI', [AsignacionPermisosController::class, 'buscarPermisosAPI']);
$router->get('/asignacionpermisos/buscarAdministradoresAPI', [AsignacionPermisosController::class, 'buscarAdministradoresAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
