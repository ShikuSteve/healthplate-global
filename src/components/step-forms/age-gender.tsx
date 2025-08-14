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

export function AgeGender({ formData, setFormData }: props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Enter your age details</Form.Label>
      <Form.Control
        type="number"
        value={formData.age}
        placeholder={`Enter your age`}
        onChange={(e) =>
          setFormData({
            ...formData,
            age: Number(e.target.value),
          })
        }
        style={{
          backgroundColor: "white",
          // color: "#fff", // White text
          border: "1px solid #444", // Dark border
        }}
      />
      <Form.Label className="mt-3">Select your gender</Form.Label>
      <div>
        <Form.Check
          type="radio"
          id="gender-male"
          label="Male"
          name="gender"
          value="male"
          checked={formData.gender === "male"}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        />
        <Form.Check
          type="radio"
          id="gender-female"
          label="Female"
          name="gender"
          value="female"
          checked={formData.gender === "female"}
          onChange={(e) =>
            setFormData({
              ...formData,
              gender: e.target.value,
            })
          }
        />
      </div>
    </Form.Group>
  );
}
