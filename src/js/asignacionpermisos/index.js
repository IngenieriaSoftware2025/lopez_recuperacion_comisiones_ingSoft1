import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar que todos los elementos existen antes de continuar
    const formAsignacionPermiso = document.getElementById('formAsignacionPermiso');
    const BtnGuardar = document.getElementById('BtnGuardar');
    const BtnModificar = document.getElementById('BtnModificar');
    const BtnLimpiar = document.getElementById('BtnLimpiar');
    const BtnBuscarAsignaciones = document.getElementById('BtnBuscarAsignaciones');
    const SelectUsuario = document.getElementById('asignacion_usuario_id');
    const SelectAplicacion = document.getElementById('asignacion_app_id');
    const SelectPermiso = document.getElementById('asignacion_permiso_id');
    const SelectAdministrador = document.getElementById('asignacion_usuario_asigno');
    const seccionTabla = document.getElementById('seccionTabla');

    // Verificar que todos los elementos críticos existen
    if (!formAsignacionPermiso || !SelectUsuario || !SelectAplicacion || !SelectPermiso || !SelectAdministrador) {
        console.error('Error: No se encontraron algunos elementos del formulario');
        console.log('Elementos encontrados:', {
            formAsignacionPermiso: !!formAsignacionPermiso,
            SelectUsuario: !!SelectUsuario,
            SelectAplicacion: !!SelectAplicacion,
            SelectPermiso: !!SelectPermiso,
            SelectAdministrador: !!SelectAdministrador
        });
        return;
    }

    const validarPermisoAccion = async (modulo, accion) => {
        try {
            const response = await fetch(`/lopez_recuperacion_comisiones_ingSoft1/API/verificarPermisos?modulo=${modulo}&accion=${accion}`);
            const data = await response.json();
            if (!data.permitido) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Sin permisos",
                    text: `No tienes permisos para ${accion} asignaciones de permisos`,
                    showConfirmButton: true,
                });
                return false;
            }
            return true;
        } catch (error) {
            console.log('Error en validarPermisoAccion:', error);
            return false;
        }
    }

    const cargarUsuarios = async () => {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarUsuariosAPI`;
        const config = {
            method: 'GET'
        }

        try {
            console.log('Cargando usuarios desde:', url);
            const respuesta = await fetch(url, config);
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const datos = await respuesta.json();
            console.log('Respuesta usuarios:', datos);
            
            const { codigo, mensaje, data } = datos;

            if (codigo == 1 && data && Array.isArray(data)) {
                SelectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
                
                data.forEach(usuario => {
                    const option = document.createElement('option');
                    option.value = usuario.usuario_id;
                    option.textContent = `${usuario.usuario_nom1} ${usuario.usuario_ape1}`;
                    SelectUsuario.appendChild(option);
                });
                
                console.log(`Se cargaron ${data.length} usuarios`);
            } else {
                console.error('Error en la respuesta:', mensaje);
                SelectUsuario.innerHTML = '<option value="">Error al cargar usuarios</option>';
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje || 'Error al cargar usuarios',
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en cargarUsuarios:', error);
            SelectUsuario.innerHTML = '<option value="">Error al cargar usuarios</option>';
            await Swal.fire({
                position: "center",
                icon: "error", 
                title: "Error de conexión",
                text: 'No se pudieron cargar los usuarios. Verifique su conexión.',
                showConfirmButton: true,
            });
        }
    }

    const cargarAplicaciones = async () => {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAplicacionesAPI`;
        const config = {
            method: 'GET'
        }

        try {
            console.log('Cargando aplicaciones desde:', url);
            const respuesta = await fetch(url, config);
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const datos = await respuesta.json();
            console.log('Respuesta aplicaciones:', datos);
            
            const { codigo, mensaje, data } = datos;

            if (codigo == 1 && data && Array.isArray(data)) {
                SelectAplicacion.innerHTML = '<option value="">Seleccione una aplicación</option>';
                
                data.forEach(app => {
                    const option = document.createElement('option');
                    option.value = app.app_id;
                    option.textContent = app.app_nombre_corto;
                    SelectAplicacion.appendChild(option);
                });
                
                console.log(`Se cargaron ${data.length} aplicaciones`);
            } else {
                console.error('Error en la respuesta:', mensaje);
                SelectAplicacion.innerHTML = '<option value="">Error al cargar aplicaciones</option>';
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje || 'Error al cargar aplicaciones',
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en cargarAplicaciones:', error);
            SelectAplicacion.innerHTML = '<option value="">Error al cargar aplicaciones</option>';
        }
    }

    const cargarAdministradores = async () => {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAdministradoresAPI`;
        const config = {
            method: 'GET'
        }

        try {
            console.log('Cargando administradores desde:', url);
            const respuesta = await fetch(url, config);
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const datos = await respuesta.json();
            console.log('Respuesta administradores:', datos);
            
            const { codigo, mensaje, data } = datos;

            if (codigo == 1 && data && Array.isArray(data)) {
                SelectAdministrador.innerHTML = '<option value="">Seleccione administrador que asigna</option>';
                
                data.forEach(admin => {
                    const option = document.createElement('option');
                    option.value = admin.usuario_id;
                    option.textContent = `${admin.usuario_nom1} ${admin.usuario_ape1}`;
                    SelectAdministrador.appendChild(option);
                });
                
                console.log(`Se cargaron ${data.length} administradores`);
            } else {
                console.error('Error en la respuesta:', mensaje);
                SelectAdministrador.innerHTML = '<option value="">Error al cargar administradores</option>';
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje || 'Error al cargar administradores',
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en cargarAdministradores:', error);
            SelectAdministrador.innerHTML = '<option value="">Error al cargar administradores</option>';
        }
    }

    const cargarTodosLosPermisos = async () => {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI`;
        const config = {
            method: 'GET'
        }

        try {
            console.log('Cargando permisos desde:', url);
            const respuesta = await fetch(url, config);
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const datos = await respuesta.json();
            console.log('Respuesta permisos:', datos);
            
            const { codigo, mensaje, data } = datos;

            if (codigo == 1 && data && Array.isArray(data)) {
                SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
                
                data.forEach(permiso => {
                    const option = document.createElement('option');
                    option.value = permiso.permiso_id;
                    option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                    SelectPermiso.appendChild(option);
                });
                
                console.log(`Se cargaron ${data.length} permisos`);
            } else {
                SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
            }

        } catch (error) {
            console.error('Error en cargarTodosLosPermisos:', error);
            SelectPermiso.innerHTML = '<option value="">Error al cargar permisos</option>';
        }
    }

    const cargarPermisos = async (app_id) => {
        if (!app_id) {
            SelectPermiso.innerHTML = '<option value="">Seleccione primero una aplicación</option>';
            return;
        }
        
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI?app_id=${app_id}`;
        const config = {
            method: 'GET'
        }

        try {
            console.log('Cargando permisos para app_id:', app_id);
            const respuesta = await fetch(url, config);
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const datos = await respuesta.json();
            console.log('Respuesta permisos por app:', datos);
            
            const { codigo, mensaje, data } = datos;

            if (codigo == 1 && data && Array.isArray(data)) {
                SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
                
                data.forEach(permiso => {
                    const option = document.createElement('option');
                    option.value = permiso.permiso_id;
                    option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                    SelectPermiso.appendChild(option);
                });
                
                console.log(`Se cargaron ${data.length} permisos para la aplicación`);
            } else {
                SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
            }

        } catch (error) {
            console.error('Error en cargarPermisos:', error);
            SelectPermiso.innerHTML = '<option value="">Error al cargar permisos</option>';
        }
    }

    // Event listener para cuando cambie la aplicación
    if (SelectAplicacion) {
        SelectAplicacion.addEventListener('change', function() {
            const app_id = this.value;
            if (app_id) {
                cargarPermisos(app_id);
            } else {
                cargarTodosLosPermisos();
            }
        });
    }

    const guardarAsignacion = async e => {
        e.preventDefault();
        if (!await validarPermisoAccion('ASIGNACIONPERMISOS', 'crear')) return;
        
        if (BtnGuardar) BtnGuardar.disabled = true;

        if (!validarFormulario(formAsignacionPermiso, ['asignacion_id', 'asignacion_situacion'])) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "FORMULARIO INCOMPLETO",
                text: "Debe de validar todos los campos",
                showConfirmButton: true,
            });
            if (BtnGuardar) BtnGuardar.disabled = false;
            return;
        }

        const body = new FormData(formAsignacionPermiso);
        const url = "/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/guardarAPI";
        const config = {
            method: 'POST',
            body
        }

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje } = datos;

            if (codigo == 1) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Exito",
                    text: mensaje,
                    showConfirmButton: true,
                });

                limpiarTodo();
                BuscarAsignaciones();
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Error",
                    text: mensaje,
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en guardarAsignacion:', error);
        }
        if (BtnGuardar) BtnGuardar.disabled = false;
    }

    // Resto de funciones sin cambios importantes...
    const BuscarAsignaciones = async () => {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAPI`;
        const config = {
            method: 'GET'
        }

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;

            if (codigo == 1) {
                if (window.datatable) {
                    window.datatable.clear().draw();
                    window.datatable.rows.add(data).draw();
                }
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Error",
                    text: mensaje,
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en BuscarAsignaciones:', error);
        }
    }

    const limpiarTodo = () => {
        formAsignacionPermiso.reset();
        if (BtnGuardar) BtnGuardar.classList.remove('d-none');
        if (BtnModificar) BtnModificar.classList.add('d-none');
        cargarTodosLosPermisos();
    }

    // Event listeners
    if (formAsignacionPermiso) {
        formAsignacionPermiso.addEventListener('submit', guardarAsignacion);
    }
    
    if (BtnLimpiar) {
        BtnLimpiar.addEventListener('click', limpiarTodo);
    }
    
    if (BtnBuscarAsignaciones) {
        BtnBuscarAsignaciones.addEventListener('click', () => {
            if (seccionTabla) {
                if (seccionTabla.style.display === 'none') {
                    seccionTabla.style.display = 'block';
                    BuscarAsignaciones();
                } else {
                    seccionTabla.style.display = 'none';
                }
            }
        });
    }

    // Inicializar datos
    console.log('Iniciando carga de datos...');
    cargarUsuarios();
    cargarAplicaciones();
    cargarAdministradores();
    cargarTodosLosPermisos();
    
    console.log('Inicialización completada');
});