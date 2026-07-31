<?php

require_once __DIR__ . "/index.php";
require_once __DIR__ . "/../../Controller/AuthController.php";

$controller = new AuthController();

if ($method === "POST") {
    $controller->login();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
}