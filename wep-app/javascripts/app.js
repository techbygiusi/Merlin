import { generateDefaultXmlContent } from './xml_generator.js';

document.addEventListener("DOMContentLoaded", () => {
    const ipGrid = document.getElementById("ip-grid");
    const ipModal = document.getElementById("ip-container");
    const ipNameInput = document.getElementById("ip-name");
    const ipStatusInput = document.getElementById("ip-status");
    const ipDescriptionInput = document.getElementById("ip-description");
    const ipForm = document.getElementById("ip-form");
    const ipAddress = document.getElementById("ip-address");
    const searchBar = document.getElementById("search-bar");
    const xmlFileSelect = document.getElementById("xml-file-select");
    const ipLinkInput = document.getElementById("ip-link");

    const filters = {
        free: document.getElementById("filter-free"),
        reserved: document.getElementById("filter-reserved"),
        blocked: document.getElementById("filter-blocked"),
    };

    const ipStatus = [];
    const ipDetails = [];

    function loadXmlFile(fileName) {
        fetch(`../data/${fileName}?timestamp=${new Date().getTime()}`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const ips = xmlDoc.getElementsByTagName("ip");

                const cidr = getCidrFromFileName(fileName);
                const ipCount = 2 ** (32 - cidr);
                ipStatus.length = ipCount - 2;
                ipDetails.length = ipCount - 2;

                ipStatus.fill("free");
                ipDetails.fill({ name: "", description: "", link: "" });

                if (ips.length === 0) {
                    const defaultXmlContent = generateDefaultXmlContent();
                    saveXmlFile(fileName, defaultXmlContent);
                    return;
                }

                for (let i = 0; i < ips.length; i++) {
                    const address = ips[i].getElementsByTagName("address")[0].textContent;
                    const status = ips[i].getElementsByTagName("status")[0].textContent;
                    const name = ips[i].getElementsByTagName("name")[0].textContent;
                    const description = ips[i].getElementsByTagName("description")[0].textContent;
                    const link = ips[i].getElementsByTagName("link")[0]?.textContent || "";

                    const lastOctet = parseInt(address.split(".").pop(), 10);

                    if (lastOctet >= 1 && lastOctet <= (ipCount - 2)) {
                        ipStatus[lastOctet - 1] = status;
                        ipDetails[lastOctet - 1] = { name, description, link };
                    }
                }
                generateIpTiles();
            })
            .catch(error => console.error("Error loading IP data:", error));
    }

    function getCidrFromFileName(fileName) {
        const subnetPart = fileName.split("_")[1];
        return parseInt(subnetPart.split(".")[0], 10);
    }

    function saveXmlFile(fileName, xmlContent) {
        fetch(`../phpscripts/save_ip.php?file=${fileName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml"
            },
            body: xmlContent
        })
        .then(response => {
            if (response.ok) {
                loadXmlFile(fileName);
            } else {
                console.error("Error saving default IP data:", response.statusText);
            }
        })
        .catch(error => console.error("Error saving default IP data:", error));
    }

    function generateIpTiles(filteredData = null) {
        ipGrid.innerHTML = "";
    
        const data = filteredData || ipDetails.map((details, index) => ({
            index: index + 1,
            name: details.name,
            description: details.description,
            status: ipStatus[index]
        }));
    
        data.forEach(ip => {
            if (!filters[ip.status.toLowerCase()].checked) return;
    
            const tile = document.createElement("div");
            tile.classList.add("ip-tile");
            tile.style.backgroundColor = `var(--color-${ip.status})`;
            tile.innerText = ip.index;
            tile.addEventListener("click", () => {
                openModal(ip.index);
            });
            ipGrid.appendChild(tile);
        });
    
        updateDiagram();
    }    

    function generateXmlContent() {
        const lastOpenedFile = localStorage.getItem('lastOpenedFile');
        console.log('Last Opened File:', lastOpenedFile);
    
        const subnet = lastOpenedFile ? lastOpenedFile.split("_")[0] : "0.0.0.0";
        const subnetMask = lastOpenedFile ? parseInt(lastOpenedFile.split("_")[1].split(".")[0], 10) : 24;
        const baseIpParts = subnet.split(".");
    
        const totalIps = Math.pow(2, 32 - subnetMask);
        const usableIps = totalIps > 2 ? totalIps - 2 : totalIps;
    
        let xml = `<?xml version="1.0" encoding="UTF-8"?><subnet>`;
    
        for (let i = 1; i <= usableIps; i++) {
            const fullIpAddress = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i}`;
            console.log('Written IP:', fullIpAddress);
    
            const status = ipStatus[i - 1] || "free";
            const name = ipDetails[i - 1]?.name || "";
            const description = ipDetails[i - 1]?.description || "";
            const link = ipDetails[i - 1]?.link || "";
    
            xml += `<ip><address>${fullIpAddress}</address><name>${name}</name><description>${description}</description><status>${status}</status><link>${link}</link></ip>`;
        }
    
        xml += `</subnet>`;
        return xml;
    }      

    function updateDiagram() {
        const total = ipStatus.length;
        const freeCount = ipStatus.filter(status => status === "free").length;
        const reservedCount = ipStatus.filter(status => status === "reserved").length;
        const blockedCount = ipStatus.filter(status => status === "blocked").length;

        const freePercentage = (freeCount / total) * 100;
        const reservedPercentage = (reservedCount / total) * 100;
        const blockedPercentage = (blockedCount / total) * 100;

        document.getElementById("free-percentage").textContent = `${freePercentage.toFixed(1)}%`;
        document.getElementById("reserved-percentage").textContent = `${reservedPercentage.toFixed(1)}%`;
        document.getElementById("blocked-percentage").textContent = `${blockedPercentage.toFixed(1)}%`;
    }

    xmlFileSelect.addEventListener('change', (e) => {
        const selectedFile = e.target.value;
        setCookie("lastOpenedFile", selectedFile, 30);
        localStorage.setItem("lastOpenedFile", selectedFile)
        loadXmlFile(selectedFile);
    });
    
    function populateXmlFileSelect() {
        fetch('../phpscripts/list_files.php')
            .then(response => response.json())
            .then(files => {
                files.forEach(fileName => {
                    const option = document.createElement('option');
                    option.value = fileName;
                    option.textContent = fileName;
                    xmlFileSelect.appendChild(option);
                });
    
                const lastOpenedFile = getCookie("lastOpenedFile");
    
                if (lastOpenedFile && files.includes(lastOpenedFile)) {
                    xmlFileSelect.value = lastOpenedFile;
                    loadXmlFile(lastOpenedFile);
                } else if (files.length > 0) {
                    xmlFileSelect.value = files[0];
                    loadXmlFile(files[0]);
                }
            })
            .catch(error => console.error("Error loading XML files:", error));
    }    

    Object.values(filters).forEach(filter => {
        filter.addEventListener("change", () => generateIpTiles());
    });

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const selectedFile = localStorage.getItem('lastOpenedFile');
    
        if (query.length === 0) {
            generateIpTiles();
            return;
        }
    
        if (!selectedFile) {
            console.error("No file selected or available in local storage.");
            return;
        }
    
        fetch(`../phpscripts/search_ip.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                query: query,
                file: selectedFile
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(filteredIps => {
            console.log(filteredIps);
            generateIpTiles(filteredIps);
        })
        .catch(error => console.error("Error searching IPs:", error));
    });       
    
    function openModal(index) {
        const subnet = xmlFileSelect.value.split("_")[0];
        const baseIp = subnet.split('.');
        const fullIpAddress = `${baseIp[0]}.${baseIp[1]}.${baseIp[2]}.${index}`;
        ipAddress.textContent = `Editing IP: ${fullIpAddress}`;
    
        const details = ipDetails[index - 1];
        ipNameInput.value = details.name;
        ipStatusInput.value = ipStatus[index - 1];
        ipDescriptionInput.value = details.description;
        ipLinkInput.value = details.link;

        const openLinkButton = document.getElementById("open-link-button");
        if (details.link) {
            openLinkButton.style.display = "inline";
            openLinkButton.onclick = () => window.open(details.link, "_blank");
        } else {
            openLinkButton.style.display = "none";
        }
    
        ipModal.style.display = "block";
        
        ipForm.onsubmit = (e) => {
            e.preventDefault();
            const status = ipStatusInput.value;

            if (status === "free") {
                ipNameInput.value = "";
                ipDescriptionInput.value = "";
                ipLinkInput.value = "";
            }

            ipStatus[index - 1] = status;
            ipDetails[index - 1] = {
                name: ipNameInput.value,
                description: ipDescriptionInput.value,
                link: ipLinkInput.value
            };
            saveIpData();
            generateIpTiles();
            ipModal.style.display = "none";
        };
    }     

    function saveIpData() {
        const xmlContent = generateXmlContent();
    
        if (xmlContent === "") {
            console.error("Failed to generate XML content.");
            return;
        }
    
        const fileName = xmlFileSelect.value;
    
        fetch(`../phpscripts/save_ip.php?file=${fileName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml"
            },
            body: xmlContent
        })
        .then(response => {
            if (response.ok) {
            } else {
                console.error("Error saving IP data:", response.statusText);
            }
        })
        .catch(error => console.error("Error saving IP data:", error));
    }    

    document.getElementById("close-ip-container-button").addEventListener("click", function() {
        document.getElementById("ip-container").style.display = "none";
    });
    
    populateXmlFileSelect();
});