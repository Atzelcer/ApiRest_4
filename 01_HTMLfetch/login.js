document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje');
    
    try {
        const result = await api.login(email, password);
        
        if (result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.usuario));
            window.location.href = 'personas.html';
        } else {
            mensaje.textContent = 'Credenciales incorrectas';
            mensaje.className = 'mensaje error';
        }
    } catch (error) {
        mensaje.textContent = 'Error al conectar con el servidor';
        mensaje.className = 'mensaje error';
    }
});