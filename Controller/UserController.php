<?php

require_once __DIR__ . "/../Model/User.php";
require __DIR__ . "/../middlewares/auth.php";

class UserController {

    public function getByEmail($email) {
        // Lógica para obtener información del usuario
        http_response_code(200);
        echo json_encode(["message" => "Información del usuario obtenida exitosamente"]);
    }

    public function getUser(){ 
            
        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();
        
        //Evita eliminar usuario de la aplicacion si el usuario logueado no tiene perfil "admin"
        if($usuario["tipo"] !== "admin" && $usuario["tipo"] !== "gerente" && $usuario["tipo"] !== "user"){
            http_response_code(403);
            echo json_encode(["success"=>false, "message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        }   

        $user = new User();
        $data= $user->getUser();

        if(!$data){
            http_response_code(404);
            echo json_encode(["message" => "No se encontraron usuarios"]);
            return;
        }else{
            http_response_code(200);
            echo json_encode($data);
        }
    }

    public function delete() {
        
        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();
        
        //Evita eliminar usuario de la aplicacion si el usuario logueado no tiene perfil "admin"
        if($usuario["tipo"] !== "admin"){
            http_response_code(403);
            echo json_encode(["success"=>false,"message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        }
            
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }

        $id = filter_var($data['id'], FILTER_SANITIZE_NUMBER_INT);

        $user = new User();
        $result = $user->delete($id);

        if ($result) {
            http_response_code(200);
            echo json_encode(["message" => "Usuario eliminado exitosamente", "success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al eliminar el usuario", "success" => false]);
        }
    }

    public function update(){

        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();

        //Evita actualizar el usuario de la aplicacion si el usuario logueado no tiene perfil "admin"
        if($usuario["tipo"] !== "admin"){
            http_response_code(403);
            echo json_encode(["success"=>false,"message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        
        if(empty($data["id"]) || empty($data["nombre"]) || empty($data["curso"]) || empty($data["nota"])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }else{
            $nombre =trim(htmlspecialchars($data["nombre"], ENT_QUOTES, 'UTF-8'));
            $curso = trim(htmlspecialchars($data["curso"], ENT_QUOTES, 'UTF-8'));                 
            $nota = floatval($data["nota"]);
            $id = filter_var($data["id"], FILTER_SANITIZE_NUMBER_INT);

            $user = new User();

            $user->nombre = $nombre;
            $user->curso = $curso;
            $user->nota = $nota;
            $user->id = $id;
            
            $result = $user->update();

            if ($result) {
                http_response_code(200);
                echo json_encode(["message" => "Usuario actualizado exitosamente", "success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Error al actualizar el usuario", "success" => false]);
            }
        }
    }

    public function create(){
        //$data = json_decode(file_get_contents("php://input"), true);

        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();

        //Evita actualizar el usuario de la aplicacion si el usuario logueado no tiene perfil "admin"
        if($usuario["tipo"] !== "admin"){
            http_response_code(403);
            echo json_encode(["success"=>false,"message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        }

        if(empty($_POST["nombre"]) || empty($_POST["curso"]) || empty($_POST["nota"])){
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }else{
            $nombre = htmlspecialchars(trim($_POST["nombre"]), ENT_QUOTES, 'UTF-8');
            $curso = htmlspecialchars(trim($_POST["curso"]), ENT_QUOTES, 'UTF-8');
            $nota = floatval($_POST["nota"]);

            $user = new User();

            $user->nombre = $nombre;
            $user->curso = $curso;
            $user->nota = $nota;            
            
            $result = $user->create();
        }
        if($result){
            http_response_code(200);
            echo json_encode(["message" => "Usuario creado exitosamente", "success" => true]);
        }else{
            http_response_code(500);
            echo json_encode(["message" => "Error al crear el usuario", "success" => false]);
        }
    }
}