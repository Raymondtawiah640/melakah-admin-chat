<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// JSON response
header('Content-Type: application/json');

require 'db_connection.php'; // Your DB connection file

$data = json_decode(file_get_contents("php://input"), true);

$sender_id = $data['sender_id'] ?? null;
$receiver_id = $data['receiver_id'] ?? null;
$message = $data['message'] ?? null;

if (!$sender_id || !$receiver_id || !$message) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO chat_messages (sender_id, receiver_id, message)
        VALUES (:sender_id, :receiver_id, :message)
    ");
    $stmt->execute([
        ':sender_id' => $sender_id,
        ':receiver_id' => $receiver_id,
        ':message' => $message
    ]);

    echo json_encode(["success" => true, "message" => "Message sent"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
