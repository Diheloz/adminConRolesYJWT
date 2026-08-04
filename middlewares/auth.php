<?php

//Un middleware es un codigo que se ejecuta antes de que los endpoint hagan su trabajo.Es un filtro que revisa reglas.

require __DIR__. "/../vendor/autoload.php";
require __DIR__. "/../config.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function validateToken(){

   //Obtener headers -> busca (Authorization: Bearer TOKEN) enviado desde la peticion fetch
   $headers = getallheaders();

   //Si el header no existe, entra en el condicional
   if(!isset($headers["Authorization"])){
      http_response_code(401);
      echo json_encode(["message"=>"Token requerido"]);
      exit; 
   }

   //Limpiar el token(quita Bearer)
   $token = str_replace("Bearer ", "", $headers["Authorization"]);

   //Intentar decodificar, y si la firma y clave son correctas y no esta modificado, devuelve el payload al endpoint
   try{
      $decoded = JWT::decode($token, new Key(JWT_SECRET, "HS256"));
      return (array)$decoded;
   }catch(Exception $e){
      http_response_code(401);
      echo json_encode(["message"=>"Token inválido"]);
      exit;
   }
}