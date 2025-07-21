document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('upload-btn');
    const previewSection = document.getElementById('preview-section');
    const imagePreview = document.getElementById('image-preview');
    const colorPalette = document.getElementById('color-palette');
    const colorDetails = document.getElementById('color-details');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle file selection via button
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFiles({ target: { files } });
        }
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (!files.length) return;

        const file = files[0];
        if (!file.type.match('image.*')) {
            showError('لطفاً یک فایل تصویری انتخاب کنید');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError('حجم فایل نباید بیشتر از ۱۰ مگابایت باشد');
            return;
        }

        // Reset previous results
        resetUI();

        // Show preview
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            previewSection.classList.remove('hidden');

            // Process the image
            processImage(file);
        };
        reader.readAsDataURL(file);
    }

    function processImage(file) {
        loading.classList.remove('hidden');
        previewSection.classList.add('hidden');
        errorMessage.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8000/extract-colors/', {
            method: 'POST',
            body: formData
        })

            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.detail) });
                }
                return response.json();
            })
            .then(data => {
                loading.classList.add('hidden');
                previewSection.classList.remove('hidden');
                displayColors(data.colors);
            })
            .catch(error => {
                loading.classList.add('hidden');
                showError(error.message || 'خطا در پردازش تصویر');
            });
    }

    function displayColors(colors) {
        colorPalette.innerHTML = '';
        colorDetails.innerHTML = '';

        colors.forEach(color => {
            const hex = color.hex;
            const rgb = color.rgb;

            // Create color box for palette
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box shadow-md';
            colorBox.style.backgroundColor = hex;
            colorBox.title = hex;
            colorBox.addEventListener('click', () => copyToClipboard(hex));
            colorPalette.appendChild(colorBox);

            // Create color detail row
            const detailRow = document.createElement('div');
            detailRow.className = 'color-detail';

            const colorPreview = document.createElement('div');
            colorPreview.className = 'w-8 h-8 rounded-md mr-3 shadow';
            colorPreview.style.backgroundColor = hex;

            const colorInfo = document.createElement('div');
            colorInfo.className = 'flex-1 mr-3';

            const hexText = document.createElement('p');
            hexText.className = 'text-sm font-medium text-gray-800';
            hexText.textContent = `HEX: ${hex}`;

            const rgbText = document.createElement('p');
            rgbText.className = 'text-xs text-gray-500';
            rgbText.textContent = `RGB: ${rgb.join(', ')}`;

            colorInfo.appendChild(hexText);
            colorInfo.appendChild(rgbText);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200 transition-colors';
            copyBtn.textContent = 'کپی';
            copyBtn.addEventListener('click', () => copyToClipboard(hex));

            detailRow.appendChild(colorPreview);
            detailRow.appendChild(colorInfo);
            detailRow.appendChild(copyBtn);

            colorDetails.appendChild(detailRow);
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show a small notification
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
            notification.textContent = 'کپی شد: ' + text;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function resetUI() {
        previewSection.classList.add('hidden');
        loading.classList.add('hidden');
        errorMessage.classList.add('hidden');
        colorPalette.innerHTML = '';
        colorDetails.innerHTML = '';
    }
});