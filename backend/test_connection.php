<?php
// backend/test_connection.php
// Ejecuta: php -S 127.0.0.1:8000 -t backend  (y abre /test_connection.php)
$driver = getenv('DB_DRIVER') ?: 'mysql';
$host   = getenv('DB_HOST')   ?: '127.0.0.1';
$port   = getenv('DB_PORT')   ?: '3306';
$db     = getenv('DB_NAME')   ?: 'pawhospital';
$user   = getenv('DB_USER')   ?: 'app';
$pass   = getenv('DB_PASS')   ?: 'apppwd';

$dsn = "$driver:host=$host;port=$port;dbname=$db;charset=utf8mb4";

try {
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  // Ajusta la tabla/columnas si tu schema usa otros nombres
  $stmt = $pdo->query("SELECT nombre, email FROM clientes ORDER BY id DESC LIMIT 5");
  $rows = $stmt->fetchAll();

  header('Content-Type: application/json');
  echo json_encode(["ok" => true, "example_query_result" => $rows], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo "Error de conexión: " . $e->getMessage();
}

