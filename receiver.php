<?php

$filename = $_POST['base64_filename'];
$extension = $_POST['base64_extension'];
$mime_type = $_POST['base64_mime_type'];
$data = $_POST['base64_data'];

$data = substr($data, strpos($data, ',') + 1);
$data = base64_decode($data);

$md5_full = md5($data);
$md5_short = substr($md5_full, 0, 7);

$filename_full = $filename . '_' . $md5_short . '.' . $extension;

// sleep(5);
sleep(0);

file_put_contents($filename_full, $data);


?>