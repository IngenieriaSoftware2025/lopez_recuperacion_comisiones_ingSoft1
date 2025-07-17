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
                text: `No tienes permisos para ${accion} personal`,
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
    
    // Verificar permisos primero
    if (!await validarPermisoAccion('COMISIONPERSONAL', 'crear')) return;
    
    BtnGuardar.disabled = true;

    // Validar formulario
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

    // DEBUG: Mostrar datos del formulario antes de enviar
    const formData = new FormData(formComisionPersonal);
    console.log('Datos del formulario a enviar:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    const url = "/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/guardarAPI";
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
            BuscarPersonal();
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
        console.error('Error en guardarPersonal:', error);
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

const BuscarPersonal = async () => {
    const url = `/lopez_recuperacion_comisiones_ingSoft1/comisionpersonal/buscarAPI`;
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
            console.log('Respuesta de personal:', { codigo, mensaje, data });
            
            if (data && Array.isArray(data)) {
                console.log('Personal encontrado:', data.length, 'registros');
                
                if (datatable) {
                    datatable.clear().draw();
                    if (data.length > 0) {
                        datatable.rows.add(data).draw();
                    }
                }
            } else {
                console.log('No hay datos de personal');
                if (datatable) {
                    datatable.clear().draw();
                }
            }
        } else {
            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje || 'Error al obtener personal',
                showConfirmButton: true,
            });
        }

    } catch (error) {
        console.error('Error en BuscarPersonal:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al buscar personal: " + error.message,
            showConfirmButton: true,
        });
    }
}

const MostrarTabla = () => {
    console.log('MostrarTabla ejecutado');
    if (seccionTabla.style.display === 'none') {
        console.log('Mostrando tabla y buscando personal');
        seccionTabla.style.display = 'block';
        BuscarPersonal();
    } else {
        console.log('Ocultando tabla');
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
            BuscarPersonal();
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
        console.error('Error en ModificarPersonal:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: "Error al modificar personal: " + error.message,
            showConfirmButton: true,
        });
    } finally {
        BtnModificar.disabled = false;
    }
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
                
                BuscarPersonal();
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
            console.error('Error en EliminarPersonal:', error);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: "Error al eliminar personal: " + error.message,
                showConfirmButton: true,
            });
        }
    }
}

// Event listeners
datatable.on('click', '.eliminar', EliminarPersonal);
datatable.on('click', '.modificar', llenarFormulario);
formComisionPersonal.addEventListener('submit', guardarPersonal);

InputPersonalTel.addEventListener('change', ValidarTelefono);
InputPersonalDpi.addEventListener('change', ValidarDpi);

BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarPersonal);
BtnBuscarPersonal.addEventListener('click', MostrarTabla);