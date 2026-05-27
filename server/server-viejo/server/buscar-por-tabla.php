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
$tabla = filter_input(INPUT_GET, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$que = filter_input(INPUT_GET, 'que', FILTER_SANITIZE_SPECIAL_CHARS);

if($que!=""){
    $sql = "SELECT * FROM $tabla WHERE $que like ?";
    $param = "%{$id}%";
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("s",$param);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            
            if($tabla=='articulos'){
                $eventos[] = array(
                    "id"=>$myrow['id'],
                    "nombre"=>$myrow['nombre'],
                    "precio"=>$myrow['precio'],
                    "descripcion"=>$myrow['descripcion'],
                    "img"=>$myrow['img'],
                    "medidas"=>$myrow['medidas'],
                    "lavado"=>$myrow['lavado'],
                    "caracteristicas"=>$myrow['caracteristicas'],
                    "mostrar"=>$myrow['mostrar'],
                    "orden"=>$myrow['orden'],
                    "colores"=>$myrow['colores'],
                    "stock"=>$myrow['stock'],
                    "categoria"=>$myrow['categoria']
                    
                );
            }
            if($tabla=='carousel'){
                $eventos[] = array(
                    "id"=>$myrow['id'],
                    "img"=>$myrow['img'],
                    "orden"=>$myrow['orden'],
                    "mostrar"=>$myrow['mostrar'],
                    "id_elemento"=>$myrow['id_elemento']
                );
            }
            
            
        }
    }
}
$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($eventos,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
