import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formComisionPersonal = document.getElementById('formComisionPersonal');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');
const BtnBuscarPersonal = document.getElementById('BtnBuscarPersonal');
const InputPersonalTel = document.getElementById('personal_tel');
const InputPersonalDpi = document.getElementById('personal_dpi');
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
                text: `No tienes permisos para ${accion} personal`,
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

const ValidarTelefono = () => {
    const CantidadDigitos = InputPersonalTel.value;

    if (CantidadDigitos.length < 1) {
        InputPersonalTel.classList.remove('is-valid', 'is-invalid');
    } else {
        if (CantidadDigitos.length != 8) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Revise el numero de telefono",
                text: "La cantidad de digitos debe ser exactamente 8 digitos",
                showConfirmButton: true,
            });

            InputPersonalTel.classList.remove('is-valid');
            InputPersonalTel.classList.add('is-invalid');
        } else {
            InputPersonalTel.classList.remove('is-invalid');
            InputPersonalTel.classList.add('is-valid');
        }
    }
}

const ValidarDpi = () => {
    const dpi = InputPersonalDpi.value.trim();

    if (dpi.length < 1) {
        InputPersonalDpi.classList.remove('is-valid', 'is-invalid');
    } else {
        if (dpi.length < 13) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "DPI INVALIDO",
                text: "El DPI debe tener al menos 13 caracteres",
                showConfirmButton: true,
            });

            InputPersonalDpi.classList.remove('is-valid');
            InputPersonalDpi.classList.add('is-invalid');
        } else {
            InputPersonalDpi.classList.remove('is-invalid');
            InputPersonalDpi.classList.add('is-valid');
        }
    }
}

const guardarPersonal = async e => {
    e.preventDefault();
    if (!await validarPermisoAccion('COMISIONPERSONAL', 'crear')) return;
    BtnGuardar.disabled = true;

    if (!validarFormulario(formComisionPersonal, ['personal_id', 'personal_situacion'])) {
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

    const body = new FormData(formComisionPersonal);
    const url = "/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/guardarAPI";
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
            BuscarPersonal();
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

const BuscarPersonal = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/buscarAPI`;
    const config = {
        method: 'GET'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            console.log('Personal encontrado:', data);

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
        BuscarPersonal();
    } else {
        seccionTabla.style.display = 'none';
    }
}

const datatable = new DataTable('#TableComisionPersonal', {
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
            data: 'personal_id',
            width: '5%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { 
            title: 'Primer Nombre', 
            data: 'personal_nom1',
            width: '10%'
        },
        { 
            title: 'Segundo Nombre', 
            data: 'personal_nom2',
            width: '10%'
        },
        { 
            title: 'Primer Apellido', 
            data: 'personal_ape1',
            width: '10%'
        },
        { 
            title: 'Segundo Apellido', 
            data: 'personal_ape2',
            width: '10%'
        },
        { 
            title: 'DPI', 
            data: 'personal_dpi',
            width: '10%'
        },
        { 
            title: 'Teléfono', 
            data: 'personal_tel',
            width: '8%'
        },
        { 
            title: 'Correo', 
            data: 'personal_correo',
            width: '12%'
        },
        {
            title: 'Rango',
            data: 'personal_rango',
            width: '8%',
            render: (data, type, row) => {
                let badgeClass = 'bg-secondary';
                switch(data) {
                    case 'OFICIAL':
                        badgeClass = 'bg-danger';
                        break;
                    case 'ESPECIALISTA':
                        badgeClass = 'bg-warning';
                        break;
                    case 'TROPA':
                        badgeClass = 'bg-success';
                        break;
                    case 'PLANILLERO':
                        badgeClass = 'bg-info';
                        break;
                }
                return `<span class="badge ${badgeClass}">${data}</span>`;
            }
        },
        {
            title: 'Unidad',
            data: 'personal_unidad',
            width: '12%'
        },
        {
            title: 'Situación',
            data: 'personal_situacion',
            width: '7%',
            render: (data, type, row) => {
                return data == 1 ? "ACTIVO" : "INACTIVO";
            }
        },
        {
            title: 'Acciones',
            data: 'personal_id',
            width: '10%',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                 <div class='d-flex justify-content-center'>
                     <button class='btn btn-warning modificar mx-1' 
                         data-id="${data}" 
                         data-nom1="${row.personal_nom1 || ''}"  
                         data-nom2="${row.personal_nom2 || ''}"  
                         data-ape1="${row.personal_ape1 || ''}"  
                         data-ape2="${row.personal_ape2 || ''}"  
                         data-tel="${row.personal_tel || ''}"  
                         data-dpi="${row.personal_dpi || ''}"  
                         data-correo="${row.personal_correo || ''}"
                         data-direccion="${row.personal_direccion || ''}"
                         data-rango="${row.personal_rango || ''}"
                         data-unidad="${row.personal_unidad || ''}"
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

    document.getElementById('personal_id').value = datos.id;
    document.getElementById('personal_nom1').value = datos.nom1;
    document.getElementById('personal_nom2').value = datos.nom2;
    document.getElementById('personal_ape1').value = datos.ape1;
    document.getElementById('personal_ape2').value = datos.ape2;
    document.getElementById('personal_tel').value = datos.tel;
    document.getElementById('personal_dpi').value = datos.dpi;
    document.getElementById('personal_correo').value = datos.correo;
    document.getElementById('personal_direccion').value = datos.direccion;
    document.getElementById('personal_rango').value = datos.rango;
    document.getElementById('personal_unidad').value = datos.unidad;

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0,
    });
}

const limpiarTodo = () => {
    formComisionPersonal.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
}

const ModificarPersonal = async (event) => {
    event.preventDefault();
    if (!await validarPermisoAccion('COMISIONPERSONAL', 'modificar')) return;
    BtnModificar.disabled = true;

    if (!validarFormulario(formComisionPersonal, ['personal_id', 'personal_situacion'])) {
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

    const body = new FormData(formComisionPersonal);
    const url = '/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/modificarAPI';
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
            BuscarPersonal();
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

const EliminarPersonal = async (e) => {
    if (!await validarPermisoAccion('COMISIONPERSONAL', 'eliminar')) return;
    const idPersonal = e.currentTarget.dataset.id;

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
        const url = `/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/eliminar?id=${idPersonal}`;
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
                
                BuscarPersonal();
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

datatable.on('click', '.eliminar', EliminarPersonal);
datatable.on('click', '.modificar', llenarFormulario);
formComisionPersonal.addEventListener('submit', guardarPersonal);

InputPersonalTel.addEventListener('change', ValidarTelefono);
InputPersonalDpi.addEventListener('change', ValidarDpi);

BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarPersonal);
BtnBuscarPersonal.addEventListener('click', MostrarTabla);