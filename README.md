                                                                  🎗️ Breast Cancer Prediction System

A machine learning-based web application that predicts whether a breast tumor is benign or malignant using a Logistic Regression model trained on medical diagnostic features.

📌 Overview

This project helps in early detection of breast cancer by analyzing cell nuclei characteristics. It includes:

📊 Machine Learning model (Logistic Regression)
🌐 Interactive web app using FastAPI
💻 Command-line tools for training and prediction
📂 Dataset

The dataset (breast_cancer.csv) contains features extracted from digitized images of breast mass cell nuclei.

🔬 Features
Clump Thickness
Uniformity of Cell Size
Uniformity of Cell Shape
Marginal Adhesion
Single Epithelial Cell Size
Bare Nuclei
Bland Chromatin
Normal Nucleoli
Mitoses
⚙️ Installation
Clone the repository

git clone https://github.com/your-username/breast-cancer-predictor.git

cd breast-cancer-predictor

Install dependencies

pip install -r requirements.txt

🚀 Usage
🌐 Run Web Application (Recommended)

python app.py

Then open your browser and go to:
http://localhost:8000

🛠️ Command Line Usage
📈 Train the Model

python train_model.py

Trains the Logistic Regression model
Saves the trained model as model.pkl
🔍 Make Predictions

python predict.py

Loads the saved model
Accepts input from terminal
Outputs prediction (Benign / Malignant)
📊 Model Performance
Accuracy: ~94%
Evaluation Method: 10-Fold Cross Validation
🧠 Tech Stack
Python
Scikit-learn
Pandas
NumPy
FastAPI
HTML, CSS, JavaScript
📁 Project Structure

breast-cancer-predictor/
│
├── app.py
├── train_model.py
├── predict.py
├── model.pkl
├── breast_cancer.csv
├── requirements.txt
└── README.md

📌 Future Improvements
Add advanced models (Random Forest, XGBoost)
Deploy to cloud platforms
Add user authentication
Improve UI with visual analytics
🤝 Contributing

Contributions are welcome! Fork the repo and submit a pull request.
