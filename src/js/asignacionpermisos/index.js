import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

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

const validarPermisoAccion = async (modulo, accion) => {
    try {
        const response = await fetch(`/lopez_recuperacion_comisiones_ingSoft1/API/verificarPermisos?modulo=${modulo}&accion=${accion}`);
        
        if (!response.ok) {
            console.log('Error al verificar permisos, asumiendo permisos válidos');
            return true;
        }
        
        const texto = await response.text();
        if (!texto) {
            console.log('Respuesta vacía al verificar permisos, asumiendo permisos válidos');
            return true;
        }
        
        const data = JSON.parse(texto);
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
        console.log('Error al verificar permisos:', error);
        return true;
    }
}

const cargarUsuarios = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarUsuariosAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(usuario => {
                    const option = document.createElement('option');
                    option.value = usuario.usuario_id;
                    option.textContent = `${usuario.usuario_nom1} ${usuario.usuario_ape1}`;
                    SelectUsuario.appendChild(option);
                });
                console.log('Usuarios cargados correctamente:', data.length, 'registros');
            } else {
                console.log('No hay usuarios disponibles');
                SelectUsuario.innerHTML = '<option value="">No hay usuarios disponibles</option>';
            }
        } else {
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
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al obtener los usuarios",
            showConfirmButton: true,
        });
    }
}

const cargarAplicaciones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAplicacionesAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectAplicacion.innerHTML = '<option value="">Seleccione una aplicación</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(app => {
                    const option = document.createElement('option');
                    option.value = app.app_id;
                    option.textContent = app.app_nombre_corto;
                    SelectAplicacion.appendChild(option);
                });
                console.log('Aplicaciones cargadas correctamente:', data.length, 'registros');
            } else {
                console.log('No hay aplicaciones disponibles');
                SelectAplicacion.innerHTML = '<option value="">No hay aplicaciones disponibles</option>';
            }
        } else {
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
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al obtener las aplicaciones",
            showConfirmButton: true,
        });
    }
}

const cargarAdministradores = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAdministradoresAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectAdministrador.innerHTML = '<option value="">Seleccione administrador que asigna</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(admin => {
                    const option = document.createElement('option');
                    option.value = admin.usuario_id;
                    option.textContent = `${admin.usuario_nom1} ${admin.usuario_ape1}`;
                    SelectAdministrador.appendChild(option);
                });
                console.log('Administradores cargados correctamente:', data.length, 'registros');
            } else {
                console.log('No hay administradores disponibles');
                SelectAdministrador.innerHTML = '<option value="">No hay administradores disponibles</option>';
            }
        } else {
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
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al obtener los administradores",
            showConfirmButton: true,
        });
    }
}

const cargarTodosLosPermisos = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(permiso => {
                    const option = document.createElement('option');
                    option.value = permiso.permiso_id;
                    option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                    SelectPermiso.appendChild(option);
                });
                console.log('Permisos cargados correctamente:', data.length, 'registros');
            } else {
                console.log('No hay permisos disponibles');
                SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
            }
        } else {
            SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
        }

    } catch (error) {
        console.error('Error en cargarTodosLosPermisos:', error);
        SelectPermiso.innerHTML = '<option value="">Error al cargar permisos</option>';
    }
}

