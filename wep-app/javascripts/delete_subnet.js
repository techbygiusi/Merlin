document.addEventListener('DOMContentLoaded', () => {
    fetchFiles();

    document.getElementById('delete-file-button').addEventListener('click', function(event) {
        event.preventDefault();
        const fileSelect = document.getElementById('file-select');
        const selectedFile = fileSelect.value;

        if (selectedFile) {
            fetch(`../phpscripts/delete_subnet.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ filename: selectedFile })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem("lastOpenedFile");
                    closeDeleteModal();
                    location.reload();
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please select a file to delete.');
        }
    });

    document.getElementById('close-delete-file-button').addEventListener('click', closeDeleteModal);
    document.getElementById('open-delete-file-button').addEventListener('click', openDeleteFileModal);
});

function fetchFiles() {
    fetch('../phpscripts/list_files.php')
        .then(response => response.json())
        .then(files => {
            const fileSelect = document.getElementById('file-select');
            fileSelect.innerHTML = '';

            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                fileSelect.appendChild(option);
            });

            if (files.length > 0) {
                loadScript(files[0]);
                fileSelect.value = files[0];
            }
        })
        .catch(error => {
            console.error('Error fetching files:', error);
            alert('Failed to load files.');
        });
}

function loadScript(filename) {
    localStorage.setItem("lastOpenedFile", filename);
}

function closeDeleteModal() {
    document.getElementById('delete-file-container').style.display = 'none';
}

function openDeleteFileModal() {
    document.getElementById('delete-file-container').style.display = 'block';
}