# from flask import Flask, request, jsonify
# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import io
# import base64

# app = Flask(__name__)

# # Load your trained deepfake detection model
# model = tf.keras.models.load_model("your_model.h5")


# def preprocess_image(image_data):
#     image = Image.open(io.BytesIO(base64.b64decode(image_data.split(",")[1])))
#     image = image.resize((224, 224))  # Adjust as per your model input
#     image = np.array(image) / 255.0
#     image = np.expand_dims(image, axis=0)
#     return image


# @app.route("/analyze", methods=["POST"])
# def analyze():
#     data = request.json
#     image_data = data.get("image")

#     if not image_data:
#         return jsonify({"error": "No image provided"}), 400

#     image = preprocess_image(image_data)
#     prediction = model.predict(image)[0][0]

#     return jsonify({"fake": prediction > 0.5})  # Adjust threshold if needed


# if __name__ == "__main__":
#     app.run(debug=True)


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
models = {
    "ResNet": tf.keras.models.load_model(
        "models/resnet50_with_se_block_binary_classification.h5"
    ),
    "DenseNet": tf.keras.models.load_model(
        "models/densenet121_with_se_block_binary_classification.h5"
    ),
    # Add other models here as needed
}


class AnalyzeRequest(BaseModel):
    image: str
    model_name: str


def preprocess_image(image_data: str) -> np.ndarray:
    try:
        # Decode the base64 image string
        image_data = base64.b64decode(image_data.split(",")[1])
        image = Image.open(io.BytesIO(image_data))

        # Ensure the image is in RGB format (handle RGBA, grayscale, etc.)
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Resize the image to the model's expected input size
        image = image.resize((224, 224))  # Adjust as needed

        # Convert image to numpy array and normalize
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        return image_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    # Check if the model name exists in the available models
    if data.model_name not in models:
        raise HTTPException(
            status_code=400, detail=f"Model {data.model_name} not found"
        )

    model = models[data.model_name]

    # Preprocess the image data
    image = preprocess_image(data.image)

    try:
        # Predict the result using the selected model
        pred = model.predict(image)[0][0]  # Assuming binary classification with sigmoid

        # Determine label and confidence
        label = "Fake" if pred >= 0.7 else "Real"
        confidence = round(pred * 100, 2) if pred >= 0.5 else round((1 - pred) * 100, 2)

        return {"label": label, "confidence": confidence, "model": data.model_name}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error during prediction: {str(e)}"
        )
