
CREATE TABLE `live_chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('incoming','active','completed') DEFAULT 'incoming',
  `starred` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) 