<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connect.php'; // your PDO connection

$adminId = 1; // logged-in admin

try {
    // Get all unique user IDs who have sent a message to the admin
    $stmt = $pdo->prepare("
        SELECT DISTINCT 
            CASE 
                WHEN sender_id != :adminId THEN sender_id 
                WHEN receiver_id != :adminId THEN receiver_id 
            END AS user_id
        FROM live_chat_messages
        WHERE sender_id = :adminId OR receiver_id = :adminId
    ");
    $stmt->execute([':adminId' => $adminId]);
    $userIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Convert IDs to simple user objects
    $users = array_map(fn($id) => ['id' => $id, 'name' => "User $id"], $userIds);

    echo json_encode([
        "success" => true,
        "users" => $users
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
