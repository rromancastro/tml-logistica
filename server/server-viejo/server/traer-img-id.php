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
header("Content-Type: application/json");

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);



$sql = "SELECT * FROM imagenes
        WHERE id = ? 
        ORDER BY id ASC";

if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($myrow = $result->fetch_assoc()) {
        $lotes[] = array(
            "id"=>$myrow['id'],
            "img"=>$myrow['img'],
            "concepto"=>$myrow['concepto'],
            "id_concepto"=>$myrow['id_concepto'],
            "orden"=>$myrow['orden'],
            "mostrar"=>$myrow['mostrar'],
            "nombre"=>$myrow['nombre'],
            "descripcion"=>$myrow['descripcion'],
            "lugar"=>$myrow['lugar'],
            "edicion"=>$myrow['edicion']
        );
    }
}

$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    print_r(json_encode($lotes,JSON_UNESCAPED_UNICODE));
}
