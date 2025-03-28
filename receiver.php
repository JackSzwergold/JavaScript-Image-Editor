<?php

$data = $_POST['data'];
$filename = $_POST['filename'];

$data = substr($data, strpos($data, ",") + 1);
$data = base64_decode($data);

$md5_full = md5($data);
$md5_short = substr($md5_full, 0, 7);

$filename = $md5_short . '_' . $filename;

file_put_contents($filename, $data);


?>