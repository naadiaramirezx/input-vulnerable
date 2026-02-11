<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET': // LEER USUARIOS
        $stmt = $pdo->query("SELECT * FROM registro");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST': // CREAR USUARIO
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->usuario)) {
            // Si quisieras hacerlo VULNERABLE , usarías la variable directo en el string.
            $sql = "INSERT INTO registro (Users) VALUES (?)";
            $stmt= $pdo->prepare($sql);
            if($stmt->execute([$data->usuario])) {
                echo json_encode(["message" => "Agregado correctamente"]);
            }
        }
        break;

    case 'DELETE': // ELIMINAR USUARIO
        $id = $_GET['id'];
        $sql = "DELETE FROM registro WHERE  Id = ?";
        $stmt= $pdo->prepare($sql);
        $stmt->execute([$id]);
        echo json_encode(["message" => "Usuario eliminado"]);
        break;
}