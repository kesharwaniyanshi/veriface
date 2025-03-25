from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load your trained deepfake detection model
model = tf.keras.models.load_model("your_model.h5")


def preprocess_image(image_data):
    image = Image.open(io.BytesIO(base64.b64decode(image_data.split(",")[1])))
    image = image.resize((224, 224))  # Adjust as per your model input
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No image provided"}), 400

    image = preprocess_image(image_data)
    prediction = model.predict(image)[0][0]

    return jsonify({"fake": prediction > 0.5})  # Adjust threshold if needed


if __name__ == "__main__":
    app.run(debug=True)
