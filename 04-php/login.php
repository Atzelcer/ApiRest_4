<?php
require_once 'config.php';

if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1>INICIAR SESIÓN</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">EMAIL:</label>
                    <input type="email" id="email" name="email" value="admin@admin.com" required>
                </div>
                <div class="form-group">
                    <label for="password">PASSWORD:</label>
                    <input type="password" id="password" name="password" value="admin123" required>
                </div>
                <button type="submit" id="btnLogin">INGRESAR</button>
                <div id="mensaje" class="mensaje"></div>
            </form>
        </div>
    </div>
    <script src="js/login.js"></script>
</body>
</html>
