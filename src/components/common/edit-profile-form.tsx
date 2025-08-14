import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useUpdateUserMutation } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FormDataType } from "../../utils/types";
import { setUser, User } from "../../store/redux/auth-slice";

interface Props {
  editProfile: boolean;
  setEditProfile: (x: boolean) => void;
}
const activityOptions = [
  { value: "Sedentary", label: "Sedentary" },
  { value: "LightlyActive", label: "Lightly Active" },
  { value: "ModeratelyActive", label: "Moderately Active" },
  { value: "VeryActive", label: "Very Active" },
];
const preference = ["Vegetarian", "Omnivore", "Vegan", "Pescatarian"];

export function EditProfile({ editProfile, setEditProfile }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth?.user);
  const dispatch = useDispatch();

  const initialDisease = Array.isArray(user?.healthConditions)
    ? user!.healthConditions.join(", ")
    : "";

  const [formData, setFormData] = useState<FormDataType>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    age: user?.age || 0,
    gender: user?.gender || "",
    country: user?.country || "",
    city: user?.city || "",
    disease: initialDisease,
    activityLevel: user?.activityLevel || "",
    imageUrl: user?.imageUrl || "",
    dietaryRestrictions: user?.dietaryRestrictions || [],
    height: String(user?.height) || "",
    weight: user?.weight || 0,
  });

  console.log(formData, "formdata");
  const [updateUser, { isLoading: isUpdating, error }] =
    useUpdateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      console.error("No email present!");
      return;
    }

    const healthConditions = formData.disease
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Build the base payload
    const payload: Partial<User> & {
      email: string;
      image?: File;
      imageUrl?: string;
    } = {
      ...formData,
      healthConditions,
      height: parseFloat(formData.height),
      email: formData.email,
    };

    // Conditionally add image (new or existing)
    if (selectedImage) {
      payload.image = selectedImage; // New file to upload
    } else if (formData.imageUrl) {
      payload.imageUrl = formData.imageUrl; // Use existing image URL
    }

    try {
      const updated = await updateUser(payload).unwrap();
      dispatch(setUser(updated));
      setEditProfile(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const hideModal = () => {
    setEditProfile(false);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewUrl(blobUrl);
    // <-- NEW:
    setFormData({ ...formData, imageUrl: blobUrl });
  };

  if (error)
    return (
      <div className="alert alert-danger">Error loading recommendations</div>
    );

  return (
    <Modal show={editProfile} onHide={hideModal} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: "#967969", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Row 1: Name and Email */}
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2: Country and City */}
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Phone & Disease */}
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <PhoneInput
                    inputClass="phoneNoInput"
                    country="ke"
                    preferredCountries={["ke", "us"]}
                    enableSearch
                    inputStyle={{ width: "100%" }}
                    value={formData.phoneNumber}
                    onChange={(value: string) =>
                      setFormData({ ...formData, phoneNumber: value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formDisease">
                  <Form.Label>Health Conditions</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Weight Gain, Hypertension"
                    value={formData.disease}
                    onChange={(e) =>
                      setFormData({ ...formData, disease: e.target.value })
                    }
                  />
                  <Form.Text className="text-muted">
                    Separate multiple with commas.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Health Metrics */}
            <Row className="mb-3">
              <Col>
                <h5 className="text-center border-bottom border-dark pb-1">
                  Health Metrics
                </h5>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Activity Level</Form.Label>
                  {activityOptions.map((opt) => (
                    <Form.Check
                      key={opt.value}
                      type="radio"
                      name="activityLevel"
                      id={`act-${opt.value}`}
                      label={opt.label}
                      value={opt.value}
                      checked={formData.activityLevel === opt.value}
                      onChange={() =>
                        setFormData({ ...formData, activityLevel: opt.value })
                      }
                    />
                  ))}
                </Form.Group>
              </Col>

              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="preference">
                  <Form.Label>Food Preference</Form.Label>
                  {preference.map((option) => (
                    <Form.Check
                      key={option}
                      type="radio"
                      label={option}
                      name="diet"
                      value={option}
                      checked={formData.dietaryRestrictions[0] === option}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: [option],
                        })
                      }
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>

            {/* Height and Weight */}
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Height</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g 5'3 feet"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        height: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g 53kgs"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: parseFloat(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Profile Picture */}
            <Form.Group className="mb-4 text-center">
              <img
                src={
                  previewUrl
                    ? previewUrl
                    : `http://localhost:3000${formData.imageUrl}`
                }
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
              <Form.Label style={{ display: "block", color: "white" }}>
                Upload Profile Picture
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={hideModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "#e9b994",
                border: "0px",
                color: "black",
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving…" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </div>
      </Form>
    </Modal>
  );
}
