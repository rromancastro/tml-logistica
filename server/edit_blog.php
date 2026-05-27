<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cabeceras para CORS y tipo de contenido.
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since");
header("Access-Control-Allow-Methods: GET, POST, PUT");

include_once 'class_sql.php';

// El bloque anterior asumía JSON puro en php://input, pero Angular envía form-urlencoded.
// Por eso ahora leemos $_POST y, si hace falta, parseamos el body crudo manualmente.
$data = $_POST;
if (empty($data)) {
    parse_str(file_get_contents("php://input"), $data);
}

// Validamos los parámetros mínimos para editar un registro.
if (!isset($data['tabla'], $data['datos'], $data['id'], $data['where'])) {
    echo json_encode(["error" => "Faltan parámetros requeridos (tabla, datos, id, where)"]);
    exit;
}

$tabla = preg_replace('/[^a-zA-Z0-9_]/', '', $data['tabla']);
$id = htmlspecialchars($data['id'], ENT_QUOTES);
$where = preg_replace('/[^a-zA-Z0-9_]/', '', $data['where']);

// `datos` llega como string JSON dentro del formulario urlencoded.
$array = json_decode($data['datos'], true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($array)) {
    echo json_encode(["error" => "ERROR al decodificar el campo datos: " . json_last_error_msg()]);
    exit;
}

$sql = new Sql();
$update_success = true;

foreach ($array as $key => $value) {
    if (!is_array($value)) {
        if ($key === 'texto') {
            // El texto del blog se guarda como JSON de bloques sin escape extra.
            $sql->editBlog($tabla, $key, $value, $where, $id);
        } else {
            // El resto de campos se sanitiza como texto normal.
            $value = htmlspecialchars($value, ENT_QUOTES);
            $sql->edit($tabla, $key, $value, $where, $id);
        }

        if ($sql->getMal() > 0) {
            $update_success = false;
            break;
        }
    }
}

// Respuesta final: 0 = OK, 1 = error.
if (!$update_success || $sql->getMal() > 0) {
    echo 1;
} else {
    echo 0;
}
