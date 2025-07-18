<?php 
require_once __DIR__ . '/../includes/app.php';

use Controllers\AplicacionController;
use MVC\Router;
use Controllers\AppController;
use Controllers\AsignacionPermisosController;
use Controllers\ComisionController;
use Controllers\ComisionPersonalController;
use Controllers\EstadisticasController;
use Controllers\HistorialActController;
use Controllers\LoginController;
use Controllers\MapasController;
use Controllers\PermisosController;
use Controllers\UsuarioController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);

// Rutas de appcontroller
$router->get('/', [AppController::class,'index']);
$router->get('/inicio', [AppController::class,'inicio']);

// Rutas de Login
$router->get('/login', [LoginController::class,'renderizarPagina']);
$router->post('/login/iniciar', [LoginController::class,'login']);
$router->get('/logout', [LoginController::class,'logout']);

// RUTAS DE LOGIN
$router->get('/login', [LoginController::class, 'renderizarPagina']);
$router->post('/login/iniciar', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

// O si usas prefijo sesion:
$router->get('/lopez_recuperacion_comisiones_ingSoft1/login', [LoginController::class, 'renderizarPagina']);
$router->post('/lopez_recuperacion_comisiones_ingSoft1/login/iniciar', [LoginController::class, 'login']);
$router->get('/lopez_recuperacion_comisiones_ingSoft1/logout', [LoginController::class, 'logout']);



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

// MAPA
$router->get('/mapa', [MapasController::class, 'renderizarPagina']);


// ESTADÍSTICAS
// En tu archivo de rutas
$router->get('/estadisticas', [EstadisticasController::class, 'renderizarPagina']);
$router->get('/estadisticas/testAPI', [EstadisticasController::class, 'testAPI']);
$router->get('/estadisticas/buscarUsuariosUltimos30DiasAPI', [EstadisticasController::class, 'buscarUsuariosUltimos30DiasAPI']);
$router->get('/estadisticas/buscarUsuariosPorNombreAPI', [EstadisticasController::class, 'buscarUsuariosPorNombreAPI']);
$router->get('/estadisticas/buscarPersonalPorRangoAPI', [EstadisticasController::class, 'buscarPersonalPorRangoAPI']);
$router->get('/estadisticas/buscarUsuariosPorCorreoAPI', [EstadisticasController::class, 'buscarUsuariosPorCorreoAPI']);
$router->get('/estadisticas/buscarComisionesPorEstadoAPI', [EstadisticasController::class, 'buscarComisionesPorEstadoAPI']);
$router->get('/estadisticas/buscarResumenGeneralAPI', [EstadisticasController::class, 'buscarResumenGeneralAPI']);

// HISTORIAL DE ACTIVIDADES
$router->get('/historial', [HistorialActController::class, 'renderizarPagina']);
$router->get('/historial/buscarAPI', [HistorialActController::class, 'buscarAPI']);
$router->get('/historial/buscarUsuariosAPI', [HistorialActController::class, 'buscarUsuariosAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
