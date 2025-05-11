# VeriFace – Deepfake Detection Chrome Extension 🔍🧠

**VeriFace** is a Chrome extension that allows users to verify the authenticity of images directly from their browser using advanced deepfake detection models. With just a few clicks, users can upload or paste an image, choose a model, and receive a prediction along with a confidence score.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e49edbd7-96ab-4380-89da-bc541414e692" alt="VeriFace Banner" width="600"/>
</p>

---

## 🌟 Features

- 🖼️ Upload or paste an image directly into the extension
- 🧠 Choose from multiple detection models (e.g., ResNet50 + EfficientNetB0 with SE blocks)
- ⚡ Fast and reliable predictions using a FastAPI backend
- 📊 Displays confidence scores for predictions
- 🔐 Lightweight, secure, and easy to use

---

## 📦 Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in your browser.
3. Enable **Developer mode** (toggle at top-right).
4. Click on **Load unpacked** and select the extension folder.

---

## 🛠️ Usage

1. Click the VeriFace icon in your Chrome toolbar.
2. Upload an image or paste an image URL.
3. Select a model from the dropdown.
4. Click **Analyze**.
5. View the deepfake detection result and confidence score.

<p align="center">
  <img src="https://github.com/user-attachments/assets/1bcb3147-2373-45f7-a0cc-edbd3b1a4442" alt="Extension UI" width="500"/>
</p>

---

## 🧠 Models & Backend

VeriFace's backend uses **FastAPI** and serves predictions using the following pre-trained models:

| Model Name   | File Used                                              | Architecture Details                                 |
|--------------|--------------------------------------------------------|------------------------------------------------------|
| DenseNet121  | `densenet121_with_se_block_binary_classification (1).h5` | DenseNet121 with **Squeeze-and-Excitation (SE) Block** |
| Res+Eff      | `deepfake_model.keras`                                 | Hybrid model combining **ResNet50 + EfficientNetB0** |
| Xception     | `xception_deepfake_image_4o.h5`                         | Xception-based model trained for binary classification |

These models were trained on the **FaceForensics++ C23 dataset** and output a classification (real/fake) with a confidence score.

---

## 📷 Screenshots

<p float="left" align="center">
  <img src="https://github.com/user-attachments/assets/fc4365c9-420d-4031-a1be-48e10d50bb6a" alt="Xception Model Output" width="300"/>
  <img src="https://github.com/user-attachments/assets/7ce47fc0-b0ea-4ccb-9657-2181716d94f3" alt="ResNet+EfficientNet Output" width="300"/>
  <img src="https://github.com/user-attachments/assets/c6c1cafe-dc0b-4418-a739-bd87ce64f987" alt="DenseNet Output" width="300"/>
</p>

---

## 🧑‍💻 Developer

- **Yanshi Kesharwani** – Frontend, Extension UI, Backend Integration  
  [GitHub](https://github.com/kesharwaniyanshi)

