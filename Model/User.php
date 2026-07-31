<?php

require_once __DIR__ . "/../Config/database.php";

class User{
    public $table = "usuarios";
    public $id;
    public $nombre;
    public $curso;
    public $nota;
    public $apellido;
    public $email;
    public $password;
    public $tipo;

    public function getByEmail($email){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM " . $this->table . " WHERE email = :email");
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUser(){
        $sql = "SELECT id, nombre, curso, nota FROM estudiantes";
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM estudiantes WHERE id = :id");
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
    
    public function update(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE estudiantes SET nombre = :nombre, curso = :curso, nota = :nota WHERE id = :id");
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":curso", $this->curso);
        $stmt->bindParam(":nota", $this->nota);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }

    public function create(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO estudiantes (nombre, curso, nota) VALUES (:nombre, :curso, :nota)");
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":curso", $this->curso);
        $stmt->bindParam(":nota", $this->nota);
        
        return $stmt->execute();
    }

    public function createUser(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO ".$this->table." (nombre, apellido, email, password, tipo) VALUES (:nombre, :apellido, :email, :password, :tipo)");
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":apellido", $this->apellido);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":tipo", $this->tipo);
        
        return $stmt->execute();
    }
}