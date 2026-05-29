<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since");
header('Access-Control-Allow-Methods: GET, POST, PUT');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$actual_link = $_SERVER['HTTP_HOST'];

require '../config/config.php';

// Configuración de conexión segura a la base de datos
if ($actual_link === 'localhost') {
    $mysqli = new mysqli("localhost", "root", "", "easylunch");
} else {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
}

// Filtrado de entradas
$user = filter_input(INPUT_POST, 'user', FILTER_SANITIZE_SPECIAL_CHARS);
$pass = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_SPECIAL_CHARS);
$tipo_de_usuario = filter_input(INPUT_POST, 'tipo_de_usuario', FILTER_SANITIZE_SPECIAL_CHARS);

$tabla = '';
$user_config = '';
$pass_config = '';


if($tipo_de_usuario == 'empleados'){
    $tabla = 'empleados'; 
    $user_config = 'empleados.email';
    $pass_config = 'empleados.pass';
}

// Verificación de que se recibieron datos
if ($user && $pass) {
    // Consulta preparada para evitar inyección de SQL
    $sql = "SELECT 
        empleados.id AS id_user, 
        empleados.nombre, 
        empleados.apellido, 
        empleados.email, 
        empleados.estabaja, 
        empleados.paga_menu_diario, 
        empleados.dni, 
        empleados.pass, 
        empleados.empresa,
        empresa.nombre AS nombre_empresa,
        empresa.id,
        empresa.email AS email_empresa
        FROM empleados 
        INNER JOIN 
        empresa ON empleados.empresa = empresa.id
        WHERE $user_config = ? LIMIT 1";
        //echo $sql;
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $myrow = $result->fetch_assoc();
            
            // Verificar la contraseña usando password_verify
            if (password_verify($pass, $myrow['pass'])) {
                if($tipo_de_usuario == 'empleados'){
                    $userData = array(
                        "user" => $myrow['email'],
                        "id" => $myrow['id_user'],
                        "nombre" => $myrow['nombre'],
                        "apellido" => $myrow['apellido'],
                        "dni" => $myrow['dni'],
                        "empresa" => $myrow['empresa'],
                        "empresa_nombre" => $myrow['nombre_empresa'],
                        "estabaja" => $myrow['estabaja'],
                        "paga_menu_diario" => $myrow['paga_menu_diario']
                    );
                }
                echo json_encode($userData, JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode(["error" => "Contraseña incorrecta"], JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo json_encode(["error" => "Usuario no encontrado"], JSON_UNESCAPED_UNICODE);
        }
        
        $stmt->close();
    }
} else {
    echo json_encode(["error" => "Datos de entrada inválidos"], JSON_UNESCAPED_UNICODE);
}

$mysqli->close();
