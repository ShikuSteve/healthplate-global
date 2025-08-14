import { Form } from "react-bootstrap";

import { Dispatch, SetStateAction } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import default styles
import "../css/phone.css";
import { FormDataType } from "../../utils/types";

interface props {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  steps: { label: string }[];
  currentStep: number;
}

export function Contact({ formData, setFormData }: props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Enter your phone number</Form.Label>

      <PhoneInput
        inputClass="phoneNoInput"
        inputProps={{
          name: "phoneNumber",
          autoFocus: false,
        }}
        country={"ke"}
        preferredCountries={["ke", "us"]}
        enableSearch={true}
        onChange={(value: string) =>
          setFormData({ ...formData, phoneNumber: value })
        }
      />
      <Form.Label>Enter your country</Form.Label>
      <Form.Control
        type="location"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        style={{
          backgroundColor: "white",
          // color: "#fff", // White text
          border: "1px solid #444", // Dark border
          width: "55%",
        }}
        placeholder="e.g Kenya"
      />
      <Form.Label>Enter your city</Form.Label>
      <Form.Control
        type="location"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        style={{
          backgroundColor: "white",
          // color: "#fff", // White text
          border: "1px solid #444", // Dark border
          width: "55%",
        }}
        placeholder="e.g Eldoret"
      />
    </Form.Group>
  );
}
