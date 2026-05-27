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


    $sql = "SELECT * FROM articulos WHERE categoria=? ORDER BY orden ASC";
    //echo $sql;
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("s",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $elementos[] = array(
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
    }




$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($elementos,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
