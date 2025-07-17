import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formPermiso = document.getElementById('formPermiso');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');
const BtnBuscarPermisos = document.getElementById('BtnBuscarPermisos');
const SelectAplicacion = document.getElementById('app_id');
const seccionTabla = document.getElementById('seccionTabla');

const validarPermisoAccion = async (modulo, accion) => {
    try {
        const response = await fetch(`/lopez_recuperacion_comisiones_ingSoft1/API/verificarPermisos?modulo=${modulo}&accion=${accion}`);
        
        if (!response.ok) {
            console.log('Error al verificar permisos, asumiendo permisos válidos');
            return true; // Asumir permisos válidos si falla la verificación
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
                text: `No tienes permisos para ${accion} permisos`,
                showConfirmButton: true,
            });
            return false;
        }
        return true;
    } catch (error) {
        console.log('Error al verificar permisos:', error);
        return true; // Asumir permisos válidos en caso de error
    }
}

const cargarAplicaciones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/permisos/buscarAplicacionesAPI`;
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        // Verificar si la respuesta tiene contenido
        const texto = await respuesta.text();
        if (!texto) {
            console.log('Respuesta vacía del servidor');
            return;
        }
        
        // Intentar parsear el JSON
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: "Error al obtener las aplicaciones",
                showConfirmButton: true,
            });
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

const guardarPermiso = async e => {
    e.preventDefault();
    
    // Verificar permisos primero
    if (!await validarPermisoAccion('PERMISOS', 'crear')) return;
    
    BtnGuardar.disabled = true;

    // Validar formulario
    if (!validarFormulario(formPermiso, ['permiso_id', 'permiso_situacion'])) {
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
    const formData = new FormData(formPermiso);
    console.log('Datos del formulario a enviar:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    const url = "/lopez_recuperacion_comisiones_ingSoft1/permisos/guardarAPI";
    const config = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }

    try {
        const respuesta = await fetch(url, config);
        
        // Obtener el texto de la respuesta
        const texto = await respuesta.text();
        console.log('Respuesta del servidor (texto):', texto);
        
        if (!texto) {
            throw new Error('Respuesta vacía del servidor');
        }
        
        // Intentar parsear el JSON
        let datos;
        try {
            datos = JSON.parse(texto);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Respuesta del servidor:', texto);
            
            // Si el servidor devuelve HTML en lugar de JSON, mostrar el error
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
            BuscarPermisos();
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
        console.error('Error en guardarPermiso:', error);
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

const BuscarPermisos = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/permisos/buscarAPI`;
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
            console.log('Respuesta de permisos:', { codigo, mensaje, data });
            
            if (data && Array.isArray(data)) {
                console.log('Permisos encontrados:', data.length, 'registros');
                
                if (datatable) {
                    datatable.clear().draw();
                    if (data.length > 0) {
                        datatable.rows.add(data).draw();
                    }
                }
            } else {
                console.log('No hay datos de permisos');
                if (datatable) {
                    datatable.clear().draw();
                }
            }
        } else {
            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje || 'Error al obtener permisos',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en BuscarPermisos:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al buscar permisos: " + error.message,
            showConfirmButton: true,
        });
    }
}

const MostrarTabla = () => {
    console.log('MostrarTabla ejecutado');
    if (seccionTabla.style.display === 'none') {
        console.log('Mostrando tabla y buscando permisos');
        seccionTabla.style.display = 'block';
        BuscarPermisos();
    } else {
        console.log('Ocultando tabla');
        seccionTabla.style.display = 'none';
    }
}

const datatable = new DataTable('#TablePermisos', {
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
            data: 'permiso_id',
            width: '8%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { 
            title: 'Aplicación', 
            data: 'app_nombre_corto',
            width: '20%'
        },
        { 
            title: 'Tipo de Permiso', 
            data: 'permiso_tipo',
            width: '20%',
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
            width: '30%'
        },
        {
            title: 'Situación',
            data: 'permiso_situacion',
            width: '12%',
            render: (data, type, row) => {
                return data == 1 ? "ACTIVO" : "INACTIVO";
            }
        },
        {
            title: 'Acciones',
            data: 'permiso_id',
            width: '10%',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                 <div class='d-flex justify-content-center'>
                     <button class='btn btn-warning modificar mx-1' 
                         data-id="${data}" 
                         data-app="${row.app_id || ''}"  
                         data-tipo="${row.permiso_tipo || ''}"  
                         data-desc="${row.permiso_desc || ''}"
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

const llenarFormulario = (event) => {
    const datos = event.currentTarget.dataset;

    document.getElementById('permiso_id').value = datos.id;
    document.getElementById('app_id').value = datos.app;
    document.getElementById('permiso_tipo').value = datos.tipo;
    document.getElementById('permiso_desc').value = datos.desc;

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0,
    });
}

const limpiarTodo = () => {
    formPermiso.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
}

const ModificarPermiso = async (event) => {
    event.preventDefault();
    if (!await validarPermisoAccion('PERMISOS', 'modificar')) return;
    BtnModificar.disabled = true;

    if (!validarFormulario(formPermiso, ['permiso_id', 'permiso_situacion'])) {
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

    const body = new FormData(formPermiso);
    const url = '/lopez_recuperacion_comisiones_ingSoft1/permisos/modificarAPI';
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
            BuscarPermisos();
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
        console.error('Error en ModificarPermiso:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al modificar permiso: " + error.message,
            showConfirmButton: true,
        });
    } finally {
        BtnModificar.disabled = false;
    }
}

const EliminarPermisos = async (e) => {
    if (!await validarPermisoAccion('PERMISOS', 'eliminar')) return;
    const idPermiso = e.currentTarget.dataset.id;

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
        const url = `/lopez_recuperacion_comisiones_ingSoft1/permisos/eliminar?id=${idPermiso}`;
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
                
                BuscarPermisos();
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
            console.error('Error en EliminarPermisos:', error);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: "Error al eliminar permiso: " + error.message,
                showConfirmButton: true,
            });
        }
    }
}

// Event listeners
datatable.on('click', '.eliminar', EliminarPermisos);
datatable.on('click', '.modificar', llenarFormulario);
formPermiso.addEventListener('submit', guardarPermiso);

BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarPermiso);
BtnBuscarPermisos.addEventListener('click', MostrarTabla);

// Cargar aplicaciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarAplicaciones();
});