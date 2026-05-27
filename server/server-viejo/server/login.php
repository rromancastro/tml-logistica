<?php
error_reporting(E_ALL);
ini_set('display_errors',1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$actual_link = $_SERVER['HTTP_HOST'];

if($actual_link==='localhost'){
    $mysqli = new mysqli("localhost", "root", "manjarlo1", "anima");
}else{
    $mysqli = new mysqli("localhost", "c1411263_nueva", "peVElera51", "c1411263_nueva");
}

$user = filter_input(INPUT_POST, 'user', FILTER_SANITIZE_SPECIAL_CHARS);
$pass = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_SPECIAL_CHARS);

//echo $user;
//echo $pass;

$sql = "SELECT * FROM usuarios_admin WHERE user=? AND pass=? ORDER BY id ASC";


if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("ss",$user,$pass);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($myrow = $result->fetch_assoc()) {
        $user = array(
            "user"=>$myrow['user'],
        );
    }
}

$stmt->close();
if($result->num_rows===0){
    echo "[]";
}else{
    echo json_encode($user,JSON_UNESCAPED_UNICODE);
}
$mysqli->close();
