import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    const grafico1Element = document.getElementById("grafico1");
    const grafico2Element = document.getElementById("grafico2");
    const grafico3Element = document.getElementById("grafico3");
    const grafico4Element = document.getElementById("grafico4");
    
    if (!grafico1Element || !grafico2Element || !grafico3Element || !grafico4Element) {
        console.error("No se encontraron todos los elementos de gráficos");
        return;
    }

    const grafico1 = grafico1Element.getContext("2d");
    const grafico2 = grafico2Element.getContext("2d");
    const grafico3 = grafico3Element.getContext("2d");
    const grafico4 = grafico4Element.getContext("2d");

    // Gráfico 1: Usuarios por Situación (Pie)
    window.graficaUsuariosPorSituacion = new Chart(grafico1, {
        type: 'pie',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Usuarios por Situación',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { 
                    position: 'bottom',
                    labels: { padding: 20, font: { size: 12 } }
                }
            }
        }
    });

    // Gráfico 2: Usuarios por Año de Registro (Bar)
    window.graficaUsuariosPorAno = new Chart(grafico2, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Usuarios por Año de Registro',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { display: false }
            },
            scales: { 
                y: { 
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad de Usuarios' }
                },
                x: {
                    title: { display: true, text: 'Año' }
                }
            }
        }
    });

    // Gráfico 3: Usuarios por Dominio de Correo (Doughnut)
    window.graficaUsuariosPorDominio = new Chart(grafico3, {
        type: 'doughnut',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Usuarios por Dominio de Correo',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { 
                    position: 'bottom',
                    labels: { padding: 15, font: { size: 11 } }
                }
            }
        }
    });

    // Gráfico 4: Resumen General (Bar Horizontal)
    window.graficaResumenGeneral = new Chart(grafico4, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: { 
                    display: true, 
                    text: 'Resumen General del Sistema',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { display: false }
            },
            scales: { 
                x: { 
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad' }
                }
            }
        }
    });

    // Función para obtener colores aleatorios
    const obtenerColores = (cantidad) => {
        const colores = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
        ];
        return colores.slice(0, cantidad);
    };

    // Función 1: Buscar Usuarios por Situación
    const BuscarUsuariosPorSituacion = async () => {
        const url = '/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorSituacionAPI';
        const config = { method: 'GET' };

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;
            
            if (codigo == 1 && data && data.length > 0) {
                const etiquetas = data.map(d => d.estado);
                const cantidades = data.map(d => parseInt(d.cantidad));
                
                window.graficaUsuariosPorSituacion.data.labels = etiquetas;
                window.graficaUsuariosPorSituacion.data.datasets = [{
                    label: 'Cantidad de Usuarios',
                    data: cantidades,
                    backgroundColor: ['#28a745', '#dc3545'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.graficaUsuariosPorSituacion.update();
            }
        } catch (error) {
            console.error('Error en usuarios por situación:', error);
        }
    }

    // Función 2: Buscar Usuarios por Año de Registro
    const BuscarUsuariosPorAno = async () => {
        const url = '/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorAnoRegistroAPI';
        const config = { method: 'GET' };

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;
            
            if (codigo == 1 && data && data.length > 0) {
                const etiquetas = data.map(d => d.año_registro);
                const cantidades = data.map(d => parseInt(d.cantidad));
                
                window.graficaUsuariosPorAno.data.labels = etiquetas;
                window.graficaUsuariosPorAno.data.datasets = [{
                    label: 'Usuarios Registrados',
                    data: cantidades,
                    backgroundColor: '#36A2EB',
                    borderColor: '#1E88E5',
                    borderWidth: 1
                }];
                window.graficaUsuariosPorAno.update();
            }
        } catch (error) {
            console.error('Error en usuarios por año:', error);
        }
    }

    // Función 3: Buscar Usuarios por Dominio de Correo
    const BuscarUsuariosPorDominio = async () => {
        const url = '/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorDominioCorreoAPI';
        const config = { method: 'GET' };

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;
            
            if (codigo == 1 && data && data.length > 0) {
                const etiquetas = data.map(d => d.dominio_correo);
                const cantidades = data.map(d => parseInt(d.cantidad));
                const colores = obtenerColores(etiquetas.length);
                
                window.graficaUsuariosPorDominio.data.labels = etiquetas;
                window.graficaUsuariosPorDominio.data.datasets = [{
                    label: 'Usuarios por Dominio',
                    data: cantidades,
                    backgroundColor: colores,
                    borderWidth: 2,
                    borderColor: '#fff'
                }];
                window.graficaUsuariosPorDominio.update();
            }
        } catch (error) {
            console.error('Error en usuarios por dominio:', error);
        }
    }

    // Función 4: Buscar Resumen General
    const BuscarResumenGeneral = async () => {
        const url = '/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarResumenGeneralAPI';
        const config = { method: 'GET' };

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;
            
            if (codigo == 1 && data && data.length > 0) {
                const etiquetas = data.map(d => d.categoria);
                const cantidades = data.map(d => parseInt(d.cantidad));
                
                window.graficaResumenGeneral.data.labels = etiquetas;
                window.graficaResumenGeneral.data.datasets = [{
                    label: 'Cantidad',
                    data: cantidades,
                    backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8'],
                    borderColor: ['#0056b3', '#1e7e34', '#e0a800', '#117a8b'],
                    borderWidth: 1
                }];
                window.graficaResumenGeneral.update();
            }
        } catch (error) {
            console.error('Error en resumen general:', error);
        }
    }

    // Función adicional: Usuarios por Mes (se puede usar en lugar de una de las anteriores)
    const BuscarUsuariosPorMes = async () => {
        const url = '/lopez_recuperacion_comisiones_ingSoft1/estadisticas/buscarUsuariosPorMesAPI';
        const config = { method: 'GET' };

        try {
            const respuesta = await fetch(url, config);
            const datos = await respuesta.json();
            const { codigo, mensaje, data } = datos;
            
            if (codigo == 1 && data && data.length > 0) {
                const etiquetas = data.map(d => d.mes);
                const cantidades = data.map(d => parseInt(d.cantidad));
                
                // Aquí podrías actualizar uno de los gráficos con estos datos
                console.log('Usuarios por mes:', data);
            }
        } catch (error) {
            console.error('Error en usuarios por mes:', error);
        }
    }

    // Ejecutar todas las funciones al cargar la página
    BuscarUsuariosPorSituacion();
    BuscarUsuariosPorAno();
    BuscarUsuariosPorDominio();
    BuscarResumenGeneral();

    // Actualizar gráficos cada 30 segundos
    setInterval(() => {
        BuscarUsuariosPorSituacion();
        BuscarUsuariosPorAno();
        BuscarUsuariosPorDominio();
        BuscarResumenGeneral();
    }, 30000);
});