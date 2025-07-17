import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formComision = document.getElementById('formComision');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');
const BtnBuscarComisiones = document.getElementById('BtnBuscarComisiones');
const SelectPersonalAsignado = document.getElementById('personal_asignado_id');
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
                text: `No tienes permisos para ${accion} comisiones`,
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

const cargarPersonal = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisiones/buscarPersonalAPI`;
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
            return;
        }
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPersonalAsignado.innerHTML = '<option value="">Seleccione personal (opcional)</option>';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(personal => {
                    const option = document.createElement('option');
                    option.value = personal.personal_id;
                    option.textContent = `${personal.personal_nom1} ${personal.personal_ape1} (${personal.personal_rango})`;
                    SelectPersonalAsignado.appendChild(option);
                });
                console.log('Personal cargado correctamente:', data.length, 'registros');
            } else {
                console.log('No hay personal disponible');
            }
        } else {
            console.log('Error al cargar personal:', mensaje);
        }

    } catch (error) {
        console.error('Error en cargarPersonal:', error);
        // Opcional: mostrar mensaje al usuario
        // Swal.fire({
        //     position: "center",
        //     icon: "warning",
        //     title: "Advertencia",
        //     text: "No se pudo cargar la lista de personal",
        //     showConfirmButton: true,
        // });
    }
}

const guardarComision = async e => {
    e.preventDefault();
    
    // Verificar permisos primero
    if (!await validarPermisoAccion('COMISIONES', 'crear')) return;
    
    BtnGuardar.disabled = true;

    // Validar formulario
    if (!validarFormulario(formComision, ['comision_id', 'comision_usuario_creo', 'comision_situacion', 'personal_asignado_id'])) {
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

    // Establecer usuario creador
    document.getElementById('comision_usuario_creo').value = 1;

    // DEBUG: Mostrar datos del formulario antes de enviar
    const formData = new FormData(formComision);
    console.log('Datos del formulario a enviar:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    const url = "/lopez_recuperacion_comisiones_ingSoft1/comisiones/guardarAPI";
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
            BuscarComisiones();
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
        console.error('Error en guardarComision:', error);
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

const BuscarComisiones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisiones/buscarAPI`;
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
            console.log('Respuesta de comisiones:', { codigo, mensaje, data });
            
            if (data && Array.isArray(data)) {
                console.log('Comisiones encontradas:', data.length, 'registros');
                
                if (datatable) {
                    datatable.clear().draw();
                    if (data.length > 0) {
                        datatable.rows.add(data).draw();
                    }
                }
            } else {
                console.log('No hay datos de comisiones');
                if (datatable) {
                    datatable.clear().draw();
                }
            }
        } else {
            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje || 'Error al obtener comisiones',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en BuscarComisiones:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al buscar comisiones: " + error.message,
            showConfirmButton: true,
        });
    }
}

const MostrarTabla = () => {
    console.log('MostrarTabla ejecutado');
    if (seccionTabla.style.display === 'none') {
        console.log('Mostrando tabla y buscando comisiones');
        seccionTabla.style.display = 'block';
        BuscarComisiones();
    } else {
        console.log('Ocultando tabla');
        seccionTabla.style.display = 'none';
    }
}

