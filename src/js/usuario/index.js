import DataTable from "datatables.net-bs5";
import { Modal, Dropdown } from "bootstrap";
import Swal from "sweetalert2";

// Función para permitir solo números
const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

// Función Toast personalizada
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const formUsuario = document.getElementById('formUsuario')
const BtnBuscarUsuarios = document.getElementById('BtnBuscarUsuarios')
const TablaUsuarios = document.getElementById('TablaUsuarios')

let dataTable;
let modalActualizar;

const guardarUsuario = async e => {
  e.preventDefault();
  
  try {
    const body = new FormData(formUsuario)
    const url = "/lopez_recuperacion_comisiones_ingSoft1/usuario/guardar"
    const config = {
      method: 'POST',
      body
    }

    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    const { codigo, mensaje } = data;

    let icon = 'info'
    if (codigo == 1) {
      icon = 'success'
      formUsuario.reset()
      
      Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Usuario registrado correctamente. ¿Desea registrar otro usuario?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Registrar otro',
        cancelButtonText: 'Ver usuarios',
        confirmButtonColor: '#84fab0'
      }).then((result) => {
        if (result.isDismissed) {
          BuscarUsuarios();
        }
      });

    } else if (codigo == 2) {
      icon = 'warning'

    } else if (codigo == 0) {
      icon = 'error'

    }

    if(codigo !== 1) {
      Toast.fire({
        icon,
        title: mensaje
      });
    }

  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error de conexión'
    });
  }
}

