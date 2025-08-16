<?php
header('Access-Control-Allow-Origin: http://localhost:4200'); // allow Angular app
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require 'db_connect.php';

try {
    $admin_id = isset($_GET['admin_id']) ? (int)$_GET['admin_id'] : 1;

    // Fetch incoming chats for the admin
    $stmt = $pdo->prepare("
        SELECT id, sender_id, receiver_id, status, starred, created_at
        FROM live_chat_messages
        WHERE receiver_id = ? AND LOWER(status) = 'incoming'
        ORDER BY created_at DESC
    ");
    $stmt->execute([$admin_id]);
    $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($chats);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
