<?php
// backend-php/api/register.php
session_start();
require_once '../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['full_name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone'] ?? '');
    $pass = $_POST['password'];
    $conf = $_POST['confirm_password'];

    // Validation
    if ($pass !== $conf) {
        header('Location: ../../frontend/register.html?error=passwords_do_not_match');
        exit;
    }

    try {
        // Check if email already registered
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            header('Location: ../../frontend/register.html?error=email_exists');
            exit;
        }

        // Hash password
        $hash = password_hash($pass, PASSWORD_BCRYPT);

        // Insert user - match with schema.sql which has 'name', 'password_hash'
        $insertQuery = "INSERT INTO users (name, email, phone, password_hash) VALUES (:name, :email, :phone, :password_hash)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':password_hash', $hash);
        
        if ($stmt->execute()) {
            header('Location: ../../frontend/login.html?registered=1');
            exit;
        }
    } catch(PDOException $e) {
        header('Location: ../../frontend/register.html?error=system_error');
        exit;
    }
}
?>
