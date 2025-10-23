const API_URL = 'http://127.0.0.1:8000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btnLogin = document.getElementById('btnLogin');
    const mensaje = document.getElementById('mensaje');
    
    btnLogin.disabled = true;
    btnLogin.textContent = 'CONECTANDO...';
    mensaje.className = 'mensaje loading';
    mensaje.textContent = 'Conectando con el servidor...';
    
    try {
        const response = await fetch('api.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            mensaje.className = 'mensaje success';
            mensaje.textContent = 'Login exitoso. Redirigiendo...';
            
            setTimeout(() => {
                window.location.href = 'dashboard.php';
            }, 500);
        } else {
            mensaje.className = 'mensaje error';
            mensaje.textContent = data.message || 'Credenciales incorrectas';
            btnLogin.disabled = false;
            btnLogin.textContent = 'INGRESAR';
        }
    } catch (error) {
        mensaje.className = 'mensaje error';
        mensaje.textContent = 'Error de conexión. Asegúrate que Laravel esté corriendo en http://127.0.0.1:8000';
        btnLogin.disabled = false;
        btnLogin.textContent = 'INGRESAR';
    }
});
