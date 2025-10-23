<?php
require_once 'config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            $ch = curl_init(API_URL . '/login');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => $email, 'password' => $password]));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            $data = json_decode($response, true);
            
            if ($httpCode === 200 && isset($data['token'])) {
                setAuthToken($data['token']);
                echo json_encode(['success' => true, 'token' => $data['token']]);
            } else {
                echo json_encode(['success' => false, 'message' => $data['mensaje'] ?? 'Credenciales incorrectas']);
            }
        }
        break;
        
    case 'check':
        echo json_encode(['loggedIn' => isLoggedIn(), 'token' => getAuthToken()]);
        break;
        
    case 'logout':
        logout();
        echo json_encode(['success' => true]);
        break;
        
    default:
        echo json_encode(['error' => 'Acción no válida']);
}