const cargarPermisos = async (app_id) => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI?app_id=${app_id}`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(permiso => {
                    const option = document.createElement('option');
                    option.value = permiso.permiso_id;
                    option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                    SelectPermiso.appendChild(option);
                });
            } else {
                SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
            }
        } else {
            SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
        }

    } catch (error) {
        console.error('Error en cargarPermisos:', error);
        SelectPermiso.innerHTML = '<option value="">Error al cargar permisos</option>';
    }
}

const guardarAsignacion = async e => {
    e.preventDefault();
    
    if (!await validarPermisoAccion('ASIGNACIONPERMISOS', 'crear')) return;
    
    BtnGuardar.disabled = true;

    if (!validarFormulario(formAsignacionPermiso, ['asignacion_id', 'asignacion_situacion'])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "FORMULARIO INCOMPLETO",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false;
        return;
    }

    // DEBUG: Mostrar datos del formulario antes de enviar
    const formData = new FormData(formAsignacionPermiso);
    console.log('Datos del formulario a enviar:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    const url = "/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/guardarAPI";
    const config = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        const texto = await respuesta.text();
        console.log('Respuesta del servidor (texto):', texto);
        
        if (!texto) {
            throw new Error('Respuesta vacía del servidor');
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            
            if (texto.includes('<html>') || texto.includes('<!DOCTYPE')) {
                throw new Error('El servidor devolvió HTML en lugar de JSON. Revisa los logs del servidor.');
            }
            
            throw new Error('Respuesta inválida del servidor');
        }
        
        console.log('Respuesta del servidor (JSON):', datos);
        const { codigo, mensaje } = datos;

        if (codigo == 1) {
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Éxito",
                text: mensaje,
                showConfirmButton: true,
            });

            limpiarTodo();
            BuscarAsignaciones();
        } else {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: mensaje || 'Error desconocido',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en guardarAsignacion:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al comunicarse con el servidor: " + error.message,
            showConfirmButton: true,
        });
    } finally {
        BtnGuardar.disabled = false;
    }
}

const BuscarAsignaciones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            throw new Error('Respuesta vacía del servidor');
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            console.log('Respuesta de asignaciones:', { codigo, mensaje, data });
            
            if (data && Array.isArray(data)) {
                console.log('Asignaciones encontradas:', data.length, 'registros');
                
                if (datatable) {
                    datatable.clear().draw();
                    if (data.length > 0) {
                        datatable.rows.add(data).draw();
                    }
                }
            } else {
                console.log('No hay datos de asignaciones');
                if (datatable) {
                    datatable.clear().draw();
                }
            }
        } else {
            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje || 'Error al obtener asignaciones',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en BuscarAsignaciones:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al buscar asignaciones: " + error.message,
            showConfirmButton: true,
        });
    }
}

const MostrarTabla = () => {
    console.log('MostrarTabla ejecutado');
    if (seccionTabla.style.display === 'none') {
        console.log('Mostrando tabla y buscando asignaciones');
        seccionTabla.style.display = 'block';
        BuscarAsignaciones();
    } else {
        console.log('Ocultando tabla');
        seccionTabla.style.display = 'none';
    }
}

const datatable = new DataTable('#TableAsignacionPermisos', {
    dom: `
        <"row mt-3 justify-content-between" 
            <"col" l> 
            <"col" B> 
            <"col-3" f>
        >
        t
        <"row mt-3 justify-content-between" 
            <"col-md-3 d-flex align-items-center" i> 
            <"col-md-8 d-flex justify-content-end" p>
        >
    `,
    language: lenguaje,
    data: [],
    columns: [
        {
            title: 'No.',
            data: 'asignacion_id',
            width: '5%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { 
            title: 'Usuario', 
            data: 'usuario_nom1',
            width: '12%',
            render: (data, type, row) => {
                return `${row.usuario_nom1} ${row.usuario_ape1}`;
            }
        },
        { 
            title: 'Aplicación', 
            data: 'app_nombre_corto',
            width: '10%'
        },
        { 
            title: 'Tipo Permiso', 
            data: 'permiso_tipo',
            width: '12%',
            render: (data, type, row) => {
                const colores = {
                    'LECTURA': 'success',
                    'ESCRITURA': 'primary', 
                    'MODIFICACION': 'warning',
                    'ELIMINACION': 'danger',
                    'REPORTE': 'info'
                };
                const color = colores[data] || 'secondary';
                return `<span class="badge bg-${color}">${data}</span>`;
            }
        },
        { 
            title: 'Descripción', 
            data: 'permiso_desc',
            width: '18%'
        },
        {
            title: 'Asignado por',
            data: 'asigno_nom1',
            width: '12%',
            render: (data, type, row) => {
                return `${row.asigno_nom1} ${row.asigno_ape1}`;
            }
        },
        { 
            title: 'Motivo', 
            data: 'asignacion_motivo',
            width: '15%'
        },
        {
            title: 'Situación',
            data: 'asignacion_situacion',
            width: '8%',
            render: (data, type, row) => {
                return data == 1 ? "ACTIVO" : "INACTIVO";
            }
        },
        {
            title: 'Acciones',
            data: 'asignacion_id',
            width: '8%',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                 <div class='d-flex justify-content-center'>
                     <button class='btn btn-warning modificar mx-1' 
                         data-id="${data}" 
                         data-usuario="${row.asignacion_usuario_id || ''}"  
                         data-app="${row.asignacion_app_id || ''}"  
                         data-permiso="${row.asignacion_permiso_id || ''}"  
                         data-asigno="${row.asignacion_usuario_asigno || ''}"
                         data-motivo="${row.asignacion_motivo || ''}"
                         title="Modificar">
                         <i class='bi bi-pencil-square me-1'></i> Modificar
                     </button>
                     <button class='btn btn-danger eliminar mx-1' 
                         data-id="${data}"
                         title="Eliminar">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                     </button>
                 </div>`;
            }
        }
    ]
});

