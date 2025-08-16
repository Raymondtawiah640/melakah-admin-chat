<?php
header('Access-Control-Allow-Origin: http://localhost:4200'); // allow Angular app
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require 'db_connect.php';

try {
    $admin_id = isset($_GET['admin_id']) ? (int)$_GET['admin_id'] : 1;

    // Function to count distinct senders by status
    function countChatsByStatus($pdo, $admin_id, $status) {
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT sender_id) AS cnt 
            FROM live_chat_messages 
            WHERE receiver_id = ? AND LOWER(status) = LOWER(?) 
        ");
        $stmt->execute([$admin_id, $status]);
        return (int)$stmt->fetchColumn();
    }

    $incoming_chats  = countChatsByStatus($pdo, $admin_id, 'incoming');
    $active_chats    = countChatsByStatus($pdo, $admin_id, 'active');
    $completed_chats = countChatsByStatus($pdo, $admin_id, 'completed');

    // Count starred chats (any status)
    $starred_stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM live_chat_messages WHERE receiver_id = ? AND starred = 1");
    $starred_stmt->execute([$admin_id]);
    $starred_chats = (int)$starred_stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'counts' => [
            'incoming_chats' => $incoming_chats,
            'active_chats' => $active_chats,
            'completed_chats' => $completed_chats,
            'starred_chats' => $starred_chats
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
