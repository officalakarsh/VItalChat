<?php
// backend-php/api/logout.php
session_start();
session_unset();
session_destroy();
header('Location: ../../frontend/index.html');
exit;
?>
