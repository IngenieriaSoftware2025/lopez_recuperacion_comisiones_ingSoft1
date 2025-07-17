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
        console.log(error);
        return false;
    }
}

const cargarUsuarios = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarUsuariosAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
            
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.usuario_id;
                option.textContent = `${usuario.usuario_nom1} ${usuario.usuario_ape1}`;
                SelectUsuario.appendChild(option);
            });
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
        console.log(error);
    }
}

const cargarAplicaciones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAplicacionesAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectAplicacion.innerHTML = '<option value="">Seleccione una aplicación</option>';
            
            data.forEach(app => {
                const option = document.createElement('option');
                option.value = app.app_id;
                option.textContent = app.app_nombre_corto;
                SelectAplicacion.appendChild(option);
            });
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
        console.log(error);
    }
}

const cargarAdministradores = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarAdministradoresAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectAdministrador.innerHTML = '<option value="">Seleccione administrador que asigna</option>';
            
            data.forEach(admin => {
                const option = document.createElement('option');
                option.value = admin.usuario_id;
                option.textContent = `${admin.usuario_nom1} ${admin.usuario_ape1}`;
                SelectAdministrador.appendChild(option);
            });
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
        console.log(error);
    }
}

const cargarTodosLosPermisos = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
            
            data.forEach(permiso => {
                const option = document.createElement('option');
                option.value = permiso.permiso_id;
                option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                SelectPermiso.appendChild(option);
            });
        } else {
            SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
        }

    } catch (error) {
        console.log(error);
        SelectPermiso.innerHTML = '<option value="">Error al cargar permisos</option>';
    }
}

const cargarPermisos = async (app_id) => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/asignacionpermisos/buscarPermisosAPI?app_id=${app_id}`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPermiso.innerHTML = '<option value="">Seleccione un permiso</option>';
            
            data.forEach(permiso => {
                const option = document.createElement('option');
                option.value = permiso.permiso_id;
                option.textContent = `${permiso.permiso_tipo} - ${permiso.permiso_desc}`;
                SelectPermiso.appendChild(option);
            });
        } else {
            SelectPermiso.innerHTML = '<option value="">No hay permisos disponibles</option>';
        }

    } catch (error) {
        console.log(error);
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
        console.log(error);
    }
    BtnGuardar.disabled = false;
}

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
            if (datatable) {
                datatable.clear().draw();
                datatable.rows.add(data).draw();
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
        console.log(error);
    }
}

const MostrarTabla = () => {
    if (seccionTabla.style.display === 'none') {
        seccionTabla.style.display = 'block';
        BuscarAsignaciones();
    } else {
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
        console.log(error);
    }
    BtnModificar.disabled = false;
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
            method: 'GET'
        }

        try {
            const consulta = await fetch(url, config);
            const respuesta = await consulta.json();
            const { codigo, mensaje } = respuesta;

            if (codigo == 1) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Exito",
                    text: mensaje,
                    showConfirmButton: true,
                });
                
                BuscarAsignaciones();
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje,
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.log(error);
        }
    }
}

cargarUsuarios();
cargarAplicaciones();
cargarAdministradores();
cargarTodosLosPermisos();

datatable.on('click', '.modificar', llenarFormulario);
datatable.on('click', '.eliminar', EliminarAsignacion);
formAsignacionPermiso.addEventListener('submit', guardarAsignacion);
BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarAsignacion);
BtnBuscarAsignaciones.addEventListener('click', MostrarTabla);