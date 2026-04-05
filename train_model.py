import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score

def train():
    print("Loading dataset...")
    dataset = pd.read_csv('breast_cancer.csv')
    X = dataset.iloc[:, 1:-1].values
    y = dataset.iloc[:, -1].values

    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

    print("Training Logistic Regression model...")
    classifier = LogisticRegression(random_state=0)
    classifier.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = classifier.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Confusion Matrix:\n{cm}")
    print(f"Accuracy: {accuracy * 100:.2f}%")

    print("Saving model to model.pkl...")
    joblib.dump(classifier, 'model.pkl')
    print("Model saved successfully!")

if __name__ == "__main__":
    train()
