<?php
ob_start();

// Konfigurasi Header untuk REST API
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-api-key");

require_once 'config.php';

// ==========================================
// 1. (Opsional) API KEY AUTHENTICATION
// ==========================================
$headers = getallheaders();
$headers = array_change_key_case($headers, CASE_LOWER); // Paksa semua key menjadi huruf kecil
$apiKey = isset($headers['x-api-key']) ? $headers['x-api-key'] : '';

$validApiKey = "alvero-secret-key-2026"; // Key rahasia kamu

if ($apiKey !== $validApiKey) {
    http_response_code(401); // 401 Unauthorized
    echo json_encode(["status" => "error", "message" => "Unauthorized. API Key tidak valid atau hilang."]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // ==========================================
    // 2. GET (Membaca Data)
    // ==========================================
    case 'GET':
        $type = isset($_GET['type']) ? $conn->real_escape_string($_GET['type']) : 'Personal';
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

        if ($id > 0) {
            $sql = "SELECT * FROM todos WHERE id = $id";
        } else {
            $sql = "SELECT * FROM todos WHERE type = '$type' ORDER BY id DESC";
        }

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $todos = [];
            while($row = $result->fetch_assoc()) {
                $todos[] = $row;
            }
            http_response_code(200); // 200 OK
            echo json_encode(["status" => "success", "data" => $todos]);
        } else {
            http_response_code(404); // 404 Not Found (Handling Wrong Response Code)
            echo json_encode(["status" => "error", "message" => "Data tidak ditemukan."]);
        }
        break;

    // ==========================================
    // 3. POST (Menambah Data)
    // ==========================================
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->title) && !empty($data->description)) {
            $title = $conn->real_escape_string($data->title);
            $desc = $conn->real_escape_string($data->description);
            $type = isset($data->type) ? $conn->real_escape_string($data->type) : 'Personal';

            $sql = "INSERT INTO todos (title, description, type) VALUES ('$title', '$desc', '$type')";
            if ($conn->query($sql)) {
                http_response_code(201); // 201 Created
                echo json_encode(["status" => "success", "message" => "Todo berhasil ditambahkan."]);
            } else {
                http_response_code(500); // 500 Internal Server Error
                echo json_encode(["status" => "error", "message" => "Gagal menambahkan data."]);
            }
        } else {
            http_response_code(400); // 400 Bad Request (Handling Data Error)
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap. Title dan Description wajib diisi."]);
        }
        break;

    // ==========================================
    // 4. PUT / PATCH (Memperbarui Data - Mark as Done)
    // ==========================================
    case 'PUT':
    case 'PATCH':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            $id = (int)$data->id;
            
            $check = $conn->query("SELECT id FROM todos WHERE id = $id");
            if($check->num_rows > 0) {
                $sql = "UPDATE todos SET is_complete = 1 WHERE id = $id";
                if ($conn->query($sql)) {
                    http_response_code(200); // 200 OK
                    echo json_encode(["status" => "success", "message" => "Todo berhasil diselesaikan."]);
                } else {
                    http_response_code(500); 
                    echo json_encode(["status" => "error", "message" => "Gagal update data."]);
                }
            } else {
                http_response_code(404); // 404 Not Found (User/Data doesn't exist)
                echo json_encode(["status" => "error", "message" => "Todo tidak ditemukan."]);
            }
        } else {
            http_response_code(400); // 400 Bad Request
            echo json_encode(["status" => "error", "message" => "ID tidak diberikan."]);
        }
        break;

    // ==========================================
    // 5. DELETE (Menghapus Data)
    // ==========================================
    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id === 0) {
            $data = json_decode(file_get_contents("php://input"));
            $id = isset($data->id) ? (int)$data->id : 0;
        }

        if ($id > 0) {
            $check = $conn->query("SELECT id FROM todos WHERE id = $id");
            if($check->num_rows > 0) {
                $sql = "DELETE FROM todos WHERE id = $id";
                if ($conn->query($sql)) {
                    http_response_code(200); // 200 OK
                    echo json_encode(["status" => "success", "message" => "Todo berhasil dihapus."]);
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => "Gagal menghapus data."]);
                }
            } else {
                http_response_code(404); // 404 Not Found
                echo json_encode(["status" => "error", "message" => "Todo tidak ditemukan untuk dihapus."]);
            }
        } else {
            http_response_code(400); // 400 Bad Request
            echo json_encode(["status" => "error", "message" => "ID tidak diberikan."]);
        }
        break;

    // ==========================================
    // Default: Method Tidak Dikenal
    // ==========================================
    default:
        http_response_code(405); // 405 Method Not Allowed
        echo json_encode(["status" => "error", "message" => "Metode HTTP tidak diizinkan."]);
        break;
}
?>