import joblib
import numpy as np

def predict(input_data):
    """
    Predict whether the cancer is benign (2) or malignant (4).
    input_data: list or array of the 9 features.
    """
    try:
        model = joblib.load('model.pkl')
        prediction = model.predict(np.array([input_data]))
        return "Malignant" if prediction[0] == 4 else "Benign"
    except FileNotFoundError:
        return "Model file not found. Please run train_model.py first."

if __name__ == "__main__":
    # Example data point from the dataset
    # Features: Clump Thickness, Uniformity of Cell Size, Uniformity of Cell Shape, 
    # Marginal Adhesion, Single Epithelial Cell Size, Bare Nuclei, Bland Chromatin, 
    # Normal Nucleoli, Mitoses
    sample_data = [5, 1, 1, 1, 2, 1, 3, 1, 1] 
    result = predict(sample_data)
    print(f"Prediction for sample data {sample_data}: {result}")
