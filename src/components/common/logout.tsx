import { FaSignOutAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import "../css/logout.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate logout logic (e.g., clear token, etc.)
    setTimeout(() => {
      navigate("/", { replace: true });
      setIsLoggingOut(false);
    }, 500); // Optional: small delay for better UX
  };

  return (
    <Button
      variant="dark"
      className="d-flex align-items-center gap-2 logout-button"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <FaSignOutAlt size={20} />
      {isLoggingOut ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};
