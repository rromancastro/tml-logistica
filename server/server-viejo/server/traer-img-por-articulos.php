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

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);

$sql = "SELECT * FROM imagenes WHERE articulo = ?";
//echo $sql;
if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($myrow = $result->fetch_assoc()) {
        $ranking = 0;
        $eventos[] = array(
            "id"=>$myrow['id'],
            "base"=>$myrow['base'],
            "img"=>$myrow['img'],
            "elemento"=>$myrow['elemento']
        );
    }
}

$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    print_r(json_encode($eventos,JSON_UNESCAPED_UNICODE));
}
$mysqli->close();
