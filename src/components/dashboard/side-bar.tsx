import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBookmark,
  FaSearch,
  FaLightbulb,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "../css/sidebar.css";
import { LogoutButton } from "../common/logout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const name = storedUser?.fullName;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true); // Always open on desktop
      } else {
        setIsOpen(false); // Default closed on mobile
      }
    };

    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout-container">
      {isMobile && (
        <button className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {(!isMobile || isOpen) && (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2 style={{ marginLeft: "35%" }}>{name}</h2>
            {/* {!isMobile && (
              <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "⏴" : "⏵"}
              </button>
            )} */}
          </div>

          <nav>
            <ul style={{ margin: "10%", paddingTop: "6%" }}>
              <li
                style={{ marginBottom: "20%" }}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Link to="/dashboard/suggestions">
                  <FaLightbulb /> Suggestions
                </Link>
              </li>
              <li
                style={{ marginBottom: "20%" }}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Link to="/dashboard/search">
                  <FaSearch /> Search
                </Link>
              </li>
              <li
                style={{ marginBottom: "20%" }}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Link to="/dashboard/bookmark">
                  <FaBookmark /> Bookmarks
                </Link>
              </li>
              <li
                style={{ marginBottom: "20%" }}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Link to="/dashboard/profile">
                  <FaUser /> Profile
                </Link>
              </li>
            </ul>
          </nav>

          <div className="logout-container">
            <LogoutButton />
          </div>
        </div>
      )}

      <div className={`main-content ${isOpen && !isMobile ? "shifted" : ""}`}>
        {children}
      </div>
    </div>
  );
}
