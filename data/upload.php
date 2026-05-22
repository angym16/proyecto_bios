<?php

$folder = "../pdf/boletin/";

// borrar archivo anterior
$files = glob($folder . "*");
foreach($files as $file){
  if(is_file($file)) unlink($file);
}

// subir nuevo
$file = $_FILES["pdf"];
$path = $folder . "boletin.pdf";

move_uploaded_file($file["tmp_name"], $path);

echo $path;
?>