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

$sql = "SELECT * FROM $tabla WHERE id = ?";
//echo $sql;
if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($myrow = $result->fetch_assoc()) {
        
        if($tabla=='secciones'){
            $eventos[] = array(
                "id"=>$myrow['id'],
                "seccion"=>$myrow['seccion'],
                "titulo"=>$myrow['titulo'],
                "subtitulo"=>$myrow['subtitulo'],
                "texto"=>$myrow['texto'],
                "item1"=>$myrow['item1'],
                "item2"=>$myrow['item2'],
                "item3"=>$myrow['item3'],
                "background"=>$myrow['background'],
                "backgroundM"=>$myrow['backgroundM']
                
            );
        }
        if($tabla=='carousel'){
            $eventos[] = array(
                "id"=>$myrow['id'],
                "img"=>$myrow['img'],
                "alt"=>$myrow['alt'],
                "orden"=>$myrow['orden'],
                "mostrar"=>$myrow['mostrar'],
                "id_seccion"=>$myrow['id_seccion']
            );
        }
        if($tabla=='categorias'){
            $eventos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "mostrar"=>$myrow['mostrar'],
                "orden"=>$myrow['orden'],
            );
        }
        if($tabla=='pedidos'){
            $eventos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "apellido"=>$myrow['apellido'],
                "email"=>$myrow['email'],
                "celular"=>$myrow['celular'],
                "formadepago"=>$myrow['formadepago'],
                "envio"=>$myrow['envio'],
                "calle"=>$myrow['calle'],
                "calle_num"=>$myrow['calle_num'],
                "localidad"=>$myrow['localidad'],
                "provincia"=>$myrow['provincia'],
                "partido"=>$myrow['partido'],
                "departamento"=>$myrow['departamento'],
                "codigopostal"=>$myrow['codigopostal'],
                "cantidad"=>$myrow['cantidad'],
                "pedido"=>$myrow['pedido'],
                "delivery"=>$myrow['delivery'],
                "precio"=>$myrow['precio'],
                "email_enviado"=>$myrow['email_enviado'],
                "pago"=>$myrow['pago'],
                "horario"=>$myrow['horario'],
                "id_mercado_pago"=>$myrow['id_mercado_pago'],
                "status"=>$myrow['status'],
                "payment_type"=>$myrow['payment_type'],
                "dni"=>$myrow['dni']
            );
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
