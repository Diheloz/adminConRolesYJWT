<?php

require_once __DIR__ . "/../Model/Directory.php";
require_once __DIR__ . "/../Model/User.php";
require __DIR__ . "/../middlewares/auth.php";

class DirectoryController{

    public function getDirectory(){
        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();
        
        //Evita eliminar usuario de la aplicacion si el usuario logueado no tiene perfil "admin"
        if($usuario["tipo"] !== "admin" && $usuario["tipo"] !== "gerente" && $usuario["tipo"] !== "user"){
            http_response_code(403);
            echo json_encode(["success"=>false, "message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        } 

        $directory = new Directories();
        $data = $directory->getDirectory();

        if($data){
            http_response_code(200);
            echo json_encode($data);
        }else{
            http_response_code(400);
            echo json_encode(["success"=>false, "message"=>"No se encontraron usuarios"]);
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
        $user = new Directories();
        $result = $user->delete($id);

        if ($result) {
            http_response_code(200);
            echo json_encode(["message" => "Usuario eliminado exitosamente", "success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al eliminar el usuario", "success" => false]);
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

        if(empty(trim($_POST["nombre"])) || empty(trim($_POST["apellido"])) || empty(trim($_POST["email"])) || empty(trim($_POST["password"])) || empty(trim($_POST["tipo"]))){
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }else{
            //Arreglo con roles de usuario permitidos
            $rolesPermitidos = ["admin", "gerente", "user"];

            //Sanitizacion de data recibida
            $nombre = htmlspecialchars(trim($_POST["nombre"]), ENT_QUOTES, 'UTF-8');
            $apellido = htmlspecialchars(trim($_POST["apellido"]), ENT_QUOTES, 'UTF-8');
            $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
            //$password = htmlspecialchars(trim($_POST["password"]), ENT_QUOTES, 'UTF-8');
            $rolSeleccionado = filter_input(INPUT_POST, "tipo", FILTER_SANITIZE_SPECIAL_CHARS);            
            $passwordHash = password_hash($_POST["password"], PASSWORD_BCRYPT);

            //Comparar la data recibida con los roles validos
            if(!in_array($rolSeleccionado, $rolesPermitidos)){
                http_response_code(400);
                echo json_encode(["error"=>"El rol seleccionado no existe"]);
                return;
            }

            $user = new User();

            $user->nombre = $nombre;
            $user->apellido = $apellido;
            $user->email = $email;
            $user->password = $passwordHash;            
            $user->tipo = $rolSeleccionado;            
            
            $result = $user->createUser();
        }
        if($result){
            http_response_code(200);
            echo json_encode(["message" => "Usuario creado exitosamente", "success" => true]);
        }else{
            http_response_code(500);
            echo json_encode(["message" => "Error al crear el usuario", "success" => false]);
        }
    }

    public function showReport(){
        $token = validateToken();
        $directory = new Directories();
        $users = $directory->getDirectory();
        
        if($users){
            http_response_code(200);
            echo json_encode(["success"=>true, "users"=> $users]);
        }else{
            http_response_code(400);
            echo json_encode(["success"=>false, "message"=>"No se encontraron usuarios"]);
        }
    }

    public function update(){
        //Se llama al middleware, que valida el token enviado desde la peticion fetch
        $usuario = validateToken();
        
        //Evita actualizar usuario de la aplicacion si el usuario logueado no tiene ninguno de los perfiles
        if($usuario["tipo"] !== "admin" && $usuario["tipo"] !== "gerente" && $usuario["tipo"] !== "user"){
            http_response_code(403);
            echo json_encode(["success"=>false, "message"=>"El usuario no posee los permisos suficientes"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['id']) || empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password']) || empty($data['tipo'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parametros"]);
            return;
        }
        $nombre = trim(htmlspecialchars($data["nombre"],ENT_QUOTES, "UTF-8"));
        $apellido = trim(htmlspecialchars($data["apellido"],ENT_QUOTES, "UTF-8"));
        $tipo = trim(htmlspecialchars($data["tipo"],ENT_QUOTES, "UTF-8"));
        $email = trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL));
        $id = filter_var($data['id'], FILTER_SANITIZE_NUMBER_INT);
        $password = password_hash($data["password"],PASSWORD_BCRYPT);

        $user = new Directories();

        $user->nombre = $nombre;
        $user->apellido = $apellido;
        $user->email = $email;
        $user->tipo = $tipo;
        $user->password = $password;

        $result = $user->update($id);

        if ($result) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
            return;
        }else{
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Error al actualizar el usuario"]);
            return;
        }
    }
}