import "./css/contact.css";

export function Contact() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <h2>Contact Us</h2>
        <p>
          We do things differently by promoting healthy lifestyles and balanced
          nutrition. Focused on helping our users build lasting wellness through
          simple, practical guidance.
        </p>
        <div className="footer-grid">
          <div className="footer-item">
            <i className="icon">📍</i>
            <h4>Address</h4>
            <p>Orange California, US</p>
          </div>
          <div className="footer-item">
            <i className="icon">📞</i>
            <h4>Phone Number</h4>
            <p>+1 555 2342 111</p>
          </div>
          <div className="footer-item">
            <i className="icon">📧</i>
            <h4>Email</h4>
            <p>healthplate@gmail.com</p>
          </div>
          <div className="footer-item">
            <i className="icon">🎧</i>
            <h4>Toll Free</h4>
            <p>100 302 2302</p>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom">
        {/* <div className="social-icons">
          <span>🐦</span>
          <span>💼</span>
          <span>📘</span>
          <span>📸</span>
        </div> */}
      {/* </div> */}
    </footer>
  );
}
