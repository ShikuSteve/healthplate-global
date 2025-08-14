import { Form } from "react-bootstrap";

import { Dispatch, SetStateAction } from "react";
import "../css/phone.css";
import { FormDataType } from "../../utils/types";

interface props {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  steps: { label: string }[];
  currentStep: number;
}
export function HealthDetails({ formData, setFormData }: props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Which disease have you been diagnosed with?(optional)
      </Form.Label>
      <Form.Control
        type="text"
        value={formData.disease}
        onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
        placeholder="e.g Weight gain"
        style={{
          backgroundColor: "white",
          // color: "#fff", // White text
          border: "1px solid #000000", // Dark border
        }}
      />
      <Form.Label>Rate your activity level</Form.Label>
      <div>
        <Form.Check
          type="radio"
          id="active-sedentary"
          label="Sedentary"
          name="activityLevel"
          value="Sedentary"
          checked={formData.activityLevel === "Sedentary"}
          onChange={(e) =>
            setFormData({ ...formData, activityLevel: e.target.value })
          }
        />
        <Form.Check
          type="radio"
          id="active-lightlyActive"
          label="Lightly Active"
          name="activityLevel"
          value="LightlyActive"
          checked={formData.activityLevel === "LightlyActive"}
          onChange={(e) =>
            setFormData({
              ...formData,
              activityLevel: e.target.value,
            })
          }
        />
        <Form.Check
          type="radio"
          id="active-moderatelyActive"
          label="Moderately Active"
          name="activityLevel"
          value="ModeratelyActive"
          checked={formData.activityLevel === "ModeratelyActive"}
          onChange={(e) =>
            setFormData({
              ...formData,
              activityLevel: e.target.value,
            })
          }
        />
        <Form.Check
          type="radio"
          id="active-veryActive"
          label="Very Active"
          name="activityLevel"
          value="VeryActive"
          checked={formData.activityLevel === "VeryActive"}
          onChange={(e) =>
            setFormData({
              ...formData,
              activityLevel: e.target.value,
            })
          }
        />
      </div>
    </Form.Group>
  );
}
