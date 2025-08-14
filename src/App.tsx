import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HomePage } from "./components/home-page";
import { Login } from "./components/login";
import { Profile } from "./components/dashboard/profile";
import { Register } from "./components/register";
import SidebarLayout from "./components/dashboard/side-bar";
import { Search } from "./components/dashboard/search";
import { Suggestions } from "./components/dashboard/suggestions";
import { NotFound } from "./utils/not-found";
import { BookMark } from "./components/dashboard/bookmark";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <div style={{ flex: 1, overflowX: "hidden" }}>
        <Routes>
          {/* Route with Sidebar */}
          <Route
            path="/dashboard/*"
            element={<SidebarLayout children={<Layout />} />}
          ></Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound text="CommonRoutes" />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={7000} />
    </div>
  );
}

export default App;

function Layout() {
  const location = useLocation();

  // Redirect from /dashboard to /dashboard/suggestions
  if (
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/" ||
    location.pathname === "/dashboard/*"
  ) {
    return <Navigate to="/dashboard/suggestions" replace />;
  }
  return (
    <Routes>
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/bookmark" element={<BookMark />} />
      <Route path="/search" element={<Search />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<DashboardNotFound />} />
    </Routes>
  );
}

function DashboardNotFound() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Clear auth data (example)
  //   localStorage.removeItem("token");

  //   // Optionally: navigate to login after few seconds
  //   // setTimeout(() => navigate("/login"), 3000);
  // }, [navigate]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <NotFound text="SidebarRoutes" />
      </div>
    </>
  );
}
