<?php
//datos de la BD always Data
// DB_HOST=mysql-seguridad.alwaysdata.net
// DB_USER=seguridad
// DB_PASSWORD=191182173164155
// DB_NAME=seguridad_formulario1
// DB_PORT=3306

$host = 'mysql-seguridad.alwaysdata.net';
$db   = 'seguridad_formulario1';
$user = 'seguridad';
$pass = '191182173164155';
$port = '3306';
$charset = 'utf8mb4'; //interpreta de num a texto

$dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";

try{
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, //manejo de errores
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //fetch devuelve un array asociativo
    ]);
}
catch(PDOException $e){
    echo "Error de conexión: " . $e->getMessage();
    exit;
}

