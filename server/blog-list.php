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

function normalize_rich_text(?string $value): string
{
    $content = (string) ($value ?? '');

    if ($content === '') {
        return '';
    }

    // Algunos registros viejos quedaron guardados con entidades HTML,
    // a veces incluso doble-escapadas. Repetimos la decodificación unas
    // pocas veces hasta estabilizar el contenido.
    $previous = null;
    $iterations = 0;

    while ($content !== $previous && $iterations < 3) {
        $previous = $content;
        $content = html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $iterations++;
    }

    // Quill guarda muchos espacios como NBSP; los normalizamos para que el texto
    // pueda cortar líneas dentro del ancho real de la nota.
    $content = str_replace("\xC2\xA0", ' ', $content);

    return $content;
}

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
                'id_novedad' => (string) ($row['id'] ?? ''),
                'titulo' => (string) ($row['titulo'] ?? ''),
                'fecha' => (string) ($row['fecha'] ?? ''),
                'actualizado' => (string) ($row['actualizado'] ?? ''),
                'descripcion' => normalize_rich_text($row['descripcion'] ?? null),
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
