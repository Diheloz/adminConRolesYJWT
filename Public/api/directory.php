<?php

require_once __DIR__ . "/../../Controller/DirectoryController.php";

$controller = new DirectoryController();

if ($method === "GET") {
    $controller->getDirectory();
}else{
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
}