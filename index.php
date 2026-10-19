<?php 
require_once 'config.php'; 
include 'header.php'; 
include 'menu-bar.php'; 

// Menentukan tipe data yang diambil (Personal atau Shared)
$type = isset($_GET['type']) ? $_GET['type'] : 'Personal';
?>

<main>
    <section class="panel-left">
        <h2><?php echo $type; ?> Todo List</h2>
        <ul class="todo-list">
            <?php
            // READ (Menampilkan Data)
            $sql = "SELECT * FROM todos WHERE type = '$type' ORDER BY id DESC";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<li class='todo-item'>";
                    echo "<div style='display:flex; justify-content:space-between; align-items:flex-start;'>";
            
                    // Bagian Teks dan Gambar
                    echo "<div>";
                    $textStyle = $row['is_complete'] ? "text-decoration:line-through; color:gray;" : "";
                    echo "<h3 style='$textStyle'>" . htmlspecialchars($row['title']) . "</h3>";
                    echo "<p class='detail-desc' style='margin-bottom:10px;'>" . htmlspecialchars($row['description']) . "</p>";
            
                    if($row['image_path']) {
                        echo "<img src='".htmlspecialchars($row['image_path'])."' style='max-width:150px; border-radius:4px; margin-bottom:10px;'>";
                    }
                    
                    echo "<p>Status: <strong>" . ($row['is_complete'] ? 'Done' : 'Pending') . "</strong></p>";
                    echo "</div>";

                    // Bagian Tombol Aksi (UPDATE dan DELETE)
                    echo "<div class='detail-actions' style='display:flex; flex-direction:column; gap:5px;'>";
                    if(!$row['is_complete']){
                        echo "<a href='process.php?complete=".$row['id']."&type=".$type."' class='btn btn-complete' style='text-align:center; text-decoration:none; font-size:0.85rem;'>Mark as Done</a>";
                    }
                    echo "<a href='process.php?delete=".$row['id']."&type=".$type."' class='btn btn-delete' style='text-align:center; text-decoration:none; font-size:0.85rem;' onclick='return confirm(\"Yakin ingin menghapus tugas ini?\")'>Delete</a>";
                    echo "</div>";
                    
                    echo "</div>";
                    echo "</li>";
                }
            } else {
                echo "<p>Tidak ada tugas.</p>";
            }
            ?>
        </ul>
    </section>
</main>

<?php include 'footer.php'; ?>