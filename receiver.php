<?php

$data = $_POST['data'];
$filename = $_POST['filename'];

$data = substr($data, strpos($data, ",") + 1);
$data = base64_decode($data);

file_put_contents($filename, $data);

?>