<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $xmlData = file_get_contents("php://input");
    $filePath = '../data/' . basename($_GET['file']);

    if (!is_writable(dirname($filePath))) {
        echo "Directory is not writable: " . dirname($filePath);
        exit;
    }

    if (file_put_contents($filePath, $xmlData) !== false) {
        echo "File saved successfully";
    } else {
        echo "Error saving file";
    }
} else {
    echo "Invalid request method";
}
?>