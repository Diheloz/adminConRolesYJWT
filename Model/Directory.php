<?php

require_once __DIR__ . "/../Config/database.php";

class Directories{   

    public $table = "usuarios";
    public $nombre;
    public $apellido;
    public $email;
    public $tipo;
    public $password;

    public function getDirectory(){
        $pdo = Database::getConnection();
        $sql = "SELECT id, nombre, apellido, email, tipo FROM " .$this->table;
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM " .$this->table. " WHERE id = :id");
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    public function update($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE " .$this->table. " SET nombre = :nombre, apellido = :apellido, email = :email, password = :password, tipo = :tipo WHERE id = " .$id);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":apellido", $this->apellido);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":password", $this->password);

        return $stmt->execute();
        
    }
}