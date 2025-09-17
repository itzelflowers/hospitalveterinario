
<?php
// backend/test_connection.php
// Uso: php -S 127.0.0.1:8000 -t backend  (luego abre /test_connection.php)

$driver = getenv('DB_DRIVER') ?: 'pgsql';
$host   = getenv('DB_HOST') ?: '127.0.0.1';
$port   = getenv('DB_PORT') ?: '5432';
$db     = getenv('DB_NAME') ?: 'veterinaria';
$user   = getenv('DB_USER') ?: 'app';
$pass   = getenv('DB_PASS') ?: 'apppwd';

$dsn = "$driver:host=$host;port=$port;dbname=$db;options='--client_encoding=UTF8'";

try {
  $pdo = new PDO($dsn, $user, $pass, [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]);
  $stmt = $pdo->query("SELECT nombre FROM clientes ORDER BY created_at DESC LIMIT 5");
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  header('Content-Type: application/json');
  echo json_encode(["ok" => true, "example_query_result" => $rows], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo "Error de conexión: " . $e->getMessage();
}
