import { useState } from "react";
import "./css/register.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaUser,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaCamera,
} from "react-icons/fa";
import { Contact } from "./step-forms/contact-address";
import { AgeGender } from "./step-forms/age-gender";
import { Location } from "./step-forms/location";
import { HealthDetails } from "./step-forms/health";
import { ImageUpload } from "./step-forms/image";
import { LoadingOverlay } from "./common/loading-overlay";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser, User } from "../store/redux/auth-slice";
import { RootState } from "../store/store";
import { capitalizeWords, FormDataType } from "../utils/types";

const steps = [
  {
    label: "Contact and Adress Details",
    icon: <FaUser />, // person icon for contact info
    description: "Enter your contact details",
  },
  {
    label: "Age and Gender Details",
    icon: <FaBirthdayCake />, // birthday cake to represent age/date of birth
    description: "Enter your age and date of birth",
  },
  {
    label: "Body and Diet Details",
    icon: <FaMapMarkerAlt />, // map pin for location
    description: "Enter your current location",
  },
  {
    label: "Health Details",
    icon: <FaHeartbeat />, // heart pulse for health info
    description: "Enter your health-related information",
  },
  {
    label: "Image",
    icon: <FaCamera />, // camera icon for image upload
    description: "Upload your image",
  },
];

export function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormDataType>({
    gender: "",
    phoneNumber: "",
    age: 0,
    country: "",
    city: "",
    disease: "",
    activityLevel: "",
    imageUrl: "",
    dietaryRestrictions: [],
    height:"",
    weight: 0,
  });

  // In Register component's handleNext function
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsLoading(true);
      try {
        // Destructure imageFile from formData
        const { imageFile, height, ...restFormData } = formData;

        const payload: Partial<User> & { email: string; image?: File } = {
          ...restFormData,
          email: storedUser?.email!,
          height: parseFloat(height),
          healthConditions: formData.disease
            ? [capitalizeWords(formData.disease)]
            : [],
          image: imageFile,
        };

        const updated = await updateUser(payload).unwrap();
        dispatch(setUser(updated));

        setTimeout(() => {
          // setIsLoading(false);
          navigate("/dashboard/suggestions");
        }, 6000);
      } catch (err) {
        console.error("Update failed:", err);
        setIsLoading(false); // Hide loading overlay if error happens
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const renderInput = () => {
    switch (steps[currentStep].label) {
      case "Contact and Adress Details":
        return (
          <Contact
            steps={steps}
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
          />
        );

      case "Age and Gender Details":
        return (
          <AgeGender
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            steps={steps}
          />
        );
      case "Body and Diet Details":
        return (
          <Location
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            steps={steps}
          />
        );
      case "Health Details":
        return (
          <HealthDetails
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            steps={steps}
          />
        );
      case "Image":
        return (
          <ImageUpload
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            steps={steps}
          />
        );
    }
  };
  return (
    <>
      {isLoading && <LoadingOverlay />}
      {isUpdating && <LoadingOverlay />}
      {updateError && (
        <div className="alert alert-danger">
          Failed to update profile. Please try again.
        </div>
      )}

      <Container
        fluid
        className="p-4 wrapper"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #3e2f2f, #a97155)",
        }}
      >
        <Row
          className="rounded-4 p-4 mx-auto text-white shadow"
          style={{
            maxWidth: "960px",
            backgroundColor: "#5a4036",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Sidebar */}
          <Col
            md={4}
            className="border-end-md border-light-subtle"
            style={{
              paddingBottom: "1rem",
              borderRight:
                window.innerWidth >= 768 ? "1px solid #cdbdaf" : "none",
            }}
          >
            <h5 className="text-white text-center text-md-start">
              PERSONAL INFORMATION
            </h5>
            {/* <p
              className="text-muted text-center text-md-start"
              style={{ color: "#d7c4b7" }}
            >
              Follow the simple 5 steps to complete your mapping.
            </p> */}
            <div className="d-flex flex-row flex-md-column  items-md-start  gap-2 mt-4  justify-content-md-start">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="d-flex flex-column align-items-center text-center"
                  style={{ minWidth: "60px", cursor: "pointer" }}
                  onClick={() => setCurrentStep(index)}
                >
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center mb-1"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentStep === index ? "#e9b994" : "#7b5e4b",
                      color: currentStep === index ? "#3e2f2f" : "#f0e6dd",
                      border: "1px solid #d1a079",
                    }}
                  >
                    {step.icon}
                  </div>
                  <small
                    style={{
                      color: currentStep === index ? "#fff" : "#cab7a8",
                      fontSize: "9px",
                    }}
                  >
                    {step.label}
                  </small>
                </div>
              ))}
              {/* <hr className="d-md-none w-100 mt-3 border-light-subtle" /> */}
              {/* <div className="d-none d-md-block border-end border-light-subtle h-100 ms-2" /> */}
            </div>
          </Col>

          {/* Form Content */}
          <Col md={8} className="mt-4 mt-md-0 ps-md-5">
            {/* <p style={{ color: "#e5d2c0" }}>
              Step {currentStep + 1}/{steps.length}
            </p> */}
            <h4 className="mb-3" style={{ color: "#fff4ec" }}>
              {steps[currentStep].label}
            </h4>
            {/* <p className="text-muted" style={{ color: "#e5d2c0" }}>
              Please fill in the details so we can move to the next step.
            </p> */}

            {renderInput()}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-light"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <Button
                style={{
                  backgroundColor: "#a97155",
                  borderColor: "#a97155",
                }}
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next Step"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
