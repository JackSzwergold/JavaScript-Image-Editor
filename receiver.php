<?php

$filename = $_POST['filename'];
$extension = $_POST['extension'];
$mime_type = $_POST['mime_type'];
$data = $_POST['data'];

$data = substr($data, strpos($data, ',') + 1);
$data = base64_decode($data);

$md5_full = md5($data);
$md5_short = substr($md5_full, 0, 7);

$filename_full = $filename . '_' . $md5_short . '.' . $extension;

// touch($filename_full);

file_put_contents($filename_full, $data);


?>