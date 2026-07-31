<?php

class Database {
    private static $host = "localhost";
    private static $dbname = "crud_estudiantes";
    private static $username = "root";
    private static $password = "root";

    public static function getConnection() {
        try {
            $pdo = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$dbname . ";charset=utf8", self::$username, self::$password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Error de conexion a la base de datos: " . $e->getMessage());
        }
        return $pdo;
    }
}