import "../css/loading-overlay.css";
import { FaAppleAlt } from "react-icons/fa";
// import heart from "../../assets/image.png";

export function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="orbit-wrapper">
        <div className="heart-loader">
          <FaAppleAlt />
        </div>
      </div>
      <p className="loading-text">Loading your healthplate data...</p>
    </div>
  );
}
