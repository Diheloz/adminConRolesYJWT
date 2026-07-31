<?php

require_once __DIR__ . "/../Model/User.php";
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__. "/../config.php";

use Firebase\JWT\JWT;

class AuthController{

    public function login(){

        $data = json_decode(file_get_contents("php://input"),true);          
        
        if(!isset($data['email']) || !isset($data['password'])){
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }

        $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);                 
        htmlspecialchars($data['password'], ENT_QUOTES, 'UTF-8');

        $user = new User();
        $user = $user->getByEmail($data['email']); 
        
        //Verificar si el usuario existe y la contraseña es correcta
        if(!$user || !password_verify($data['password'], $user['password'])){
            http_response_code(401);
            echo json_encode(["message" => "Credenciales invalidas", "success"=>false]);
            return;
        }else{
            //Recolectar la informacion del usuario despues de loguearse para insertarla en el token
            $payload = [
                "id" =>$user["id"],
                "nombre" =>$user["nombre"],
                "apellido" =>$user["apellido"],
                "email" =>$user["email"],
                "tipo" =>$user["tipo"],
                "exp" => time() + 3600
            ];
            /*Se genera un token unico para el usuario logueado y se envia a la peticion http
                1.Convierte el payload a JSON
                2.Lo firma con mi clave secreta                
            */
            $token = JWT::encode($payload,JWT_SECRET,"HS256");
            http_response_code(200);            
            echo json_encode(["message" => "Login exitoso", "token" => $token, "success"=>true]);
        }
    }
}