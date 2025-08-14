import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score

# Load and preprocess data
df = pd.read_csv("./data/Food_and_Nutrition__.csv")
df.columns = df.columns.str.strip().str.replace(" ", "_")
if "Ages" in df.columns:
    df.rename(columns={"Ages": "Age"}, inplace=True)

# Encode diseases
mlb = MultiLabelBinarizer()
disease_df = pd.DataFrame(
    mlb.fit_transform(df['Disease'].str.split(',\s*')),
    columns=mlb.classes_
)

# Scale numerical features
scaler = StandardScaler()
numerical_cols = ['Age', 'Height', 'Weight']
numerical_df = pd.DataFrame(
    scaler.fit_transform(df[numerical_cols]),
    columns=numerical_cols
)

# Encode gender (consistent missing value handling)
gender_map = {'Male': 0, 'Female': 1}
gender_df = pd.DataFrame(
    df['Gender'].map(gender_map).fillna(0).astype(int),
    columns=['Gender']
)

# Create feature matrix
X = pd.concat([numerical_df, gender_df, disease_df], axis=1)

# Encode targets
target_encoders = {}
y_encoded = pd.DataFrame()
for col in ['Breakfast_Suggestion', 'Lunch_Suggestion', 
           'Dinner_Suggestion', 'Snack_Suggestion']:
    le = LabelEncoder()
    y_encoded[col] = le.fit_transform(df[col])
    target_encoders[col] = le

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Train model
model = MultiOutputClassifier(RandomForestClassifier(
    n_estimators=100, random_state=42))
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
for idx, col in enumerate(y_encoded.columns):
    acc = accuracy_score(y_test[col], y_pred[:, idx])
    print(f"Accuracy for {col}: {acc:.2f}")

# Save artifacts
joblib.dump(model, 'meal_recommender.joblib')
joblib.dump(mlb, 'mlb_encoder.joblib')
joblib.dump(scaler, 'scaler.joblib')
joblib.dump(X.columns.tolist(), 'feature_columns.joblib')
joblib.dump(target_encoders, 'target_encoders.joblib')