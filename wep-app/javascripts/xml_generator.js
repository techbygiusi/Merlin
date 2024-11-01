function generateDefaultXmlContent() {
    const baseIp = document.getElementById('new-subnet-ip').value;
    const subnetMask = parseInt(document.getElementById('new-subnet-mask').value, 10);
    const baseIpParts = baseIp.split('.').map(Number);
    const ipCount = 2 ** (32 - subnetMask);

    const ipEntries = [];

    for (let i = 1; i < ipCount - 1; i++) {
        const lastOctet = (i) % 256;
        const thirdOctet = Math.floor(i / 256) % 256;
        const secondOctet = Math.floor(i / (256 * 256)) % 256;
        const firstOctet = Math.floor(i / (256 * 256 * 256));

        const address = `${baseIpParts[0] + firstOctet}.${baseIpParts[1] + secondOctet}.${baseIpParts[2] + thirdOctet}.${lastOctet}`;
        const isValidAddress = (baseIpParts[0] + firstOctet <= 255) &&
                               (baseIpParts[1] + secondOctet <= 255) &&
                               (baseIpParts[2] + thirdOctet <= 255);

        if (isValidAddress) {
            ipEntries.push(`<ip><address>${address}</address><name></name><description></description><status>free</status><link></link></ip>`);
        }
    }

    return `<?xml version="1.0" encoding="UTF-8"?><subnet>${ipEntries.join('')}</subnet>`;
}

export { generateDefaultXmlContent };