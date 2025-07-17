import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar elementos canvas
    const grafico1 = document.getElementById("grafico1");
    const grafico2 = document.getElementById("grafico2");
    const grafico3 = document.getElementById("grafico3");
    const grafico4 = document.getElementById("grafico4");
    const grafico5 = document.getElementById("grafico5");
    
    if (!grafico1 || !grafico2 || !grafico3 || !grafico4 || !grafico5) {
        console.error("No se encontraron todos los elementos canvas");
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
                title: { display: true, text: 'Usuarios por Nombre' }
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
                title: { display: true, text: 'Usuarios por Correo' }
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

    // Función para manejar respuestas
    const manejarRespuesta = async (respuesta) => {
        const texto = await respuesta.text();
        console.log('Respuesta del servidor:', texto.substring(0, 200));
        
        if (texto.includes('<!DOCTYPE') || texto.includes('<html>')) {
            throw new Error('El servidor devolvió HTML en lugar de JSON');
        }
        
        return JSON.parse(texto);
    };

    // 1. Usuarios últimos 30 días
    const BuscarUsuarios30Dias = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosUltimos30DiasAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Usuarios 30 días:', datos);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.fecha_registro);
                const cantidades = datos.data.map(d => parseInt(d.cantidad));
                
                window.chart1.data.labels = etiquetas;
                window.chart1.data.datasets = [{
                    label: 'Usuarios Registrados',
                    data: cantidades,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                }];
                window.chart1.update();
            }
        } catch (error) {
            console.error('Error en usuarios 30 días:', error);
        }
    };

    // 2. Usuarios por nombre
    const BuscarUsuariosPorNombre = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorNombreAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Usuarios por nombre:', datos);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.slice(0, 10).map(d => d.inicial_nombre);
                const cantidades = datos.data.slice(0, 10).map(d => parseInt(d.cantidad));
                
                window.chart2.data.labels = etiquetas;
                window.chart2.data.datasets = [{
                    label: 'Cantidad',
                    data: cantidades,
                    backgroundColor: '#4BC0C0',
                    borderColor: '#2E8B8B',
                    borderWidth: 1
                }];
                window.chart2.update();
            }
        } catch (error) {
            console.error('Error en usuarios por nombre:', error);
        }
    };

    // 3. Personal por rango
    const BuscarPersonalPorRango = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarPersonalPorRangoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Personal por rango:', datos);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.rango);
                const cantidades = datos.data.map(d => parseInt(d.cantidad));
                const coloresGrafica = colores.slice(0, etiquetas.length);
                
                window.chart3.data.labels = etiquetas;
                window.chart3.data.datasets = [{
                    data: cantidades,
                    backgroundColor: coloresGrafica,
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.chart3.update();
            }
        } catch (error) {
            console.error('Error en personal por rango:', error);
        }
    };

    // 4. Usuarios por correo
    const BuscarUsuariosPorCorreo = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorCorreoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Usuarios por correo:', datos);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.slice(0, 8).map(d => d.dominio_correo);
                const cantidades = datos.data.slice(0, 8).map(d => parseInt(d.cantidad));
                const coloresGrafica = colores.slice(0, etiquetas.length);
                
                window.chart4.data.labels = etiquetas;
                window.chart4.data.datasets = [{
                    data: cantidades,
                    backgroundColor: coloresGrafica,
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.chart4.update();
            }
        } catch (error) {
            console.error('Error en usuarios por correo:', error);
        }
    };

    // 5. Comisiones por estado
    const BuscarComisionesPorEstado = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarComisionesPorEstadoAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Comisiones por estado:', datos);
            
            if (datos.codigo == 1 && datos.data && datos.data.length > 0) {
                const etiquetas = datos.data.map(d => d.estado);
                const cantidades = datos.data.map(d => parseInt(d.cantidad));
                
                window.chart5.data.labels = etiquetas;
                window.chart5.data.datasets = [{
                    label: 'Comisiones',
                    data: cantidades,
                    backgroundColor: '#FF6384',
                    borderColor: '#FF1744',
                    borderWidth: 1
                }];
                window.chart5.update();
            }
        } catch (error) {
            console.error('Error en comisiones por estado:', error);
        }
    };

    // Buscar resumen general
    const BuscarResumenGeneral = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarResumenGeneralAPI');
            const datos = await manejarRespuesta(respuesta);
            
            console.log('Resumen general:', datos);
            
            if (datos.codigo == 1 && datos.data) {
                const data = datos.data;
                document.getElementById('totalUsuarios').textContent = data.total_usuarios || 0;
                document.getElementById('totalComisiones').textContent = data.total_comisiones || 0;
                document.getElementById('totalPersonal').textContent = data.total_personal || 0;
                document.getElementById('totalAplicaciones').textContent = data.total_aplicaciones || 0;
                document.getElementById('totalPermisos').textContent = data.total_permisos || 0;
                document.getElementById('totalAsignaciones').textContent = data.total_asignaciones_permisos || 0;
            }
        } catch (error) {
            console.error('Error en resumen general:', error);
        }
    };

    // Función de prueba
    const TestAPI = async () => {
        try {
            const respuesta = await fetch('/lopez_recuperacion_comisiones_ingSoft1/estadisticas/testAPI');
            const datos = await manejarRespuesta(respuesta);
            console.log('Test API:', datos);
        } catch (error) {
            console.error('Error en test API:', error);
        }
    };

    // Actualizar todas las gráficas
    const actualizarTodas = () => {
        console.log('Actualizando todas las estadísticas...');
        TestAPI(); // Primero probar la API
        BuscarUsuarios30Dias();
        BuscarUsuariosPorNombre();
        BuscarPersonalPorRango();
        BuscarUsuariosPorCorreo();
        BuscarComisionesPorEstado();
        BuscarResumenGeneral();
    };

    // Ejecutar al cargar
    console.log('Iniciando estadísticas...');
    actualizarTodas();

    // Botón actualizar
    const btnActualizar = document.getElementById('btnActualizarEstadisticas');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', actualizarTodas);
    }

    // Auto-actualizar cada 5 minutos
    setInterval(actualizarTodas, 300000);
});