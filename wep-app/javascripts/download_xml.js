document.getElementById('download-xml').addEventListener('click', () => {
    const lastOpenedFile = localStorage.getItem("lastOpenedFile");
    if (lastOpenedFile) {
        const downloadLink = document.createElement('a');
        downloadLink.href = `../data/${encodeURIComponent(lastOpenedFile)}`;
        downloadLink.download = lastOpenedFile;
        downloadLink.click();
    } else {
        alert('No file selected for download.');
    }
});