<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

// Endpoint de detalle: devuelve una sola noticia por `url`, `id` o `id`.
function read_raw_query_value(string $key): string
{
    $value = filter_input(INPUT_GET, $key, FILTER_UNSAFE_RAW);
    return is_string($value) ? trim($value) : '';
}

try {
    $pdo = adagians_pdo();
    $url = read_raw_query_value('url');
    $idNovedad = read_raw_query_value('id');
    $id = read_raw_query_value('id');

    if ($url === '' && $idNovedad === '' && $id === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Se requiere url, id.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /*
    Bloque anterior: este endpoint devolvia un registro de la tabla blog y hacia
    joins con nosotros para enriquecer autor y foto.

    $where = $url !== '' ? 'b.url = :value' : 'b.id = :value';
    $sql = "
        SELECT
            b.id,
            b.url,
            b.titulo,
            b.subtitulo,
            b.resumen,
            b.img,
            b.categoria,
            b.fecha,
            b.autor,
            b.texto
        FROM blog b
        WHERE b.mostrar = 'si' AND {$where}
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':value', $url !== '' ? $url : $id, $url !== '' ? PDO::PARAM_STR : PDO::PARAM_INT);
    $stmt->execute();
    $item = $stmt->fetch();
    */

    $where = $url !== ''
        ? 'url = :value'
        : 'id = :value';

    $sql = "
        SELECT
            id,
            titulo,
            fecha,
            actualizado,
            descripcion,
            imagen,
            imagenMini,
            link,
            url
        FROM noticias
        WHERE {$where}
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':value', $url !== '' ? $url : ($idNovedad !== '' ? $idNovedad : $id), PDO::PARAM_STR);
    $stmt->execute();
    $item = $stmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(['error' => 'Novedad no encontrada.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $item = [
        'id' => (string) ($item['id'] ?? ''),
        'titulo' => (string) ($item['titulo'] ?? ''),
        'fecha' => (string) ($item['fecha'] ?? ''),
        'actualizado' => (string) ($item['actualizado'] ?? ''),
        'descripcion' => (string) ($item['descripcion'] ?? ''),
        'imagen' => (string) ($item['imagen'] ?? ''),
        'imagenMini' => (string) ($item['imagenMini'] ?? ''),
        'link' => (string) ($item['link'] ?? ''),
        'url' => (string) ($item['url'] ?? ''),
    ];

    echo json_encode($item, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(
        [
            'error' => 'No se pudo obtener la noticia.',
            'php_error' => $e->getMessage(),
            'php_file' => $e->getFile(),
            'php_line' => $e->getLine(),
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}
