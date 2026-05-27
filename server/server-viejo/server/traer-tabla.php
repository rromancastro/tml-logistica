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
//header("Content-Type: application/json");

$tabla = filter_input(INPUT_GET, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);

$sql = "SELECT * FROM $tabla WHERE id = ?";
//echo $sql;
if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($myrow = $result->fetch_assoc()) {
        $ranking = 0;
        $eventos[] = array(
            "id"=>$myrow['id'],
            "titulo"=>$myrow['titulo'],
            "fecha"=>$myrow['fecha'],
            "horario"=>$myrow['horario'],
            "precio"=>$myrow['precio'],
            "comensales"=>$myrow['comensales'],
            "anotados"=>$myrow['anotados'],
            "img"=>$myrow['img'],
            "descipcion"=>$myrow['descipcion']
        );
    }
}

$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($eventos,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
