import { useEffect, useState } from "react";
import "../components/css/sliding-auth.css";
import { Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSigninMutation, useSignUpMutation } from "../api/api";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/redux/auth-slice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// import { getauth } from "../store/redux/auth-slice";
// TODO: dispatch(getauth(userData))

export function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const initialForm = queryParams.get("form");
  const navigate = useNavigate();
  const [signupMutation, { isLoading: signupLoading }] = useSignUpMutation();
  const [signinMutation, { isLoading: signinLoading }] = useSigninMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialForm === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [initialForm]);

  async function handleSignup() {
    try {
      toast.info("Please wait while we sign you up...");

      const response = await signupMutation({
        fullName,
        email,
        password,
      }).unwrap();

      if (!response?.user?.id) {
        console.error("No User id found");
        return;
      }

      const idToken = response.accessToken;

      if (!response.user?.fullName || !response.user.email) {
        return;
      }

      const user = {
        refreshToken: response.refreshToken,
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        accessToken: idToken,
      };

      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
      toast.success("Signup successful!");

      navigate("/register");
    } catch (err) {
      console.error("Signup error", err);
      toast.error("Signup failed. Please try again.");
    }
  }

  async function handleSignin() {
    try {
      toast.info("Please wait while we log you in...");

      const response = await signinMutation({ email, password }).unwrap();

      if (!response.user?.id) {
        toast.error("User not found. Please sign up.");
        return;
      }
      console.log(response, "user after login");
      const user = {
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        healthConditions: response.user.healthConditions || [],
        dietaryRestrictions: response.user.dietaryRestrictions || [],
        activityLevel: response.user.activityLevel || "",
        imageUrl: response.user.imageUrl || "",
        city: response.user.city || "",
        country: response.user.country || "",
        age: response.user.age || 0,
        phoneNumber: response.user.phoneNumber || "",
        height: response.user.height || 0,
        weight: response.user.weight || 0,
        gender: response.user.gender || "",
      };

      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
      toast.success("Login successful!");

      navigate("/dashboard/suggestions");
    } catch (err) {
      console.error("Signin error", err);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  const onSubmit = isSignup ? handleSignup : handleSignin;
  const loading = isSignup ? signupLoading : signinLoading;

  return (
    <div className="circular-auth-wrapper">
      <div className="circle-ring" />
      <div className="circle-center-mask" />

      <div className="form-box">
        <h2 style={{ marginBottom: "10%" }}>{isSignup ? "Signup" : "Login"}</h2>

        <Form>
          <Form.Group className="floating-label mb-3">
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Label>Email</Form.Label>
          </Form.Group>

          <Form.Group
            className="floating-label mb-3"
            style={{ position: "relative" }}
          >
            <Form.Control
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                paddingRight: "3rem", // space for the icon inside input
              }}
            />
            <Form.Label>Password</Form.Label>

            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
                fontSize: "1.5rem", // enlarge the icon
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </Form.Group>

          {isSignup && (
            <Form.Group className="floating-label mb-3">
              <Form.Control
                type="text"
                placeholder="e.g John Doe"
                required
                onChange={(e) => setFullName(e.target.value)}
              />
              <Form.Label>Full Name</Form.Label>
            </Form.Group>
          )}

          <div className="d-grid">
            <Button
              variant="info"
              className="custom-toggle-btn"
              onClick={onSubmit}
              disabled={loading}
            >
              {isSignup ? "Signup" : "Login"}
            </Button>
          </div>
        </Form>

        <div className="toggle-link mt-3">
          <span>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </span>
          <Button
            className="custom-toggle-btn"
            variant="link"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Signup"}
          </Button>
        </div>
      </div>
    </div>
  );
}
