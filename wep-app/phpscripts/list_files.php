<?php
header('Content-Type: application/json');

$directory = '../data/';
$files = array_diff(scandir($directory), array('..', '.', '.htaccess'));
$xmlFiles = [];

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'xml') {
        $xmlFiles[] = $file;
    }
}

echo json_encode($xmlFiles);
?>