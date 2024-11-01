import { generateDefaultXmlContent } from './xml_generator.js';

document.getElementById('save-subnet-button').addEventListener('click', saveNewSubnet);
document.getElementById('add-close-subnet-button').addEventListener('click', closeModal);
document.getElementById('add-subnet-button').addEventListener('click', openModal);

function openModal() {
    document.querySelector('.add-subnet-overlay').style.display = 'block';
    document.getElementById('add-subnet-container').style.display = 'block';
}

function closeModal() {
    document.querySelector('.add-subnet-overlay').style.display = 'none';
    document.getElementById('add-subnet-container').style.display = 'none';
}

function saveNewSubnet(event) {
    event.preventDefault();

    const baseIp = document.getElementById('new-subnet-ip').value;
    const subnetMask = parseInt(document.getElementById('new-subnet-mask').value, 10);

    if (!baseIp || !subnetMask) {
        alert('Please enter both Base IP and Subnet Mask.');
        return;
    }

    if (subnetMask < 24 || subnetMask > 32) {
        alert('Subnet mask must be between 24 and 32.');
        return;
    }

    const fileName = `${baseIp}_${subnetMask}.xml`;
    const xmlContent = generateDefaultXmlContent(baseIp);

    fetch(`../phpscripts/save_ip.php?file=${fileName}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml"
        },
        body: xmlContent
    })
    .then(response => {
        if (response.ok) {
            localStorage.setItem('lastOpenedFile', fileName);
            closeModal();
            location.reload();
        } else {
            console.error("Error saving new subnet:", response.statusText);
        }
    })    
    .catch(error => console.error("Error saving new subnet:", error));
}