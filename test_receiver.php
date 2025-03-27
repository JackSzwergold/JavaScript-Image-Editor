<?php

$backGround = substr($backGround, 22);
$backGround = str_replace(' ', '+', $backGround);
$backGround = base64_decode($backGround);
file_put_contents('test.jpg', $backGround);

?>