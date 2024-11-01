<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="stylesheets/colors.css">
    <link rel="stylesheet" href="stylesheets/style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <title>Merlin</title>
</head>
<body>
    <header>
        <img src="logo.png" alt="Logo" id="logo">
        <h1>Merlin</h1>
    </header>
    
    <div class="container">
        <div>
            <select id="xml-file-select"></select>
            <button type="button" id="add-subnet-button">Add Subnet</button>
            <button type="button" id="open-delete-file-button">Delete Subnet</button>
        </div>
        <input type="text" id="search-bar" placeholder="Search by number, name, or description in the same subnet.">
    </div>
    
    <div id="status-filters">
        <label>
            <input type="checkbox" id="filter-free" value="free" checked>
            Free
        </label>
        <label>
            <input type="checkbox" id="filter-reserved" value="reserved" checked>
            Reserved
        </label>
        <label>
            <input type="checkbox" id="filter-blocked" value="blocked" checked>
            Blocked
        </label>
    </div>
    
    <div id="ip-grid"></div>

    <div id="diagram-container">
        <div id="diagram">
            <div id="free-section">
                <span id="free-percentage">0%</span>
                <span>Free</span>
            </div>
            <div id="reserved-section">
                <span id="reserved-percentage">0%</span>
                <span>Reserved</span>
            </div>
            <div id="blocked-section">
                <span id="blocked-percentage">0%</span>
                <span>Blocked</span>
            </div>
        </div>
    </div>

    <div class="modal" id="ip-container">
        <div class="modal-content">
            <h2 id="ip-address">IP Address</h2>
            <form id="ip-form">
                <input type="text" id="ip-name" placeholder="Name" required>
                <input type="text" id="ip-description" placeholder="Description (optional)">
                <input type="url" id="ip-link" placeholder="Link (optional)">
                <select id="ip-status" required>
                    <option value="free">Free</option>
                    <option value="reserved">Reserved</option>
                    <option value="blocked">Blocked</option>
                </select>
                <button type="button" id="open-link-button" style="display: none;">Go to Link</button>
                <button type="submit" id="submit">Save IP Address</button>
                <button type="button" id="close-ip-container-button">Close</button>
            </form>
        </div>
    </div>

    <div class="modal" id="add-subnet-container">
        <div class="modal-content">
            <h2 id="subnet">Add New Subnet</h2>
            <form id="subnet-form">
                <input type="text" id="new-subnet-ip" placeholder="Base IP (e.g., 10.10.10.0)" required>
                <input type="text" id="new-subnet-mask" placeholder="Subnet Mask (e.g., 24)" required>
                <button type="submit" id="save-subnet-button">Save Subnet</button>
                <button type="button" id="add-close-subnet-button">Close</button>
            </form>
        </div>
    </div>

    <div class="modal" id="delete-file-container">
        <div class="modal-content">
            <h2 id="delete-subnet">Delete Subnet</h2>
            <form id="delete-file-form">
                <select id="file-select" required>
                    <option value="">Select a Subnet to delete</option>
                </select>
                <button type="submit" id="delete-file-button">Delete Subnet</button>
                <button type="button" id="close-delete-file-button">Close</button>
            </form>
        </div>
    </div>

    <div class="add-subnet-overlay"></div>

    <button id="download-xml" class="download-button">
        Download XML
    </button>

    <script type="module" src="javascripts/app.js"></script>
    <script type="module" src="javascripts/add_subnet.js"></script>
    <script src="javascripts/delete_subnet.js"></script>
    <script src="javascripts/download_xml.js"></script>
    <script src="javascripts/cookiehandler.js"></script>
</body>
</html>