const BuscarUsuarios = async () => {
    const url = '/lopez_recuperacion_comisiones_ingSoft1/usuario/buscar';
    const config = {
        method: 'POST'
    }

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos

        if (codigo == 1) {
            Toast.fire({
                icon: 'success',
                title: mensaje
            });

            const seccionTabla = document.getElementById('SeccionTablaUsuarios');
            if(seccionTabla) {
                seccionTabla.classList.remove('d-none');
            }

            // Destruir DataTable existente si existe
            if (dataTable) {
                dataTable.destroy();
            }

            TablaUsuarios.innerHTML = '';
            
            data.forEach((usuario, index) => {
                const fila = document.createElement('tr');
                
                // CREAR CELDA DE IMAGEN 
                const celdaImagen = document.createElement('td');
                celdaImagen.className = 'text-center';
                
                if (usuario.usuario_fotografia && usuario.usuario_fotografia !== '' && usuario.usuario_fotografia !== null) {
                    const rutaImagen = `/lopez_recuperacion_comisiones_ingSoft1/usuario/imagen?dpi=${usuario.usuario_dpi}`;
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = rutaImagen;
                    imgElement.className = 'foto-usuario';
                    imgElement.alt = 'Foto usuario';
                    imgElement.style.cssText = 'width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd;';
                    
                    const contenedorImg = document.createElement('div');
                    contenedorImg.style.cssText = 'position: relative; display: inline-block;';
                    
                    const spinner = document.createElement('div');
                    spinner.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Cargando...</span></div>';
                    spinner.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
                    
                    contenedorImg.appendChild(spinner);
                    contenedorImg.appendChild(imgElement);
                    
                    imgElement.addEventListener('load', function() {
                        spinner.style.display = 'none';
                        this.style.display = 'block';
                    });
                    
                    imgElement.addEventListener('error', function() {
                        spinner.style.display = 'none';
                        const badge = document.createElement('span');
                        badge.className = 'badge bg-secondary';
                        badge.textContent = 'Sin foto';
                        badge.style.cssText = 'width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 8px;';
                        contenedorImg.appendChild(badge);
                        this.style.display = 'none';
                    });
                    
                    imgElement.style.display = 'none';
                    celdaImagen.appendChild(contenedorImg);
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-secondary';
                    badge.textContent = 'Sin foto';
                    badge.style.cssText = 'width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 8px;';
                    celdaImagen.appendChild(badge);
                }

                // CREAR CELDA DE ACCIONES
                const celdaAcciones = document.createElement('td');
                celdaAcciones.className = 'text-center';
                celdaAcciones.innerHTML = `
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-warning btn-sm btn-actualizar" 
                                data-usuario='${JSON.stringify(usuario)}'>
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger btn-sm btn-eliminar" 
                                data-id="${usuario.usuario_id}" 
                                data-nombre="${usuario.usuario_nom1} ${usuario.usuario_ape1}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                `;
                
                // Construir el resto de la fila
                fila.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${usuario.usuario_nom1 || ''} ${usuario.usuario_nom2 || ''}</td>
                    <td>${usuario.usuario_ape1 || ''} ${usuario.usuario_ape2 || ''}</td>
                    <td>${usuario.usuario_tel || ''}</td>
                    <td>${usuario.usuario_dpi || ''}</td>
                    <td>${usuario.usuario_correo || ''}</td>
                  
                `;
                
                // Insertar las celdas en las posiciones correctas
                fila.insertBefore(celdaImagen, fila.children[1]); // Imagen en posición 2
                fila.appendChild(celdaAcciones); // Acciones al final
                
                TablaUsuarios.appendChild(fila);
            });

            // Agregar event listeners para los botones de acción
            agregarEventListenersAcciones();

        } else {
            Toast.fire({
                icon: 'info',
                title: mensaje
            });
        }

    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'Error al buscar usuarios: ' + error.message
        });
    }
}

const agregarEventListenersAcciones = () => {
    // Botones de actualizar
    document.querySelectorAll('.btn-actualizar').forEach(btn => {
        btn.addEventListener('click', function() {
            const usuario = JSON.parse(this.dataset.usuario);
            abrirModalActualizar(usuario);
        });
    });

    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const nombre = this.dataset.nombre;
            confirmarEliminar(id, nombre);
        });
    });
}

const abrirModalActualizar = (usuario) => {
    Swal.fire({
        title: 'Actualizar Usuario',
        html: `
            <form id="formActualizar">
                <input type="hidden" id="actualizar_usuario_id" value="${usuario.usuario_id}">
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_nom1" class="form-control" placeholder="Primer Nombre" value="${usuario.usuario_nom1}" required>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_nom2" class="form-control" placeholder="Segundo Nombre" value="${usuario.usuario_nom2 || ''}">
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_ape1" class="form-control" placeholder="Primer Apellido" value="${usuario.usuario_ape1}" required>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_ape2" class="form-control" placeholder="Segundo Apellido" value="${usuario.usuario_ape2 || ''}">
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_tel" class="form-control" placeholder="Teléfono" value="${usuario.usuario_tel}" maxlength="8" required>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="actualizar_usuario_dpi" class="form-control" placeholder="DPI" value="${usuario.usuario_dpi}" maxlength="13" required>
                    </div>
                </div>
                
                <div class="mb-3">
                    <textarea id="actualizar_usuario_direc" class="form-control" placeholder="Dirección" rows="2" required>${usuario.usuario_direc}</textarea>
                </div>
                
                <div class="mb-3">
                    <input type="email" id="actualizar_usuario_correo" class="form-control" placeholder="Correo" value="${usuario.usuario_correo}" required>
                </div>
                
                <div class="mb-3">
                    <select id="actualizar_usuario_situacion" class="form-control">
                        <option value="1" ${usuario.usuario_situacion == 1 ? 'selected' : ''}>Activo</option>
                        <option value="0" ${usuario.usuario_situacion == 0 ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        width: '600px',
        preConfirm: () => {
            const formData = new FormData();
            formData.append('usuario_id', document.getElementById('actualizar_usuario_id').value);
            formData.append('usuario_nom1', document.getElementById('actualizar_usuario_nom1').value);
            formData.append('usuario_nom2', document.getElementById('actualizar_usuario_nom2').value);
            formData.append('usuario_ape1', document.getElementById('actualizar_usuario_ape1').value);
            formData.append('usuario_ape2', document.getElementById('actualizar_usuario_ape2').value);
            formData.append('usuario_tel', document.getElementById('actualizar_usuario_tel').value);
            formData.append('usuario_dpi', document.getElementById('actualizar_usuario_dpi').value);
            formData.append('usuario_direc', document.getElementById('actualizar_usuario_direc').value);
            formData.append('usuario_correo', document.getElementById('actualizar_usuario_correo').value);
            formData.append('usuario_situacion', document.getElementById('actualizar_usuario_situacion').value);
            
            return actualizarUsuario(formData);
        }
    });
    
    // Agregar validaciones a los campos del modal
    document.getElementById('actualizar_usuario_tel').addEventListener('input', soloNumeros);
    document.getElementById('actualizar_usuario_dpi').addEventListener('input', soloNumeros);
}

const actualizarUsuario = async (formData) => {
    try {
        const url = "/lopez_recuperacion_comisiones_ingSoft1/usuario/actualizar";
        const config = {
            method: 'POST',
            body: formData
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje } = data;

        if (codigo == 1) {
            Toast.fire({
                icon: 'success',
                title: mensaje
            });
            BuscarUsuarios(); // Recargar la tabla
            return true;
        } else {
            Toast.fire({
                icon: 'error',
                title: mensaje
            });
            return false;
        }

    } catch (error) {
        console.log(error);
        Toast.fire({
            icon: 'error',
            title: 'Error de conexión'
        });
        return false;
    }
}

const confirmarEliminar = (id, nombre) => {
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarUsuario(id);
        }
    });
}

