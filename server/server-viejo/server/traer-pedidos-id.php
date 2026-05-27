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

if($id!=0){
    $sql = "SELECT * FROM pedidos WHERE id = ? ORDER BY id ASC";
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $pedidos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "apellido"=>$myrow['apellido'],
                "celular"=>$myrow['celular'],
                "email"=>$myrow['email']  , 
                "formadepago"=>$myrow['formadepago'],
                "envio"=>$myrow['envio'],
                "calle"=>$myrow['calle'],
                "calle_num"=>$myrow['calle_num'],
                "provincia"=>$myrow['provincia'],
                "localidad"=>$myrow['localidad'],
                "partido"=>$myrow['partido'],
                "departamento"=>$myrow['departamento'],
                "cantidad"=>$myrow['cantidad'],
                "pedido"=>$myrow['pedido'],
                "delivery"=>$myrow['delivery'],
                "precio"=>$myrow['precio'],
                "email_enviado"=>$myrow['email_enviado'],
                "horario"=>$myrow['horario'],
                "pago"=>$myrow['pago'],
                "id_mercado_pago"=>$myrow['id_mercado_pago'],
                "status"=>$myrow['status'],
                "payment_type"=>$myrow['payment_type'],
                "dni"=>$myrow['dni'],
                "codigopostal"=>$myrow['codigopostal']
            );
        }
    }
}else{
    $sql = "SELECT * FROM pedidos ORDER BY id ASC";
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $pedidos[] = array(
                "id"=>$myrow['id'],
                "nombre"=>$myrow['nombre'],
                "apellido"=>$myrow['apellido'],
                "celular"=>$myrow['celular'],
                "email"=>$myrow['email']  , 
                "formadepago"=>$myrow['formadepago'],
                "envio"=>$myrow['envio'],
                "calle"=>$myrow['calle'],
                "calle_num"=>$myrow['calle_num'],
                "provincia"=>$myrow['provincia'],
                "localidad"=>$myrow['localidad'],
                "partido"=>$myrow['partido'],
                "departamento"=>$myrow['departamento'],
                "cantidad"=>$myrow['cantidad'],
                "pedido"=>$myrow['pedido'],
                "delivery"=>$myrow['delivery'],
                "precio"=>$myrow['precio'],
                "email_enviado"=>$myrow['email_enviado'],
                "horario"=>$myrow['horario'],
                "pago"=>$myrow['pago'],
                "id_mercado_pago"=>$myrow['id_mercado_pago'],
                "status"=>$myrow['status'],
                "payment_type"=>$myrow['payment_type'],
                "dni"=>$myrow['dni'],
                "codigopostal"=>$myrow['codigopostal']
            );
        }
    }
}
$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($pedidos,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
