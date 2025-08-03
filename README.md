# 📰 CulTruth: Multimodal Fake News Detection with Cultural Content

CulTruth is a final year engineering project that leverages multimodal deep learning to detect fake news in culturally sensitive content using **text and image analysis**. The system is designed to tackle misinformation that targets traditions, religion, politics, and cultural practices, particularly in diverse societies like India.

---

## 🚀 Features

- 🔤 **Text-Based Fake News Detection** using BERT/XLM-R for multilingual support
- 🖼️ **Image Analysis (memes/posters)** using CNNs or Vision Transformers
- 🔗 **Multimodal Fusion Layer** combining text and image predictions
- 🌍 **Focus on cultural misinformation** across languages and regional content
- 🌐 **Web-based UI** for real-time content analysis (optional mobile support)
- 📊 **Performance evaluation** using precision, recall, F1-score
- 📚 **Dataset creation tool** for collecting news from fact-checkers and social media

---

## 📁 Project Structure
cultruth/
├── data/ # Dataset files (text + images)
├── models/ # Trained model files (text, image, fusion)
├── src/
│ ├── text_model.py # NLP model for fake news detection
│ ├── image_model.py # CNN/ViT model for image-based detection
│ ├── fusion_model.py # Ensemble or multimodal integration logic
│ ├── preprocessing.py # Data cleaning, language detection, etc.
│ └── utils.py
├── app/
│ ├── main.py # Flask/FastAPI backend
│ └── templates/ # Web UI (HTML, CSS, JS)
├── requirements.txt
└── README.md

---

## 🧠 Tech Stack

- **Language**: Python
- **ML Frameworks**: PyTorch / TensorFlow
- **NLP**: BERT, XLM-RoBERTa (via HuggingFace Transformers)
- **Vision**: ResNet, EfficientNet, or ViT (Vision Transformers)
- **Web**: Flask / FastAPI + HTML/CSS (or Android for mobile version)
- **Dataset Sources**: Factly, BOOM Live, AltNews, Twitter, Tattle

---

## 🔧 Setup Instructions

1. **Clone the repository**
    git clone https://github.com/yourusername/cultruth.git
    cd cultruth
2.**Install dependencies**
    pip install -r requirements.txt
3.Run the app
    python app/main.py
4.Train models (optional – if not using pre-trained ones)
    python src/text_model.py
    python src/image_model.py
    python src/fusion_model.py
📊 Evaluation Metrics
  *Accuracy
  *Precision / Recall
  *F1 Score
  *Confusion Matrix
  *Cultural class bias analysis (optional)
🧪 Sample Use Case
A user uploads a news meme written in Hinglish (Hindi+English) attacking a religious custom.
   🧠 NLP Model detects toxic sentiment and potential misinformation
   🖼️ Image Model recognizes template/meme structure used for trolling
   ✅ The Fusion model flags it as likely fake news with explanation.
📘 Documentation
  *Project Proposal
  *Literature Survey
  *Dataset Summary
  *Model Architecture Diagrams
  *Screenshots of UI and Results
  *Research Paper
📜 License
  This project is for educational and academic purposes. Licensing details will be updated if deployed publicly.
⭐ Acknowledgements
    *HuggingFace Transformers
    *FakeNewsNet Dataset
    *Tattle Civic Tech
    *Alt News India
📬 Contact
If you have questions, feel free to raise an issue or contact via LinkedIn: https://www.linkedin.com/in/praveen14657/
