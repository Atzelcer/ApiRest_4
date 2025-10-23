<?php
define('API_URL', 'http://127.0.0.1:8000/api');
define('APP_NAME', 'Sistema de Gestión de Personas');

session_start();

function getAuthToken() {
    return $_SESSION['token'] ?? null;
}

function setAuthToken($token) {
    $_SESSION['token'] = $token;
}

function isLoggedIn() {
    return isset($_SESSION['token']);
}

function logout() {
    session_destroy();
    header('Location: login.php');
    exit;
}
