<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

include_once 'class_sql.php';

$tabla = filter_input(INPUT_POST, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$que = filter_input(INPUT_POST, 'que', FILTER_SANITIZE_SPECIAL_CHARS);
$valor = filter_input(INPUT_POST, 'valor', FILTER_SANITIZE_SPECIAL_CHARS);
$id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_SPECIAL_CHARS);
$where = filter_input(INPUT_POST, 'where', FILTER_SANITIZE_SPECIAL_CHARS);

$array = json_decode($datos, True);

$ccsi = new Sql;
$ccsi->edit($tabla,$que,$valor,$where,$id);
$mal = $ccsi->getMal();
if($mal>0){
    echo 1;
}else{
    echo 0;
}





