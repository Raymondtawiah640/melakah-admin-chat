<?php
// admin-login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include your database connection
require_once 'db_connect.php';  // make sure this path matches your connection file

// Get POST data from Angular
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Username and password are required."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($password, $admin['password'])) {
        // Login successful
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "admin" => [
                "id" => $admin['id'],
                "username" => $admin['username'],
                "role" => "admin"  // Include role for Angular AuthService
            ]
        ]);
    } else {
        // Invalid login
        echo json_encode([
            "success" => false,
            "message" => "Invalid username or password."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
