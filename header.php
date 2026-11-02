<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Own Todo App</title>
    <link rel="stylesheet" href="style.css">
    <!-- Link Manifest PWA -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#1a237e">
</head>
<body>
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem;">
        <!-- Membungkus Icon dan Judul agar sejajar -->
        <div style="display: flex; align-items: center; gap: 15px;">
            <img src="icon-192.png" alt="Todo App Icon" style="width: 40px; height: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <h1 style="margin: 0;">My Todo Dashboard</h1>
        </div>
        
        <!-- Tombol Install PWA -->
        <button id="install-btn" class="btn" style="display: none; background-color: #28a745; color: white;">Install App</button>
    </header>
    <div class="layout-container">