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

export function Location({ formData, setFormData }: props) {
  console.log(formData.height, "height");
  return (
    <Form.Group className="mb-3">
      <Form.Label>Enter your height</Form.Label>
      <Form.Control
        type="text"
        value={formData.height}
        onChange={(e) => setFormData({ ...formData, height: (e.target.value )})}
        placeholder="e.g 5'3 feet"
        style={{
          backgroundColor: "white",
          // color: "#fff",
          border: "1px solid #444",
        }}
      />

      <Form.Label>Enter your weight</Form.Label>
      <Form.Control
        type="number"
        value={formData.weight}
        onChange={(e) =>
          setFormData({ ...formData, weight: parseFloat(e.target.value) })
        }
        placeholder="e.g 53kgs"
        style={{
          backgroundColor: "white",
          // color: "#fff",
          border: "1px solid #444",
        }}
      />

      <Form.Label className="mt-3">Select your diet preference</Form.Label>
      <div style={{ color: "#fff" }}>
        <Form.Check
          type="radio"
          label="Vegetarian"
          name="diet"
          value="Vegetarian"
          checked={formData.dietaryRestrictions.includes("Vegetarian")}
          onChange={(e) =>
            setFormData({ ...formData, dietaryRestrictions: [e.target.value] })
          }
        />
        <Form.Check
          type="radio"
          label="Omnivore"
          name="diet"
          value="Omnivore"
          checked={formData.dietaryRestrictions.includes("Omnivore")}
          onChange={(e) =>
            setFormData({ ...formData, dietaryRestrictions: [e.target.value] })
          }
        />
        <Form.Check
          type="radio"
          label="Vegan"
          name="diet"
          value="Vegan"
          checked={formData.dietaryRestrictions.includes("Vegan")}
          onChange={(e) =>
            setFormData({ ...formData, dietaryRestrictions: [e.target.value] })
          }
        />
        <Form.Check
          type="radio"
          label="Pescatarian"
          name="diet"
          value="Pescatarian"
          checked={formData.dietaryRestrictions.includes("Pescatarian")}
          onChange={(e) =>
            setFormData({ ...formData, dietaryRestrictions: [e.target.value] })
          }
        />
      </div>
    </Form.Group>
  );
}
