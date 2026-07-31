<?php

// require_once __DIR__ . "/index.php";
require_once __DIR__ . "/../../Controller/DirectoryController.php";

$controller = new DirectoryController();

if ($method === "PUT") {
    $controller->update();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
}