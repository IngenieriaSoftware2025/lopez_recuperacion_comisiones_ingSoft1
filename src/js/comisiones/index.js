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
        const data = await response.json();
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
        console.log(error);
        return false;
    }
}

const cargarPersonal = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisiones/buscarPersonalAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            SelectPersonalAsignado.innerHTML = '<option value="">Seleccione personal (opcional)</option>';
            
            data.forEach(personal => {
                const option = document.createElement('option');
                option.value = personal.personal_id;
                option.textContent = `${personal.personal_nom1} ${personal.personal_ape1} (${personal.personal_rango})`;
                SelectPersonalAsignado.appendChild(option);
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

const guardarComision = async e => {
    e.preventDefault();
    if (!await validarPermisoAccion('COMISIONES', 'crear')) return;
    BtnGuardar.disabled = true;

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

    document.getElementById('comision_usuario_creo').value = 1;

    const body = new FormData(formComision);
    const url = "/lopez_recuperacion_comisiones_ingSoft1/comisiones/guardarAPI";
    const config = {
        method: 'POST',
        body
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        console.log(datos);
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
            BuscarComisiones();
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

const BuscarComisiones = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisiones/buscarAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            console.log('Comisiones encontradas:', data);

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
        BuscarComisiones();
    } else {
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
            BuscarComisiones();
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
                
                BuscarComisiones();
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

cargarPersonal();

datatable.on('click', '.eliminar', EliminarComisiones);
datatable.on('click', '.modificar', llenarFormulario);
formComision.addEventListener('submit', guardarComision);

BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarComision);
BtnBuscarComisiones.addEventListener('click', MostrarTabla);