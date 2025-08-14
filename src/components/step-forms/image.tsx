import { Dispatch, SetStateAction, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { FormDataType } from "../../utils/types";


interface Props {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  steps: { label: string }[];
  currentStep: number;
}

export function ImageUpload({ setFormData, formData }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   console.log(imageFile, "image file");
  //   if (file) {
  //     setImageFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const result = reader.result as string;
  //       setImagePreview(result);
  //       setFormData({ ...formData, imageUrl: result }); // Optional: store base64 or URL
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

// In ImageUpload component
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
    console.log(imageFile, "image file");
  if (file) {
    setImageFile(file);
    const reader = new FileReader();
    
    // Store the File object in imageFile field
    setFormData(prev => ({ 
      ...prev, 
      imageFile: file  // This is what matters for upload
    }));

    // Preview logic remains the same
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  return (
    <>
      <Form.Group controlId="imageUpload">
        <Form.Label className="fw-semibold">Upload an Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-3"
        />
      </Form.Group>

      {imagePreview && (
        <div className="d-flex justify-content-center mt-3">
          <Image
            src={imagePreview}
            alt="Preview"
            fluid
            className="shadow-sm rounded-circle"
            style={{ height: "200px", width: "200px", objectFit: "cover" }}
          />
        </div>
      )}
    </>
  );
}
