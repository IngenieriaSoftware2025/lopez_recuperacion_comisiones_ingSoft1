import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando estadísticas...');

    // Verificar elementos canvas
    const grafico1 = document.getElementById("grafico1");
    const grafico2 = document.getElementById("grafico2");
    const grafico3 = document.getElementById("grafico3");
    const grafico4 = document.getElementById("grafico4");
    const grafico5 = document.getElementById("grafico5");
    
    if (!grafico1 || !grafico2 || !grafico3 || !grafico4 || !grafico5) {
        console.error("No se encontraron todos los elementos canvas");
        console.log("Elementos encontrados:", {
            grafico1: !!grafico1,
            grafico2: !!grafico2,
            grafico3: !!grafico3,
            grafico4: !!grafico4,
            grafico5: !!grafico5
        });
        return;
    }

    // Configuraciones básicas
    const configPie = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { padding: 15 } }
        }
    };

    const configBar = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    };

    // Crear gráficas
    console.log('Creando gráficas...');
    
    window.chart1 = new Chart(grafico1.getContext("2d"), {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            ...configBar,
            plugins: {
                title: { display: true, text: 'Usuarios Últimos 30 Días' }
            }
        }
    });

    window.chart2 = new Chart(grafico2.getContext("2d"), {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            ...configBar,
            plugins: {
                title: { display: true, text: 'Usuarios por Inicial del Nombre' }
            }
        }
    });

    window.chart3 = new Chart(grafico3.getContext("2d"), {
        type: 'doughnut',
        data: { labels: [], datasets: [] },
        options: {
            ...configPie,
            plugins: {
                title: { display: true, text: 'Personal por Rango' }
            }
        }
    });

    window.chart4 = new Chart(grafico4.getContext("2d"), {
        type: 'pie',
        data: { labels: [], datasets: [] },
        options: {
            ...configPie,
            plugins: {
                title: { display: true, text: 'Usuarios por Dominio de Correo' }
            }
        }
    });

    window.chart5 = new Chart(grafico5.getContext("2d"), {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            ...configBar,
            indexAxis: 'y',
            plugins: {
                title: { display: true, text: 'Comisiones por Estado' }
            }
        }
    });

    // Colores
    const colores = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4',
        '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'
    ];

    // Función mejorada para manejar respuestas
    const manejarRespuesta = async (respuesta) => {
        try {
            const texto = await respuesta.text();
            console.log('Respuesta cruda:', texto.substring(0, 200) + '...');
            
            // Verificar si es HTML
            if (texto.trim().startsWith('<!DOCTYPE') || texto.trim().startsWith('<html>')) {
                throw new Error('El servidor devolvió HTML en lugar de JSON');
            }
            
            // Intentar parsear JSON
            const datos = JSON.parse(texto);
            console.log('Datos parseados:', datos);
            return datos;
            
        } catch (error) {
            console.error('Error al procesar respuesta:', error);
            console.error('Respuesta problemática:', texto);
            throw error;
        }
    };

    // Función de prueba
    const TestAPI = async () => {
        try {
            console.log('Probando API...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/testAPI');
            const datos = await manejarRespuesta(respuesta);
            console.log('Test API exitoso:', datos);
            return true;
        } catch (error) {
            console.error('Error en test API:', error);
            return false;
        }
    };

    // 1. Usuarios últimos 30 días
    const BuscarUsuarios30Dias = async () => {
        try {
            console.log('Buscando usuarios últimos 30 días...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosUltimos30DiasAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.fecha_registro);
                const cantidades = datos.data.map(d => parseInt(d.cantidad) || 0);
                
                window.chart1.data.labels = etiquetas;
                window.chart1.data.datasets = [{
                    label: 'Usuarios Registrados',
                    data: cantidades,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                }];
                window.chart1.update();
                console.log('Gráfica 1 actualizada con', cantidades.length, 'datos');
            } else {
                console.log('Sin datos para usuarios 30 días');
            }
        } catch (error) {
            console.error('Error en usuarios 30 días:', error);
        }
    };

    // 2. Usuarios por nombre
    const BuscarUsuariosPorNombre = async () => {
        try {
            console.log('Buscando usuarios por nombre...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorNombreAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.slice(0, 10).map(d => d.inicial_nombre);
                const cantidades = datos.data.slice(0, 10).map(d => parseInt(d.cantidad) || 0);
                
                window.chart2.data.labels = etiquetas;
                window.chart2.data.datasets = [{
                    label: 'Cantidad',
                    data: cantidades,
                    backgroundColor: '#4BC0C0',
                    borderColor: '#2E8B8B',
                    borderWidth: 1
                }];
                window.chart2.update();
                console.log('Gráfica 2 actualizada con', cantidades.length, 'datos');
            } else {
                console.log('Sin datos para usuarios por nombre');
            }
        } catch (error) {
            console.error('Error en usuarios por nombre:', error);
        }
    };

    // 3. Personal por rango
    const BuscarPersonalPorRango = async () => {
        try {
            console.log('Buscando personal por rango...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarPersonalPorRangoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.rango);
                const cantidades = datos.data.map(d => parseInt(d.cantidad) || 0);
                const coloresGrafica = colores.slice(0, etiquetas.length);
                
                window.chart3.data.labels = etiquetas;
                window.chart3.data.datasets = [{
                    data: cantidades,
                    backgroundColor: coloresGrafica,
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.chart3.update();
                console.log('Gráfica 3 actualizada con', cantidades.length, 'datos');
            } else {
                console.log('Sin datos para personal por rango');
            }
        } catch (error) {
            console.error('Error en personal por rango:', error);
        }
    };

    // 4. Usuarios por correo
    const BuscarUsuariosPorCorreo = async () => {
        try {
            console.log('Buscando usuarios por correo...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorCorreoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.slice(0, 8).map(d => d.dominio_correo);
                const cantidades = datos.data.slice(0, 8).map(d => parseInt(d.cantidad) || 0);
                const coloresGrafica = colores.slice(0, etiquetas.length);
                
                window.chart4.data.labels = etiquetas;
                window.chart4.data.datasets = [{
                    data: cantidades,
                    backgroundColor: coloresGrafica,
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.chart4.update();
                console.log('Gráfica 4 actualizada con', cantidades.length, 'datos');
            } else {
                console.log('Sin datos para usuarios por correo');
            }
        } catch (error) {
            console.error('Error en usuarios por correo:', error);
        }
    };

    // 5. Comisiones por estado
    const BuscarComisionesPorEstado = async () => {
        try {
            console.log('Buscando comisiones por estado...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarComisionesPorEstadoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.estado);
                const cantidades = datos.data.map(d => parseInt(d.cantidad) || 0);
                
                window.chart5.data.labels = etiquetas;
                window.chart5.data.datasets = [{
                    label: 'Comisiones',
                    data: cantidades,
                    backgroundColor: '#FF6384',
                    borderColor: '#FF1744',
                    borderWidth: 1
                }];
                window.chart5.update();
                console.log('Gráfica 5 actualizada con', cantidades.length, 'datos');
            } else {
                console.log('Sin datos para comisiones por estado');
            }
        } catch (error) {
            console.error('Error en comisiones por estado:', error);
        }
    };

    // Buscar resumen general
    const BuscarResumenGeneral = async () => {
        try {
            console.log('Buscando resumen general...');
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarResumenGeneralAPI');
            const datos = await manejarRespuesta(respuesta);
            
            if (datos.codigo == 1 && datos.data) {
                const data = datos.data;
                
                // Actualizar los elementos si existen
                const elementos = {
                    'totalUsuarios': data.total_usuarios || 0,
                    'totalComisiones': data.total_comisiones || 0,
                    'totalPersonal': data.total_personal || 0,
                    'totalAplicaciones': data.total_aplicaciones || 0,
                    'totalPermisos': data.total_permisos || 0,
                    'totalAsignaciones': data.total_asignaciones_permisos || 0
                };
                
                Object.entries(elementos).forEach(([id, valor]) => {
                    const elemento = document.getElementById(id);
                    if (elemento) {
                        elemento.textContent = valor;
                        console.log(`Actualizado ${id}: ${valor}`);
                    } else {
                        console.warn(`Elemento ${id} no encontrado`);
                    }
                });
            } else {
                console.log('Sin datos para resumen general');
            }
        } catch (error) {
            console.error('Error en resumen general:', error);
        }
    };

    // Actualizar todas las estadísticas
    const actualizarTodas = async () => {
        console.log('=== INICIANDO ACTUALIZACIÓN DE ESTADÍSTICAS ===');
        
        // Primero probar la API
        const apiOk = await TestAPI();
        if (!apiOk) {
            console.error('API no responde correctamente');
            return;
        }
        
        // Ejecutar todas las funciones
        await Promise.allSettled([
            BuscarUsuarios30Dias(),
            BuscarUsuariosPorNombre(),
            BuscarPersonalPorRango(),
            BuscarUsuariosPorCorreo(),
            BuscarComisionesPorEstado(),
            BuscarResumenGeneral()
        ]);
        
        console.log('=== ACTUALIZACIÓN COMPLETADA ===');
    };

    // Ejecutar al cargar
    setTimeout(actualizarTodas, 1000); // Esperar 1 segundo para que todo esté listo

    // Botón actualizar
    const btnActualizar = document.getElementById('btnActualizarEstadisticas');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', () => {
            console.log('Actualización manual solicitada');
            actualizarTodas();
        });
        console.log('Evento del botón actualizar configurado');
    } else {
        console.warn('Botón actualizar no encontrado');
    }

    // Auto-actualizar cada 5 minutos
    setInterval(() => {
        console.log('Auto-actualización programada');
        actualizarTodas();
    }, 300000);
    
    console.log('Sistema de estadísticas inicializado correctamente');
});