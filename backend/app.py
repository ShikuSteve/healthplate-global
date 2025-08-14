from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import logging


app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load artifacts once at startup
model = joblib.load('meal_recommender.joblib')
mlb = joblib.load('mlb_encoder.joblib')
scaler = joblib.load('scaler.joblib')
feature_cols = joblib.load('feature_columns.joblib')
target_encoders = joblib.load('target_encoders.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    print("Received /predict request")  # Simple stdout print
    app.logger.info("Received /predict request")

    try:

        data = request.get_json()
        print("Received data:", data)
        app.logger.info(f"Received data: {data}")
        if not data:
            return jsonify({"error": "No input provided"}), 400
            
        # Validate required fields
        required = ['age', 'height', 'weight']
        if any(field not in data for field in required):
            return jsonify({"error": "Missing required field"}), 400

        try:
            age = float(data['age'])
            height = float(data['height'])
            weight = float(data['weight'])
            if any(v <= 0 for v in [age, height, weight]):
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid numerical values"}), 400

        # Process inputs
        gender = data.get('gender', 'male').lower()
        diseases = data.get('diseases', [])
        
        # Feature engineering
        try:
            numeric_df = pd.DataFrame([[age, height, weight]], columns=scaler.feature_names_in_)
            numeric_input = scaler.transform(numeric_df)
            # numeric_input = scaler.transform([[age, height, weight]])
            gender_enc = 0 if gender == 'male' else 1
            valid_diseases = [d for d in diseases if d in mlb.classes_]
            disease_enc = mlb.transform([valid_diseases])[0]
            # disease_enc = mlb.transform([diseases])[0]
        except Exception as e:
            return jsonify({"error": "Feature processing failed"}), 400

        # Build feature vector
        features = pd.DataFrame(
            [dict(zip(scaler.feature_names_in_, numeric_input[0])) | 
            {'Gender': gender_enc} | 
            dict(zip(mlb.classes_, disease_enc))],
            columns=feature_cols
        ).fillna(0)
        print("Built feature dataframe:", features)
        app.logger.info(f"Built feature dataframe: {features}")

        # Predict and decode
        preds = model.predict(features)
        print("Prediction done:", preds)
        app.logger.info(f"Prediction done: {preds}")

        meals = {}
        print("Decoding predictions")
        app.logger.info("Decoding predictions")
        app.logger.info(f"meals should be empty: {meals}")

        for idx, col in enumerate(target_encoders.keys()):
            meals[col.split('_')[0].lower()] = target_encoders[col].inverse_transform(
                [preds[0][idx]]
            )[0]
            app.logger.info(f"meals: {jsonify(meals)}")
          
        return jsonify(meals)
   
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')



