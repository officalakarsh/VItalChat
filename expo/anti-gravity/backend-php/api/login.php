<?php
// backend-php/api/login.php
session_start();
require_once '../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $pass = $_POST['password'];

    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($pass, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            
            header('Location: ../../frontend/dashboard.html');
            exit;
        } else {
            header('Location: ../../frontend/login.html?error=invalid_credentials');
            exit;
        }
    } catch(PDOException $e) {
        header('Location: ../../frontend/login.html?error=system_error');
        exit;
    }
}
?>
