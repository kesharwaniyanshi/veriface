console.log("Deepfake Detector Extension Loaded");

// Function to convert an image file to Base64
function getBase64(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.error("Error converting image:", error);
}

// Detect image paste event
document.addEventListener("paste", (event) => {
    let items = event.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith("image/")) {
            let file = item.getAsFile();
            getBase64(file, (base64Image) => sendImageForAnalysis(base64Image));
        }
    }
});

// Function to send the image for deepfake analysis
function sendImageForAnalysis(imageData) {
    chrome.runtime.sendMessage({ action: "analyze_image", imageData }, (response) => {
        if (response && response.success) {
            showResult(response.result);
        } else {
            console.error("Error analyzing image:", response.error);
        }
    });
}

// Function to display results on the webpage
function showResult(result) {
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "20px";
    overlay.style.right = "20px";
    overlay.style.backgroundColor = "white";
    overlay.style.border = "2px solid black";
    overlay.style.padding = "10px";
    overlay.style.zIndex = "10000";
    overlay.style.fontSize = "16px";
    overlay.innerHTML = `<b>Fake Probability: ${result.fake_percentage}%</b>`;

    document.body.appendChild(overlay);
}