const eliminarUsuario = async (id) => {
    try {
        const body = new FormData();
        body.append('usuario_id', id);
        
        const url = "/lopez_recuperacion_comisiones_ingSoft1/usuario/eliminar";
        const config = {
            method: 'POST',
            body
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje } = data;

        if (codigo == 1) {
            Toast.fire({
                icon: 'success',
                title: mensaje
            });
            BuscarUsuarios(); // Recargar la tabla
        } else {
            Toast.fire({
                icon: 'error',
                title: mensaje
            });
        }

    } catch (error) {
        console.log(error);
        Toast.fire({
            icon: 'error',
            title: 'Error de conexión'
        });
    }
}

// Event Listeners
if (formUsuario) {
    formUsuario.addEventListener('submit', guardarUsuario);
}

if (BtnBuscarUsuarios) {
    BtnBuscarUsuarios.addEventListener('click', BuscarUsuarios);
}

// Validaciones en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Solo números para teléfono y DPI
    const telefonoInputs = document.querySelectorAll('input[name="usuario_tel"]');
    const dpiInputs = document.querySelectorAll('input[name="usuario_dpi"]');
    
    telefonoInputs.forEach(input => {
        input.addEventListener('input', soloNumeros);
        input.addEventListener('input', function() {
            if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
            }
        });
    });
    
    dpiInputs.forEach(input => {
        input.addEventListener('input', soloNumeros);
        input.addEventListener('input', function() {
            if (this.value.length > 13) {
                this.value = this.value.slice(0, 13);
            }
        });
    });

    // Validación de confirmación de contraseña
    const confirmarPassword = document.getElementById('confirmar_contra');
    const password = document.getElementById('usuario_contra');
    
    if (confirmarPassword && password) {
        confirmarPassword.addEventListener('input', function() {
            if (this.value !== password.value) {
                this.setCustomValidity('Las contraseñas no coinciden');
            } else {
                this.setCustomValidity('');
            }
        });
        
        password.addEventListener('input', function() {
            if (confirmarPassword.value !== this.value) {
                confirmarPassword.setCustomValidity('Las contraseñas no coinciden');
            } else {
                confirmarPassword.setCustomValidity('');
            }
        });
    }
});