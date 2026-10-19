<?php
$host = "localhost";
$user = "root"; // sesuaikan dengan user db kamu
$pass = "";     // sesuaikan dengan password db kamu
$db   = "todo_app";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>