<?php 
// Mendapatkan tipe menu aktif dari URL (default: Personal)
$currentType = isset($_GET['type']) ? $_GET['type'] : 'Personal';
?>

<aside>
    <!-- Card Komponen Menu -->
    <div class="menu-bar" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <h3 style="margin-bottom: 15px; font-size: 1.1rem; color: #1a237e;">Menu</h3>
        <div style="display: flex; gap: 10px;">
            <a href="index.php?type=Personal" 
               class="btn" 
               style="flex: 1; text-align: center; text-decoration: none; display: inline-block; padding: 10px 8px; white-space: nowrap; font-size: 0.85rem; background-color: <?php echo ($currentType === 'Personal') ? '#3f51b5' : '#6c757d'; ?>; color: white; border-radius: 4px;">
               Personal Todo
            </a>
            <a href="index.php?type=Shared" 
               class="btn" 
               style="flex: 1; text-align: center; text-decoration: none; display: inline-block; padding: 10px 8px; white-space: nowrap; font-size: 0.85rem; background-color: <?php echo ($currentType === 'Shared') ? '#3f51b5' : '#6c757d'; ?>; color: white; border-radius: 4px;">
               Shared Todo
            </a>
        </div>
    </div>
    
    <!-- Card Komponen Form -->
    <div class="form-component">
        <h2>Create New Todo</h2>
        <form action="process.php" method="POST" enctype="multipart/form-data">
             <div class="form-group">
                 <label for="title">Title</label>
                 <input type="text" id="title" name="title" placeholder="What needs to be done?" required>
             </div>
             <div class="form-group">
                 <label for="description">Description</label>
                 <textarea id="description" name="description" rows="3" placeholder="Add some details..." required></textarea>
             </div>
             <div class="form-group">
                 <label for="image">Capture Image (Opsional)</label>
                 <input type="file" id="image" name="image" accept="image/*">
             </div>
             <input type="hidden" name="type" value="<?php echo htmlspecialchars($currentType); ?>">
             <button type="submit" name="add_todo" class="btn-submit">Add Todo</button>
        </form>
    </div>
</aside>