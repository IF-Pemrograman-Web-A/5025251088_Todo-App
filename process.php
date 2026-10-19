<?php
require_once 'config.php';

// 1. CREATE & FILE HANDLING
if (isset($_POST['add_todo'])) {
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $type = $_POST['type'];
    
    $imagePath = NULL;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir); 
        
        $imageName = time() . '_' . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $imageName;
        move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
    }

    $sql = "INSERT INTO todos (title, description, image_path, type) VALUES ('$title', '$desc', '$imagePath', '$type')";
    $conn->query($sql);
    
    header("Location: index.php?type=$type");
    exit();
}

// 2. DELETE
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $type = isset($_GET['type']) ? $_GET['type'] : 'Personal';
    
    // (Opsional) Hapus file gambar dari folder uploads jika ada
    $query = "SELECT image_path FROM todos WHERE id = $id";
    $result = $conn->query($query);
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if($row['image_path'] && file_exists($row['image_path'])) {
            unlink($row['image_path']);
        }
    }

    $sql = "DELETE FROM todos WHERE id = $id";
    $conn->query($sql);
    
    header("Location: index.php?type=$type");
    exit();
}

// 3. UPDATE (Mark as Done)
if (isset($_GET['complete'])) {
    $id = (int)$_GET['complete'];
    $type = isset($_GET['type']) ? $_GET['type'] : 'Personal';
    
    $sql = "UPDATE todos SET is_complete = 1 WHERE id = $id";
    $conn->query($sql);
    
    header("Location: index.php?type=$type");
    exit();
}
?>