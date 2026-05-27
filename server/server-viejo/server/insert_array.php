<?php
if($_SERVER['HTTP_HOST']==='localhost'){
    header("Access-Control-Allow-Origin: http://localhost:4200");
}else{
    header("Access-Control-Allow-Origin: https://espacioanima.com.ar");
}
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

include_once 'class_sql.php';

$tabla = filter_input(INPUT_POST, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$filtro = $_POST['datos'];

$array = json_decode($filtro,true);

$sql = new Sql;
$insert = $sql->insert_array($tabla,$array);





