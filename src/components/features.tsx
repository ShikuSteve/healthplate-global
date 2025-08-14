import { useEffect } from "react";
import AOS from "aos";
import { Card } from "react-bootstrap";
import pic from "../assets/bookmark.png";
import search from "../assets/search.png";
import security from "../assets/9004823_shield_security_protection_safety_icon.png";
import fav from "../assets/79598_favorites_folder_icon.png";
import note from "../assets/recommendation.png";
import user from "../assets/user.png";

export function Features() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true, // only animate once
    });
  }, []);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
  };
  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  };
  return (
    <section id="features" style={{ marginTop: "20px" }}>
      <h2 className="text-center mb-5">Key Features</h2>
      <div className="container">
        <div className="row justify-content-center g-4">
          {[
            // array of features
            {
              img: search,
              title: "Smart Search",
              body: "Quickly find foods tailored to your health condition using our intelligent search.",
            },
            {
              img: fav,
              title: "Favorites",
              body: "Mark your favorite meals for quick access anytime.",
            },
            {
              img: pic,
              title: "Bookmark Recipes",
              body: "Bookmark recipes to revisit and try later with ease.",
            },
            {
              img: user,
              title: "Save User Details",
              body: "Save your health data securely for more accurate and personal suggestions.",
            },
            {
              img: note,
              title: "Personalized Recommendations",
              body: "Get food and recipe suggestions tailored to your unique health profile, goals, and preferences.",
            },
            {
              img: security,
              title: "Security",
              body: "Your health data is encrypted and securely stored — your privacy is our top priority.",
            },
          ].map((feature, index) => (
            <div
              className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              key={index}
            >
              <Card
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  padding: "20px",
                  background: "#f5f5dc",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={feature.img}
                  width="50"
                  height="50"
                  className="mx-auto mb-3"
                />
                <Card.Title className="text-center">{feature.title}</Card.Title>
                <Card.Body className="text-center">{feature.body}</Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
