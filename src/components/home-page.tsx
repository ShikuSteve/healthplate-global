import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/food3.jpeg";
import "./css/home-page.css";
import AOS from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import { Features } from "./features";
import { FAQs } from "./faq";
import { Contact } from "./contact";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: true,
      offset: 50,
    });
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <main
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          boxSizing: "border-box",
          background: "linear-gradient(to right, #3e2f2f, #a97155)",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={logo}
              width="50px"
              height="50px"
              style={{
                borderRadius: "50%",
                marginTop: "10px",
                marginLeft: "30px",
              }}
              alt="Picture of healthplate logo"
            />
            <h2 style={{ marginTop: "15px", color: "white" }}>HealthPlate</h2>
          </div>
          <Navbar expand="lg" className="bg-transparent">
            <Container>
              <Navbar.Brand
                href="#home"
                className="d-flex align-items-center gap-2"
              >
                {/* <span className="text-white">HealthPlate</span> */}
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="custom-collapse"
              >
                <Nav className="ms-auto nav-links">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#faq">FAQs</Nav.Link>
                  <Nav.Link href="#contact">Contact</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <section id="home" className="home-section">
          <div className="home-text" data-aos="fade-right">
            <p>
              At HealthPlate, we believe that food is more than just fuel — it's
              medicine. Our smart platform helps you take control of your
              well-being by analyzing your health conditions and recommending
              personalized foods and recipes that support your journey toward
              better health. Whether you're managing diabetes, fighting fatigue,
              or just trying to eat cleaner, HealthPlate serves up nutritious
              meals tailored specifically to your body’s needs — all backed by
              science, and made with love. ✨ Discover dishes that heal. Eat
              better. Live stronger.
            </p>
            <div className="button-group">
              <button
                className="button"
                onClick={() => navigate("/login?form=signup")}
              >
                Sign Up
              </button>
              <button
                className="button"
                onClick={() => navigate("/login?form=signin")}
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="home-image" data-aos="fade-up">
            <img src={logo} alt="HealthPlate logo" className="bounce" />
          </div>
        </section>

        {/* ========FEATURES================ */}
        <Features />
        {/* ======FAQs===================== */}
        <FAQs />
        {/**============CONTACT============= */}
        <Contact />
      </main>
    </>
  );
}
