import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const BtnBuscarActividades = document.getElementById('BtnBuscarActividades');
const SelectUsuario = document.getElementById('filtro_usuario');
const SelectModulo = document.getElementById('filtro_modulo');
const SelectAccion = document.getElementById('filtro_accion');
const InputFechaInicio = document.getElementById('fecha_inicio');
const InputFechaFin = document.getElementById('fecha_fin');
const BtnLimpiarFiltros = document.getElementById('BtnLimpiarFiltros');
const seccionTabla = document.getElementById('seccionTabla');

let datatable;

const cargarUsuarios = async () => {
    console.log('=== INICIANDO CARGA DE USUARIOS ===');
    
    const url = `/lopez_recuperacion_comisiones_ingSoft1/historial/buscarUsuariosAPI`;
    console.log('URL:', url);
    
    try {
        console.log('Haciendo fetch...');
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('Respuesta status:', respuesta.status);
        console.log('Respuesta headers:', respuesta.headers);
        
        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error('Error en respuesta:', errorText);
            throw new Error(`HTTP ${respuesta.status}: ${errorText}`);
        }
        
        const contentType = respuesta.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await respuesta.text();
            console.error('Respuesta no es JSON:', responseText);
            throw new Error('La respuesta no es JSON válido');
        }
        
        const datos = await respuesta.json();
        console.log('Datos recibidos:', datos);
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1 && data && data.length > 0) {
            if (SelectUsuario) {
                SelectUsuario.innerHTML = `<option value="">Todos los usuarios</option>`;
                
                data.forEach(usuario => {
                    const option = document.createElement('option');
                    option.value = usuario.historial_usuario_id;
                    option.textContent = usuario.historial_usuario_nombre;
                    SelectUsuario.appendChild(option);
                });
                console.log(`Cargados ${data.length} usuarios`);
            }
        } else {
            console.log('No se encontraron usuarios o error:', mensaje);
            if (SelectUsuario) {
                SelectUsuario.innerHTML = `<option value="">No hay usuarios disponibles</option>`;
            }
        }

    } catch (error) {
        console.error('Error completo al cargar usuarios:', error);
        
        // Mostrar error detallado al usuario
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error de conexión",
            text: `No se pudieron cargar los usuarios: ${error.message}`,
            showConfirmButton: true,
        });
        
        if (SelectUsuario) {
            SelectUsuario.innerHTML = `<option value="">Error al cargar usuarios</option>`;
        }
    }
}

const BuscarActividades = async () => {
    console.log('=== INICIANDO BÚSQUEDA DE ACTIVIDADES ===');
    
    const params = new URLSearchParams();
    
    if (InputFechaInicio && InputFechaInicio.value) {
        params.append('fecha_inicio', InputFechaInicio.value);
        console.log('Fecha inicio:', InputFechaInicio.value);
    }
    
    if (InputFechaFin && InputFechaFin.value) {
        params.append('fecha_fin', InputFechaFin.value);
        console.log('Fecha fin:', InputFechaFin.value);
    }
    
    if (SelectUsuario && SelectUsuario.value) {
        params.append('usuario_id', SelectUsuario.value);
        console.log('Usuario ID:', SelectUsuario.value);
    }
    
    if (SelectModulo && SelectModulo.value) {
        params.append('modulo', SelectModulo.value);
        console.log('Módulo:', SelectModulo.value);
    }
    
    if (SelectAccion && SelectAccion.value) {
        params.append('accion', SelectAccion.value);
        console.log('Acción:', SelectAccion.value);
    }

    const url = `/lopez_recuperacion_comisiones_ingSoft1/historial/buscarAPI${params.toString() ? '?' + params.toString() : ''}`;
    console.log('URL completa:', url);

    try {
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('Respuesta status:', respuesta.status);
        
        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error('Error en respuesta:', errorText);
            throw new Error(`HTTP ${respuesta.status}: ${errorText}`);
        }
        
        const contentType = respuesta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await respuesta.text();
            console.error('Respuesta no es JSON:', responseText);
            throw new Error('La respuesta no es JSON válido');
        }
        
        const datos = await respuesta.json();
        console.log('Datos de actividades recibidos:', datos);
        
        const { codigo, mensaje, data } = datos;

        if (codigo == 1) {
            console.log(`Actividades encontradas: ${data ? data.length : 0}`);
            
            const datosOrganizados = organizarDatosPorModulo(data || []);
            console.log('Datos organizados:', datosOrganizados.length);

            if (datatable) {
                datatable.clear().draw();
                if (datosOrganizados.length > 0) {
                    datatable.rows.add(datosOrganizados).draw();
                }
            }
        } else {
            console.log('Error en búsqueda:', mensaje);
            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Sin resultados",
                text: mensaje || "No se encontraron actividades",
                showConfirmButton: true,
            });
            
            if (datatable) {
                datatable.clear().draw();
            }
        }

    } catch (error) {
        console.error('Error completo al buscar actividades:', error);
        await Swal.fire({
            position: "center",
            icon: "error",
            title: "Error de conexión",
            text: `Error al obtener las actividades: ${error.message}`,
            showConfirmButton: true,
        });
    }
}

