<?php
header('Content-Type: application/json');
require 'db_connect.php';

try {
    $admin_id = 1; // adjust if your admin ID is dynamic

    $stmt = $pdo->prepare("
        SELECT 
          (SELECT COUNT(DISTINCT sender_id) 
           FROM live_chat_messages 
           WHERE receiver_id = :adminId AND status = 'incoming') AS incoming_chats,
          
          (SELECT COUNT(DISTINCT sender_id) 
           FROM live_chat_messages 
           WHERE status = 'active') AS active_chats,
          
          (SELECT COUNT(DISTINCT sender_id) 
           FROM live_chat_messages 
           WHERE status = 'completed') AS completed_chats,
          
          (SELECT COUNT(*) 
           FROM live_chat_messages 
           WHERE starred = 1) AS starred_chats
    ");

    $stmt->execute([':adminId' => $admin_id]);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'counts' => $counts]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