const llenarFormulario = async (event) => {
    const datos = event.currentTarget.dataset;

    document.getElementById('asignacion_id').value = datos.id;
    document.getElementById('asignacion_usuario_id').value = datos.usuario;
    document.getElementById('asignacion_app_id').value = datos.app;
    document.getElementById('asignacion_usuario_asigno').value = datos.asigno;
    document.getElementById('asignacion_motivo').value = datos.motivo;
    
    if (datos.app) {
        await cargarPermisos(datos.app);
    }
    
    document.getElementById('asignacion_permiso_id').value = datos.permiso;

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0,
    });
}

const limpiarTodo = () => {
    formAsignacionPermiso.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
    cargarTodosLosPermisos();
}

const ModificarAsignacion = async (event) => {
    event.preventDefault();
    if (!await validarPermisoAccion('ASIGNACIONPERMISOS', 'modificar')) return;
    BtnModificar.disabled = true;

    if (!validarFormulario(formAsignacionPermiso, ['asignacion_id', 'asignacion_situacion'])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "FORMULARIO INCOMPLETO",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnModificar.disabled = false;
        return;
    }

    const body = new FormData(formAsignacionPermiso);
    const url = '/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/modificarAPI';
    const config = {
        method: 'POST',
        body
    }

    try {
        const respuesta = await fetch(url, config);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        if (!texto) {
            throw new Error('Respuesta vacía del servidor');
        }
        
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            throw new Error('Respuesta inválida del servidor');
        }
        
        const { codigo, mensaje } = datos;

        if (codigo == 1) {
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Éxito",
                text: mensaje,
                showConfirmButton: true,
            });

            limpiarTodo();
            BuscarAsignaciones();
        } else {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: mensaje || 'Error desconocido',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en ModificarAsignacion:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al modificar asignación: " + error.message,
            showConfirmButton: true,
        });
    } finally {
        BtnModificar.disabled = false;
    }
}

const EliminarAsignacion = async (e) => {
    if (!await validarPermisoAccion('ASIGNACIONPERMISOS', 'eliminar')) return;
    const idAsignacion = e.currentTarget.dataset.id;

    const AlertaConfirmarEliminar = await Swal.fire({
        position: "center",
        icon: "info",
        title: "¿Desea ejecutar esta acción?",
        text: 'Esta completamente seguro que desea eliminar este registro',
        showConfirmButton: true,
        confirmButtonText: 'Si, Eliminar',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, Cancelar',
        showCancelButton: true
    });

    if (AlertaConfirmarEliminar.isConfirmed) {
        const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/eliminar?id=${idAsignacion}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        try {
            const consulta = await fetch(url, config);
            
            if (!consulta.ok) {
                throw new Error(`HTTP error! status: ${consulta.status}`);
            }
            
            const texto = await consulta.text();
            if (!texto) {
                throw new Error('Respuesta vacía del servidor');
            }
            
            let respuesta;
            try {
                respuesta = JSON.parse(texto);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.log('Respuesta del servidor:', texto);
                throw new Error('Respuesta inválida del servidor');
            }
            
            const { codigo, mensaje } = respuesta;

            if (codigo == 1) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Éxito",
                    text: mensaje,
                    showConfirmButton: true,
                });
                
                BuscarAsignaciones();
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje || 'Error desconocido',
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error('Error en EliminarAsignacion:', error);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: "Error al eliminar asignación: " + error.message,
                showConfirmButton: true,
            });
        }
    }
}

// Cargar datos iniciales
cargarUsuarios();
cargarAplicaciones();
cargarAdministradores();
cargarTodosLosPermisos();

// Event listeners
datatable.on('click', '.modificar', llenarFormulario);
datatable.on('click', '.eliminar', EliminarAsignacion);
formAsignacionPermiso.addEventListener('submit', guardarAsignacion);
BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarAsignacion);
BtnBuscarAsignaciones.addEventListener('click', MostrarTabla);

// Event listener para cargar permisos cuando cambie la aplicación
SelectAplicacion.addEventListener('change', function() {
    const appId = this.value;
    if (appId) {
        cargarPermisos(appId);
    } else {
        cargarTodosLosPermisos();
    }
});