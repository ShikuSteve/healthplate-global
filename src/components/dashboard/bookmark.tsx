import { useEffect, useState } from "react";
import { Loader } from "../common/dashboard-loader";
import { RecipeModal } from "../common/recipe-modal";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  CardTitle,
  Container,
} from "react-bootstrap";
import { GetBookmarks, Recipe } from "../../utils/types";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export function BookMark() {
  const userId = useSelector((state: RootState) => state.auth?.user?.id);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRecipe, setUserRecipe] = useState<GetBookmarks | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Timer to simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Fetch bookmarks from the API
  const fetchBookmarks = async () => {
    if (!userId) {
      console.log("No userId found");
      return;
    }

    console.log("🔍 Starting fetch for userId:", userId);
    setIsLoading(true);
    setError(null);

    try {
      const url = `http://localhost:3000/api/auth/bookmarks?userId=${userId}`;
      console.log("🔍 Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 Received data:", data);
      console.log(data, "dataaa");
      setUserRecipe(data);
    } catch (err) {
      console.error("🔍 Fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on first load or when userId changes
  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  const handleMealClick = (mealName: string) => {
    if (!userRecipe || !userRecipe.result) {
      console.log("No data available");
      return;
    }
    const meal = userRecipe.result.find((r) => r.label === mealName);
    if (meal) {
      setSelectedMeal(meal);
      setShowModal(true);
    }
  };

  // Show message if no userId
  if (!userId) {
    console.log("No userId found");
    return (
      <Container>
        <h3 style={{ margin: "20px" }}>Please log in to view your bookmarks</h3>
      </Container>
    );
  }

  // Show loading state
  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="alert alert-danger">Error loading recommendations</div>
    );

  // Show empty state
  if (!userRecipe || !userRecipe.result || userRecipe.result.length === 0) {
    console.log("🔍 No bookmarks found");
    return (
      <Container>
        <h3 style={{ margin: "20px" }}>No bookmarked recipes found</h3>
        <Button
          onClick={fetchBookmarks}
          variant="outline-dark"
          style={{
            marginTop: "20px",
            backgroundColor: "#f2e8e5",
            color: "#5E4B46",
            fontWeight: "bold",
            border: "1px solid #5E4B46",
            borderRadius: "8px",
          }}
        >
          🔄 Refresh Bookmarks
        </Button>
      </Container>
    );
  }

  console.log("🔍 Rendering bookmarks:", userRecipe.result.length);

  return (
    <>
      {showModal && selectedMeal && (
        <RecipeModal
          recipe={selectedMeal}
          setShowModal={setShowModal}
          showModal={showModal}
          source="bookmarks"
        />
      )}
      <Container>
        <h3
          style={{
            margin: "30px auto",
            padding: "10px 20px",
            fontSize: "28px",
            fontWeight: "600",
            textTransform: "capitalize",
            color: "#5E4B46",
            borderLeft: "5px solid #5E4B46",
            backgroundColor: "#f2e8e5",
            width: "fit-content",
            borderRadius: "6px",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          Bookmarked Recipes
        </h3>

        <Button
          onClick={fetchBookmarks}
          variant="outline-dark"
          style={{
            marginBottom: "20px",
            backgroundColor: "#f2e8e5",
            color: "#5E4B46",
            fontWeight: "bold",
            border: "1px solid #5E4B46",
            borderRadius: "8px",
          }}
        >
          🔄 Refresh Bookmarks
        </Button>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {userRecipe.result.map((recipe) => (
            <Card
              key={recipe.id}
              style={{
                background: "#5E4B46",
                color: "#F5F5F5",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                flex: "1 1 300px",
                maxWidth: "350px",
                margin: "1rem",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0, 0, 0, 0.1)";
              }}
              onClick={() => handleMealClick(recipe.label)}
            >
              <CardImg
                variant="top"
                src={recipe.images.REGULAR.url}
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
                alt={recipe.label}
              />

              <CardBody style={{ padding: "1rem", flexGrow: 1 }}>
                <CardTitle
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {recipe.mealType?.toUpperCase() || "RECIPE"}
                </CardTitle>
                <CardText
                  style={{
                    textAlign: "center",
                    fontSize: "1rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {recipe.label}
                </CardText>
              </CardBody>

              <CardFooter
                style={{
                  padding: "0.75rem 1rem",
                  background: "transparent",
                  borderTop: "none",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="light"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMealClick(recipe.label);
                  }}
                  style={{
                    backgroundColor: "#DAB88B",
                    color: "#5E4B46",
                    border: "none",
                    padding: "0.5rem 1.2rem",
                    fontWeight: "bold",
                    borderRadius: "20px",
                  }}
                >
                  View Recipe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
