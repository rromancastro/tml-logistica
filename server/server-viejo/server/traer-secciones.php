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


if($id=="0"){
    //echo 0;
    $sql = "SELECT * FROM secciones ORDER BY id ASC";
    //echo $sql;
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $elementos[] = array(
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
    }
}else{
    //echo 1;
    $sql = "SELECT secciones.id,secciones.titulo,secciones.background,secciones.backgroundM,secciones.subtitulo,secciones.texto,secciones.seccion,secciones.item1,secciones.item2,secciones.item3,carousel.img,carousel.id_seccion,carousel.alt,carousel.orden,carousel.mostrar 
            FROM secciones 
            INNER JOIN carousel ON secciones.id = carousel.id_seccion
            WHERE secciones.seccion = ?
            ORDER BY carousel.orden ASC";
    
    //echo $sql;
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("s",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($myrow = $result->fetch_assoc()) {
            $elementos[] = array(
                "id"=>$myrow['id'],
                "seccion"=>$myrow['seccion'],
                "titulo"=>$myrow['titulo'],
                "subtitulo"=>$myrow['subtitulo'],
                "texto"=>$myrow['texto'],
                "item1"=>$myrow['item1'],
                "item2"=>$myrow['item2'],
                "item3"=>$myrow['item3'],
                "img"=>$myrow['img'],
                "id_seccion"=>$myrow['id_seccion'],
                "alt"=>$myrow['alt'],
                "background"=>$myrow['background'],
                "backgroundM"=>$myrow['backgroundM'],
                "orden"=>$myrow['orden'],
                "mostrar"=>$myrow['mostrar'],
            );
        }
    }
}



$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($elementos,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
