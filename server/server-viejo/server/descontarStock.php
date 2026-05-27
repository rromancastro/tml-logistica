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

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);
$indexColor = filter_input(INPUT_GET, 'indexColor', FILTER_SANITIZE_SPECIAL_CHARS);

$sql = "SELECT * FROM articulos WHERE id=? ORDER BY precio ASC";

if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i",$id);
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
            "stock"=>$myrow['stock']
        );
    }
}

if($result->num_rows===0){
    echo "[]";
}else{
   /* echo "<pre>";
    print_r($elementos);
    echo "</pre>";*/
    if(strpos($elementos[0]['stock'], ",") !== false){
        $nuevoStock = explode(",",$elementos[0]['stock']);
        $nuevoStock[$indexColor]--;
        $nuevoStockString = implode(",",$nuevoStock);
       // echo $nuevoStockString;
    } else{
        $nuevoStockString = (int) $elementos[0]['stock'] - 1;
        //echo $nuevoStockString;
    }

    $sqlUpdateStock ="UPDATE elementos SET stock = '$nuevoStockString' WHERE id=?";    
    if ($stmt = $mysqli->prepare($sqlUpdateStock)) {
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    }
    $mysqli->close();
}
