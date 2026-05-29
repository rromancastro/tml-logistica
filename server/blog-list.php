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


try {
    $pdo = adagians_pdo();

    $stmt = $pdo->prepare(
        'SELECT
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
        ORDER BY id ASC'
    );
    $stmt->execute();

    $noticias = array_map(
        static function (array $row): array {
            return [
                'id' => (string) ($row['id'] ?? ''),
                'titulo' => (string) ($row['titulo'] ?? ''),
                'fecha' => (string) ($row['fecha'] ?? ''),
                'actualizado' => (string) ($row['actualizado'] ?? ''),
                'descripcion' => (string) ($row['descripcion'] ?? ''),
                'imagen' => (string) ($row['imagen'] ?? ''),
                'imagenMini' => (string) ($row['imagenMini'] ?? ''),
                'link' => (string) ($row['link'] ?? ''),
                'url' => (string) ($row['url'] ?? ''),
            ];
        },
        $stmt->fetchAll()
    );

    echo json_encode($noticias, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(
        [
            'error' => 'No se pudo obtener el listado de noticias.',
            'php_error' => $e->getMessage(),
            'php_file' => $e->getFile(),
            'php_line' => $e->getLine(),
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}
