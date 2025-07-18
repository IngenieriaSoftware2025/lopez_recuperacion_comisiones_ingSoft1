import Swal from 'sweetalert2';
import { validarFormulario } from '../funciones';

const FormLogin = document.getElementById('FormLogin');
const BtnIniciar = document.getElementById('BtnIniciar');

const login = async (e) => {
    e.preventDefault();
    BtnIniciar.disabled = true;

    // Validar campos
    const correo = document.getElementById('usuario_correo').value.trim();
    const password = document.getElementById('usuario_contra').value;

    if (!correo || !password) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos",
            icon: "info"
        });
        BtnIniciar.disabled = false;
        return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            title: "Correo inválido",
            text: "Por favor ingrese un correo electrónico válido",
            icon: "warning"
        });
        BtnIniciar.disabled = false;
        return;
    }

    try {
        const body = new FormData(FormLogin);
        const url = '/lopez_recuperacion_comisiones_ingSoft1/login/iniciar'; // Esta es la URL que está en tu ruta
        const config = {
            method: 'POST',
            body
        };

        console.log('Enviando petición a:', url); 
        
        const respuesta = await fetch(url, config);
        
        // Verificar si la respuesta es JSON
        const contentType = respuesta.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("La respuesta del servidor no es JSON válido");
        }
        
        const data = await respuesta.json();
        const { codigo, mensaje } = data;

        if (codigo == 1) {
            await Swal.fire({
                title: '¡Bienvenido!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: true,
                timer: 1500,
                timerProgressBar: false,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }
            });

            FormLogin.reset();
            
            // Redireccionar al inicio
            window.location.href = '/lopez_recuperacion_comisiones_ingSoft1/inicio';
        } else {
            Swal.fire({
                title: '¡Error!',
                text: mensaje,
                icon: 'warning',
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: false,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }
            });
        }

    } catch (error) {
        console.error('Error en login:', error);
        
        Swal.fire({
            title: '¡Error de conexión!',
            text: 'No se pudo conectar con el servidor. Verifique su conexión.',
            icon: 'error',
            showConfirmButton: true,
            background: '#e0f7fa',
            customClass: {
                title: 'custom-title-class',
                text: 'custom-text-class'
            }
        });
    }

    BtnIniciar.disabled = false;
}

// Event listeners
if (FormLogin) {
    FormLogin.addEventListener('submit', login);
}

// Validación en tiempo real del correo
const correoInput = document.getElementById('usuario_correo');
if (correoInput) {
    correoInput.addEventListener('input', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.setCustomValidity('Por favor ingrese un correo válido');
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (email) {
            this.setCustomValidity('');
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else {
            this.setCustomValidity('');
            this.classList.remove('is-valid', 'is-invalid');
        }
    });
}

// Validación de contraseña
const passwordInput = document.getElementById('usuario_contra');
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password && password.length < 8) {
            this.setCustomValidity('La contraseña debe tener al menos 8 caracteres');
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (password) {
            this.setCustomValidity('');
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else {
            this.setCustomValidity('');
            this.classList.remove('is-valid', 'is-invalid');
        }
    });
}

// Detectar Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.activeElement.form === FormLogin) {
        e.preventDefault();
        login(e);
    }
});