const datatable = new DataTable('#TableComisiones', {
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
            data: 'comision_id',
            width: '5%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { 
            title: 'Título', 
            data: 'comision_titulo',
            width: '20%'
        },
        { 
            title: 'Comando', 
            data: 'comision_comando',
            width: '15%'
        },
        { 
            title: 'Fecha Inicio', 
            data: 'comision_fecha_inicio',
            width: '10%'
        },
        { 
            title: 'Duración', 
            data: 'comision_duracion',
            width: '8%',
            render: (data, type, row) => {
                return `${data} ${row.comision_duracion_tipo}`;
            }
        },
        { 
            title: 'Ubicación', 
            data: 'comision_ubicacion',
            width: '12%'
        },
        {
            title: 'Estado',
            data: 'comision_estado',
            width: '10%',
            render: (data, type, row) => {
                let badgeClass = 'bg-secondary';
                switch(data) {
                    case 'PROGRAMADA':
                        badgeClass = 'bg-primary';
                        break;
                    case 'EN_CURSO':
                        badgeClass = 'bg-warning';
                        break;
                    case 'COMPLETADA':
                        badgeClass = 'bg-success';
                        break;
                    case 'CANCELADA':
                        badgeClass = 'bg-danger';
                        break;
                }
                return `<span class="badge ${badgeClass}">${data}</span>`;
            }
        },
        {
            title: 'Personal Asignado',
            data: 'personal_nom1',
            width: '12%',
            render: (data, type, row) => {
                if (row.personal_nom1 && row.personal_apellido) {
                    return `${row.personal_nom1} ${row.personal_apellido}`;
                } else {
                    return '<span class="text-muted">Sin asignar</span>';
                }
            }
        },
        {
            title: 'Creado por',
            data: 'usuario_nom1',
            width: '10%',
            render: (data, type, row) => {
                return `${row.usuario_nom1} ${row.usuario_ape1}`;
            }
        },
        {
            title: 'Situación',
            data: 'comision_situacion',
            width: '7%',
            render: (data, type, row) => {
                return data == 1 ? "ACTIVO" : "INACTIVO";
            }
        },
        {
            title: 'Acciones',
            data: 'comision_id',
            width: '13%',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                 <div class='d-flex justify-content-center'>
                     <button class='btn btn-warning modificar mx-1' 
                         data-id="${data}" 
                         data-titulo="${row.comision_titulo || ''}"  
                         data-descripcion="${row.comision_descripcion || ''}"  
                         data-comando="${row.comision_comando || ''}"
                         data-fecha-inicio="${row.comision_fecha_inicio || ''}"
                         data-duracion="${row.comision_duracion || ''}"
                         data-duracion-tipo="${row.comision_duracion_tipo || ''}"
                         data-ubicacion="${row.comision_ubicacion || ''}"
                         data-estado="${row.comision_estado || ''}"
                         data-observaciones="${row.comision_observaciones || ''}"
                         data-personal="${row.personal_asignado_id || ''}"
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

    document.getElementById('comision_id').value = datos.id;
    document.getElementById('comision_titulo').value = datos.titulo;
    document.getElementById('comision_descripcion').value = datos.descripcion;
    document.getElementById('comision_comando').value = datos.comando;
    document.getElementById('comision_fecha_inicio').value = datos.fechaInicio;
    document.getElementById('comision_duracion').value = datos.duracion;
    document.getElementById('comision_duracion_tipo').value = datos.duracionTipo;
    document.getElementById('comision_ubicacion').value = datos.ubicacion;
    document.getElementById('comision_estado').value = datos.estado;
    document.getElementById('comision_observaciones').value = datos.observaciones;
    document.getElementById('personal_asignado_id').value = datos.personal;

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0,
    });
}

const limpiarTodo = () => {
    formComision.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
    document.getElementById('comision_estado').value = 'PROGRAMADA';
}

const ModificarComision = async (event) => {
    event.preventDefault();
    if (!await validarPermisoAccion('COMISIONES', 'modificar')) return;
    BtnModificar.disabled = true;

    if (!validarFormulario(formComision, ['comision_id', 'comision_usuario_creo', 'comision_situacion', 'personal_asignado_id'])) {
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

    const body = new FormData(formComision);
    const url = '/lopez_recuperacion_comisiones_ingSoft1/comisiones/modificarAPI';
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
            BuscarComisiones();
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
        console.error('Error en ModificarComision:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al modificar comisión: " + error.message,
            showConfirmButton: true,
        });
    } finally {
        BtnModificar.disabled = false;
    }
}

const EliminarComisiones = async (e) => {
    if (!await validarPermisoAccion('COMISIONES', 'eliminar')) return;
    const idComision = e.currentTarget.dataset.id;

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
        const url = `/lopez_recuperacion_comisiones_ingSoft1/comisiones/eliminar?id=${idComision}`;
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
                
                BuscarComisiones();
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
            console.error('Error en EliminarComisiones:', error);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: "Error al eliminar comisión: " + error.message,
                showConfirmButton: true,
            });
        }
    }
}

// Inicializar la aplicación
cargarPersonal();

// Event listeners
datatable.on('click', '.eliminar', EliminarComisiones);
datatable.on('click', '.modificar', llenarFormulario);
formComision.addEventListener('submit', guardarComision);

BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarComision);
BtnBuscarComisiones.addEventListener('click', MostrarTabla);