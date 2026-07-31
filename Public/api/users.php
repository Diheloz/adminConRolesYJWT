<?php

require_once __DIR__ . "/../../Controller/UserController.php";

$controller = new UserController();

if ($method === "GET") {    
    $controller->getUser();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
}
