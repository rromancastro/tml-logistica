<?php
error_reporting(E_ALL);
ini_set('display_errors',1);

require_once 'conexion.php';
header("Content-Type: text/html;charset=utf-8");
// CORS
if($actual_link==='localhost'){
    header("Access-Control-Allow-Origin: $localhost");
}else{
    header("Access-Control-Allow-Origin: $server");
}
header("Access-Control-Allow-Methods: GET");

$tabla = filter_input(INPUT_GET, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);

$sql = "DELETE FROM $tabla WHERE id = ?";
//echo $sql;

if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i",$id);
    $stmt->execute();
}

printf($stmt->errno);

$stmt->close();
$mysqli->close();
