<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'db_connect.php';

// Match the frontend parameter names
$sender_id = $_GET['admin_id'] ?? null;    // admin
$receiver_id = $_GET['user_id'] ?? null;   // selected user

if (!$sender_id || !$receiver_id) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    // Fetch messages both ways: admin -> user and user -> admin
    $stmt = $pdo->prepare("
        SELECT * FROM live_chat_messages
        WHERE (sender_id = :adminId AND receiver_id = :userId)
           OR (sender_id = :userId AND receiver_id = :adminId)
        ORDER BY created_at ASC
    ");
    $stmt->execute([
        ':adminId' => $sender_id,
        ':userId' => $receiver_id
    ]);

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "messages" => $messages]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
