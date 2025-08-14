import { User, Mail, Phone, Edit, CheckCircle2, MapPin } from "lucide-react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import pic from "../../assets/wallpaper.jpeg";
import { useState } from "react";
import { EditProfile } from "../common/edit-profile-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export function Profile() {
  const [editProfile, setEditProfile] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user);

  // Function to get the full image URL
  const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return pic; // Return default image if no imageUrl

    // If imageUrl already starts with http, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Construct full URL with your backend server
    // Replace 'localhost:3000' with your actual backend URL
    const baseUrl = "http://localhost:3000";
    return `${baseUrl}${imageUrl}`;
  };

  // Get the profile image URL
  const profileImageUrl = getImageUrl(user?.imageUrl);

  return (
    <>
      {editProfile && (
        <EditProfile
          editProfile={editProfile}
          setEditProfile={setEditProfile}
        />
      )}

      <Container className="py-4 py-md-6 py-lg-8">
        <h1
          className="mb-4 mb-md-6 text-dark fw-bold fs-2 fs-md-3"
          style={{ alignSelf: "center", display: "flex" }}
        >
          {user?.fullName}
        </h1>

        <Card className="mb-5" style={{ backgroundColor: "#5E4B46" }}>
          <Card.Header className="d-flex align-items-center pb-2">
            <Card.Title className="d-flex align-items-center mb-0 fs-5 fw-medium text-dark">
              <User className="me-2" size={20} />
              {user?.fullName}
            </Card.Title>
          </Card.Header>

          <Card.Body>
            <Row className="align-items-center justify-content-center">
              {/* Image Column */}
              <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="rounded-circle border border-white"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Col>

              {/* Profile Info Column */}
              <Col xs={12} md={6} className="text-center text-md-start">
                <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 mb-2">
                  <span className="fs-4 fw-bold text-dark">
                    {user?.fullName}
                  </span>
                  <CheckCircle2 color="#28a745" size={20} />
                </div>

                <div className=" small d-flex justify-content-center justify-content-md-start align-items-center gap-2 mb-1">
                  <Mail size={16} />
                  <span style={{ fontWeight: "bold" }}>{user?.email}</span>
                </div>

                <div className=" small d-flex justify-content-center justify-content-md-start align-items-center gap-2">
                  <Phone size={16} />
                  <span style={{ fontWeight: "bold" }}>
                    {user?.phoneNumber}
                  </span>
                </div>
                <div className=" small d-flex justify-content-center justify-content-md-start align-items-center gap-2">
                  <MapPin size={16} />
                  <span style={{ fontWeight: "bold" }}>
                    {user?.country}, {user?.city}
                  </span>
                </div>
              </Col>
            </Row>
          </Card.Body>

          <Card.Footer className="d-flex justify-content-end">
            <Button
              // variant="outline-primary"
              size="sm"
              className="d-flex align-items-center gap-1"
              onClick={() => setEditProfile(true)}
              style={{
                backgroundColor: "#e9b994",
                border: "0px",
                color: "black",
              }}
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          </Card.Footer>
        </Card>

        <section className="mb-5">
          <h2
            className="fs-3 fw-bold text-center mb-5"
            style={{ color: "#5E4B46" }}
          >
            My Health
          </h2>

          <Row xs={1} md={2} lg={3} className="g-4">
            {/* Card 1: Energy Analysis */}
            <Col>
              <Card
                className="h-100 shadow border-0"
                style={{
                  background: "rgba(94, 75, 70, 0.9)",
                  color: "#F5EBDD",
                  backdropFilter: "blur(8px)",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Body>
                  <Card.Title className="fs-5 fw-semibold mb-4 text-warning">
                    🔋 Energy Analysis
                  </Card.Title>

                  <Card.Text className="small mb-3">
                    <strong>BMR: </strong>
                    {user?.energy?.BMR} kcal
                  </Card.Text>
                  <Card.Text className="small mb-3">
                    <strong>TDEE: </strong>
                    {user?.energy?.TDEE} kcal
                  </Card.Text>
                  <Card.Text className="small">
                    <strong>Calories per meal: </strong>
                    {user?.energy?.perMeal} kcal
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2: Health Metrics */}
            <Col>
              <Card
                className="h-100 shadow border-0"
                style={{
                  background: "rgba(94, 75, 70, 0.9)",
                  color: "#F5EBDD",
                  backdropFilter: "blur(8px)",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Body>
                  <Card.Title className="fs-5 fw-semibold mb-4 text-warning">
                    🏥 Health Metrics
                  </Card.Title>

                  <Card.Text className="small mb-3">
                    <strong>Height: </strong>
                    {user?.height} feet
                  </Card.Text>
                  <Card.Text className="small mb-3">
                    <strong>Weight: </strong>
                    {user?.weight} kg
                  </Card.Text>
                  <Card.Text className="small">
                    <strong>Condition: </strong>
                    {user?.healthConditions}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 3: Activity Metrics */}
            <Col>
              <Card
                className="h-100 shadow border-0"
                style={{
                  background: "rgba(94, 75, 70, 0.9)",
                  color: "#F5EBDD",
                  backdropFilter: "blur(8px)",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Body>
                  <Card.Title className="fs-5 fw-semibold mb-4 text-warning">
                    🏃 Activity Metrics
                  </Card.Title>

                  <Card.Text className="small mb-3">
                    <strong>Activity Level: </strong>Moderately active
                  </Card.Text>
                  <Card.Text className="small">
                    <strong>Food Preference: </strong>
                    {user?.dietaryRestrictions || "Not specified"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}
