<?php
header('Content-Type: application/json');

$query = isset($_POST['query']) ? strtolower(trim($_POST['query'])) : '';
$dataDir = '../data/';
$filteredIps = [];
$statusKeywords = ["free", "reserved", "blocked"];

if (!isset($_POST['file'])) {
    echo json_encode(['error' => 'No file selected.']);
    exit;
}

$selectedFile = basename($_POST['file']);
$filePath = $dataDir . $selectedFile;

if (!file_exists($filePath) || pathinfo($filePath, PATHINFO_EXTENSION) !== 'xml') {
    echo json_encode(['error' => 'Invalid file specified.']);
    exit;
}

$xml = simplexml_load_file($filePath);
if ($xml === false) {
    echo json_encode(['error' => 'Failed to load XML.']);
    exit;
}

foreach ($xml->ip as $ip) {
    $name = strtolower((string)$ip->name);
    $description = strtolower((string)$ip->description);
    $status = strtolower((string)$ip->status);
    $address = (string)$ip->address;
    $lastOctet = (int)explode('.', $address)[3];

    if (
        strpos($name, $query) !== false ||
        strpos($description, $query) !== false ||
        (in_array($query, $statusKeywords) && $status === $query) ||
        ($query === strval($lastOctet))
    ) {
        $filteredIps[] = [
            'index' => $lastOctet,
            'name' => (string)$ip->name,
            'description' => (string)$ip->description,
            'status' => (string)$ip->status,
        ];
    }
}

echo json_encode($filteredIps);
?>