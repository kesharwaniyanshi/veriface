chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyze_image") {
        analyzeImage(message.imageData, sendResponse);
        return true;  // Indicates response will be sent asynchronously
    }
});

async function analyzeImage(imageData, sendResponse) {
    let formData = new FormData();
    formData.append("image", imageData);

    try {
        let response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            body: formData
        });

        let result = await response.json();
        sendResponse({ success: true, result });
    } catch (error) {
        console.error("Error analyzing image:", error);
        sendResponse({ success: false, error: error.message });
    }
}
