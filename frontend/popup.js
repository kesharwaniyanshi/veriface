document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("uploadBox"); // Updated to match your popup.html
    const fileInput = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const resultText = document.getElementById("result");

    // Prevent default behavior for drag-and-drop events
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Highlight drop area when a file is dragged over
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = "blue";
        });
    });

    // Remove highlight when leaving or dropping
    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = "#ccc";
        });
    });

    // Handle file drop
    dropArea.addEventListener("drop", (e) => {
        let files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files; // Assign dropped file to input
            handleFile(files[0]);
        }
    });

    // Open file picker when clicking the upload box
    dropArea.addEventListener("click", () => fileInput.click());

    // Handle file selection from input
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    

    // Function to handle image preview
    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block"; // Show the preview
        };
        reader.readAsDataURL(file);
    }

    // Analyze Button Click
    analyzeBtn.addEventListener("click", () => {
        if (fileInput.files.length > 0) {
            analyzeImage(fileInput.files[0]);
        } else {
            alert("Please upload an image first.");
        }
    });

    // Function to send image for analysis
    function analyzeImage(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            const selectedModel = document.getElementById("modelSelect").value;

            fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: reader.result,
                    model_name: selectedModel
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        resultText.innerText = "Error: " + data.error;
                        resultText.style.color = "gray";
                        return;
                    }

                    resultText.innerText = `${data.confidence}% ${data.label} Image (${data.model})`;
                    resultText.style.color = data.label === "Fake" ? "red" : "green";
                })
                .catch(error => {
                    console.error("Error:", error);
                    resultText.innerText = "Error analyzing image.";
                });
        };
    }
});
