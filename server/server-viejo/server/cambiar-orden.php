<?php
if($_SERVER['HTTP_HOST']==='localhost'){
    header("Access-Control-Allow-Origin: http://localhost:4200");
}else{
    header("Access-Control-Allow-Origin: https://espacioanima.com.ar");
}
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

include_once 'class_sql.php';

$tabla = filter_input(INPUT_GET, 'tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);
$orden = filter_input(INPUT_GET, 'orden', FILTER_SANITIZE_SPECIAL_CHARS);

$ccsi = new Sql;

$ccsi->edit($tabla,'orden', $orden,'id',$id);


$mal = $ccsi->getMal();
if($mal>0){
    echo 1;
}else{
    echo 0;
}





