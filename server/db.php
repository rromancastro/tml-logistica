<?php
declare(strict_types=1);

// Conexión única a la base para reutilizarla desde los endpoints.
function adagians_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dbHost = 'localhost';
    $dbName = 'c1411263_nueva';
    $dbUser = 'c1411263_nueva';
    $dbPass = 'peVElera51';

    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    return $pdo;
}
