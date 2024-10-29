document.getElementById('combine-btn').addEventListener('click', combineImages);

async function combineImages() {
    const files = document.getElementById('file-input').files;
    if (files.length === 0) {
        alert('Please select JPG files.');
        return;
    }

    const orientation = document.getElementById('orientation').value;
    const images = await loadImages(files);

    const canvas = document.getElementById('output-canvas');
    const ctx = canvas.getContext('2d');

    const { canvasWidth, canvasHeight } = calculateCanvasSize(images, orientation);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let offset = 0;
    for (let img of images) {
        if (orientation === 'vertical') {
            ctx.drawImage(img, 0, offset, img.width, img.height);
            offset += img.height;
        } else {
            ctx.drawImage(img, offset, 0, img.width, img.height);
            offset += img.width;
        }
    }
}

function loadImages(files) {
    const promises = [];
    for (let file of files) {
        promises.push(new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.src = event.target.result;
            };
            reader.onerror = function () {
                reject(new Error('Error loading image'));
            };
            reader.readAsDataURL(file);
        }));
    }
    return Promise.all(promises);
}

function calculateCanvasSize(images, orientation) {
    let canvasWidth = 0;
    let canvasHeight = 0;

    if (orientation === 'vertical') {
        canvasWidth = Math.max(...images.map(img => img.width));
        canvasHeight = images.reduce((total, img) => total + img.height, 0);
    } else {
        canvasWidth = images.reduce((total, img) => total + img.width, 0);
        canvasHeight = Math.max(...images.map(img => img.height));
    }

    return { canvasWidth, canvasHeight };
}
