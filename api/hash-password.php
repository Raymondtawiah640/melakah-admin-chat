<?php
$password = '1234'; // replace with the password you want to hash
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
echo $hashedPassword;
?>
