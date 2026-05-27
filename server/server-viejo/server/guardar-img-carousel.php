<?php
require_once 'conexion.php';
if($actual_link==='localhost'){
    header("Access-Control-Allow-Origin: $localhost");
}else{
    header("Access-Control-Allow-Origin: $server");
}
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

//echo $_POST['base'];

$id_tabla = filter_input(INPUT_POST, 'id_tabla', FILTER_SANITIZE_SPECIAL_CHARS);
$base = base64_decode(filter_input(INPUT_POST, 'base', FILTER_SANITIZE_URL));

$tabla = 'carousel';
//echo $base;

//$base = $_POST['base'];

function base64_to_jpeg($base64_string, $output_file,$tabla) {
    // open the output file for writing

    $dir = "../src/assets/img/".$tabla."/".$output_file;

    $ifp = fopen(  $dir, 'wb' ); 

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode( ',', $base64_string );

    // we could add validation here with ensuring count( $data ) > 1
    fwrite( $ifp, base64_decode( $data[ 1 ] ) );

    // clean up the file resource
    fclose( $ifp ); 

    return 'assets/img/'.$tabla.'/'.$output_file;
}

$n=10;

function getRandomString($n) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
  
    for ($i = 0; $i < $n; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
    }
  
    return $randomString;
}
  
$nombre_foto = getRandomString($n).'.jpeg';

$foto = base64_to_jpeg($base,$nombre_foto,$tabla);


$sql = "INSERT INTO carousel (id,img,orden,mostrar,id_elemento) 
        VALUES 
        (NULL, ?, '99', '1', ?)";
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("si",$foto,$id_tabla);
        $stmt->execute();
    }

printf($stmt->errno);

$stmt->close();
$mysqli->close();
