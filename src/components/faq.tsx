import { Accordion } from "react-bootstrap";
import "./css/accordion.css";
import AOS from "aos";
import { useEffect } from "react";

export function FAQs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  });
  return (
    <section
      id="faq"
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 className="text-center mb-2" style={{ margin: "40px" }}>
        Frequently Asked Questions
      </h2>
      <div
        style={{
          width: "200px",
          height: "4px",
          backgroundColor: "#b8860b	",
          marginBottom: "40px",
          borderRadius: "2px",
        }}
      ></div>

      <div
        style={{ width: "100%", maxWidth: "800px" }}
        className="faq-accordion"
      >
        <Accordion>
          <Accordion.Item eventKey="0" data-aos="fade-up" data-aos-delay="0">
            <Accordion.Header>What is HealthPlate?</Accordion.Header>
            <Accordion.Body>
              HealthPlate is a comprehensive health and wellness platform that
              helps users track nutrition, monitor health goals, and access
              personalized wellness guidance.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" data-aos="fade-up" data-aos-delay="100">
            <Accordion.Header>
              How do I sign up for HealthPlate?
            </Accordion.Header>
            <Accordion.Body>
              Signing up is simple:
              <ol>
                <li>Visit our homepage and click on the "Sign Up" button.</li>
                <li>Fill in your personal and health details.</li>
                <li>Start tracking your health journey right away!</li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2" data-aos="fade-up" data-aos-delay="200">
            <Accordion.Header>
              Is my health data secure on HealthPlate?
            </Accordion.Header>
            <Accordion.Body>
              Absolutely. HealthPlate uses advanced encryption and follows
              strict privacy policies to ensure your health information is safe
              and confidential.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3" data-aos="fade-up" data-aos-delay="300">
            <Accordion.Header>
              Can I consult with health professionals on HealthPlate?
            </Accordion.Header>
            <Accordion.Body>
              Yes! HealthPlate allows you to book appointments and chat with
              certified nutritionists, fitness coaches, and medical
              professionals directly through the app.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4" data-aos="fade-up" data-aos-delay="400">
            <Accordion.Header>Is the data accurate?</Accordion.Header>
            <Accordion.Body>
              Yes, data accuracy is one of our highest priorities at
              HealthPlate. All health and nutrition recommendations provided
              through the platform are based on:
              <ul>
                <li>
                  <strong>Verified medical research</strong> — We rely on
                  peer-reviewed scientific studies, clinical guidelines, and
                  data from reputable institutions such as the World Health
                  Organization (WHO), the Centers for Disease Control and
                  Prevention (CDC), and other leading health organizations.
                </li>
                <li>
                  <strong>Expert review</strong> — Our content and algorithms
                  are regularly reviewed and updated by certified nutritionists,
                  dietitians, and healthcare professionals to ensure relevance
                  and accuracy.
                </li>
                <li>
                  <strong>User-specific inputs</strong> — Personalized
                  recommendations are generated using individual health data
                  (such as age, dietary restrictions, medical conditions, and
                  lifestyle), which enhances the precision of suggestions
                  provided.
                </li>
                <li>
                  <strong>Ongoing updates</strong> — As new scientific findings
                  emerge, we continuously refine our database and models to
                  reflect the most current knowledge in the field of health and
                  wellness.
                </li>
              </ul>
              Your health matters, and we’re committed to ensuring that the
              information you receive from HealthPlate is trustworthy,
              evidence-based, and tailored to your needs.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </section>
  );
}