const organizarDatosPorModulo = (data) => {
    if (!data || data.length === 0) {
        console.log('No hay datos para organizar');
        return [];
    }

    const modulos = ['LOGIN', 'USUARIOS', 'APLICACIONES', 'PERMISOS', 'ASIGNACION_PERMISOS', 'COMISIONES', 'COMISION_PERSONAL', 'ESTADISTICAS', 'MAPAS', 'HISTORIAL'];
    const iconos = {
        'LOGIN': '🔐',
        'USUARIOS': '👥',
        'APLICACIONES': '📱',
        'PERMISOS': '🔑',
        'ASIGNACION_PERMISOS': '🎯',
        'COMISIONES': '💰',
        'COMISION_PERSONAL': '👤',
        'ESTADISTICAS': '📊',
        'MAPAS': '🗺️',
        'HISTORIAL': '📜'
    };
    
    let datosOrganizados = [];
    let contador = 1;
    
    modulos.forEach(modulo => {
        const actividadesModulo = data.filter(actividad => 
            actividad.historial_modulo && actividad.historial_modulo === modulo
        );
        
        if (actividadesModulo.length > 0) {
            datosOrganizados.push({
                esSeparador: true,
                modulo: modulo,
                icono: iconos[modulo] || '📄',
                cantidad: actividadesModulo.length
            });
            
            actividadesModulo.forEach(actividad => {
                datosOrganizados.push({
                    ...actividad,
                    numeroConsecutivo: contador++,
                    esSeparador: false
                });
            });
        }
    });
    
    return datosOrganizados;
}

const MostrarTabla = () => {
    console.log('=== MOSTRAR TABLA ===');
    if (seccionTabla) {
        if (seccionTabla.style.display === 'none') {
            seccionTabla.style.display = 'block';
            BuscarActividades();
        } else {
            seccionTabla.style.display = 'none';
        }
    } else {
        console.error('Elemento seccionTabla no encontrado');
    }
}

const limpiarFiltros = () => {
    if (SelectUsuario) SelectUsuario.value = '';
    if (SelectModulo) SelectModulo.value = '';
    if (SelectAccion) SelectAccion.value = '';
    if (InputFechaInicio) InputFechaInicio.value = '';
    if (InputFechaFin) InputFechaFin.value = '';
    
    if (seccionTabla && seccionTabla.style.display !== 'none') {
        BuscarActividades();
    }
}

const initDataTable = () => {
    const tableElement = document.getElementById('TableHistorialActividades');
    if (tableElement) {
        console.log('Inicializando DataTable...');
        datatable = new DataTable('#TableHistorialActividades', {
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
            ordering: false,
            pageLength: 25,
            responsive: true,
            columns: [
                {
                    title: 'No.',
                    data: null,
                    width: '5%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return row.numeroConsecutivo || '';
                    }
                },
                { 
                    title: 'Usuario', 
                    data: 'historial_usuario_nombre',
                    width: '15%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) {
                            return `<strong class="text-primary fs-5 text-center w-100 d-block">${row.icono} ${row.modulo} (${row.cantidad})</strong>`;
                        }
                        return data || 'N/A';
                    }
                },
                { 
                    title: 'Módulo', 
                    data: 'historial_modulo',
                    width: '10%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data || 'N/A';
                    }
                },
                { 
                    title: 'Acción', 
                    data: 'historial_accion',
                    width: '10%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        const acciones = {
                            'CREAR': '<span class="badge bg-success">CREAR</span>',
                            'ACTUALIZAR': '<span class="badge bg-warning text-dark">ACTUALIZAR</span>',
                            'ELIMINAR': '<span class="badge bg-danger">ELIMINAR</span>',
                            'INICIAR_SESION': '<span class="badge bg-info">INICIAR SESIÓN</span>',
                            'CERRAR_SESION': '<span class="badge bg-secondary">CERRAR SESIÓN</span>',
                            'ASIGNAR': '<span class="badge bg-primary">ASIGNAR</span>',
                            'DESASIGNAR': '<span class="badge bg-warning">DESASIGNAR</span>'
                        };
                        return acciones[data] || data || 'N/A';
                    }
                },
                { 
                    title: 'Descripción', 
                    data: 'historial_descripcion',
                    width: '25%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data || 'N/A';
                    }
                },
                { 
                    title: 'Ruta', 
                    data: 'historial_ruta',
                    width: '12%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data || 'N/A';
                    }
                },
                { 
                    title: 'IP', 
                    data: 'historial_ip',
                    width: '10%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data || 'N/A';
                    }
                },
                { 
                    title: 'Fecha', 
                    data: 'historial_fecha_creacion',
                    width: '8%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data || 'N/A';
                    }
                },
                {
                    title: 'Situación',
                    data: 'historial_situacion',
                    width: '5%',
                    render: (data, type, row, meta) => {
                        if (row.esSeparador) return '';
                        return data == 1 ? "ACTIVO" : "INACTIVO";
                    }
                }
            ],
            rowCallback: function(row, data) {
                if (data.esSeparador) {
                    row.classList.add('table-secondary');
                    row.style.backgroundColor = '#f8f9fa';
                    if (row.cells.length > 1) {
                        row.cells[1].colSpan = 8;
                        for (let i = 2; i < row.cells.length; i++) {
                            row.cells[i].style.display = 'none';
                        }
                    }
                }
            }
        });
        console.log('DataTable inicializado correctamente');
    } else {
        console.error('Elemento TableHistorialActividades no encontrado');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED ===');
    
    // Verificar elementos
    console.log('BtnBuscarActividades:', !!BtnBuscarActividades);
    console.log('SelectUsuario:', !!SelectUsuario);
    console.log('seccionTabla:', !!seccionTabla);
    
    initDataTable();
    cargarUsuarios();

    if (BtnBuscarActividades) {
        BtnBuscarActividades.addEventListener('click', MostrarTabla);
    }
    
    if (BtnLimpiarFiltros) {
        BtnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }

    const filtros = [SelectUsuario, SelectModulo, SelectAccion, InputFechaInicio, InputFechaFin];
    
    filtros.forEach(filtro => {
        if (filtro) {
            filtro.addEventListener('change', () => {
                if (seccionTabla && seccionTabla.style.display !== 'none') {
                    BuscarActividades();
                }
            });
        }
    });
    
    console.log('=== INICIALIZACIÓN COMPLETADA ===');
});