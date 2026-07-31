<?php
header("Content-Type: application/json");

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$path = trim(str_replace("/api/", "", $path), "/");
$method = $_SERVER["REQUEST_METHOD"];

switch ($path) {
    case 'auth':
        require __DIR__ . "/auth.php";
        break;
    case 'users':
        require __DIR__ . "/users.php";
        break;
    case 'directory':
        require __DIR__ . "/directory.php";
        break;
    case 'delete':
        require __DIR__ . "/delete.php";
        break;
    case 'update':
        require __DIR__ . "/update.php";
        break;
    case 'create':
        require __DIR__ . "/create.php";
        break;
    case 'delete/directory':
        require __DIR__ . "/deleteDirectory.php";
        break;
    case 'create/directory':
        require __DIR__ . "/createDirectory.php";
        break;   
    case 'report':
        require __DIR__ . "/report.php";
        break;   
    case 'update/directory':
        require __DIR__ . "/updateDirectory.php";
        break;   

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint no encontrado"]);
}
