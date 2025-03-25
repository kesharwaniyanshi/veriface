document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const analyzeBtn = document.getElementById("analyze-btn");
    const resultText = document.getElementById("result");

    // Prevent default behavior
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Highlight drop area
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = "blue";
        });
    });

    // Remove highlight when leaving
    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = "#ccc";
        });
    });

    // Handle file drop
    dropArea.addEventListener("drop", (e) => {
        let files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
        }
    });

    // Handle file selection
    dropArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            analyzeImage(fileInput.files[0]);
        }
    });

    analyzeBtn.addEventListener("click", () => {
        if (fileInput.files.length > 0) {
            analyzeImage(fileInput.files[0]);
        } else {
            alert("Please upload an image first.");
        }
    });
    document.getElementById("imageUpload").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.getElementById("previewImage");
                img.src = e.target.result;
                img.style.display = "block";  // Show image
            };
            reader.readAsDataURL(file);
        }
    });


    function analyzeImage(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: reader.result })
            })
                .then(response => response.json())
                .then(data => {
                    resultText.innerText = data.fake ? "90% Fake Image !!!" : "Real Image";
                    resultText.style.color = data.fake ? "red" : "green";
                })
                .catch(error => {
                    console.error("Error:", error);
                    resultText.innerText = "Error analyzing image.";
                });
        };
    }
});
