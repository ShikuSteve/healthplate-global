import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
} from "react-bootstrap";
import { RecipeModal } from "../common/recipe-modal";
import { Loader } from "../common/dashboard-loader";
import { useGetRecommendationsMutation } from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  // chunkRecipes,
  MealRecommendation,
  Recipe,
  RecommendationResponse,
} from "../../utils/types";

const foodPreferences = ["Vegetarian", "Vegan", "Omnivore", "Pescatarian"];

export function Search() {
  const userId = useSelector((state: RootState) => state.auth?.user?.id);
  const [query, setQuery] = useState("");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Recipe | null>(null);
  const [getRecommendations, { isLoading, error }] =
    useGetRecommendationsMutation();

  const enhanceMeal = (
    meal: MealRecommendation,
    recipes: Recipe[]
  ): MealRecommendation => {
    const recipe = recipes.find((r) => r.label === meal.name);
    return {
      ...meal,
      image: recipe?.images.REGULAR.url || "/placeholder-food.jpg",
    };
  };

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };
  console.log(query, selectedPrefs, "data");

  const handleSearch = async () => {
    if (!userId) {
      console.warn("UserId is missing");
      return;
    }
    try {
      const result = await getRecommendations({
        userId,
        disease: query ? [query] : [],
        restrictions: selectedPrefs,
      }).unwrap();
      console.log("resssuuuult", result);
      const enhancedMeals = {
        breakfast: enhanceMeal(
          result.recommendedMeals.breakfast,
          result.recipes
        ),
        lunch: enhanceMeal(result.recommendedMeals.lunch, result.recipes),
        supper: enhanceMeal(result.recommendedMeals.supper, result.recipes),
      };

      setData({
        ...result,
        recommendedMeals: enhancedMeals,
      });
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    }
  };

  const handleMealClick = (mealName: string) => {
    if (!data) return;
    const meal = data.recipes.find((r) => r.label === mealName);
    if (meal) {
      setSelectedMeal(meal);
      setShowModal(true);
    }
  };

  // Render
  return (
    <>
      {isLoading && <Loader />}

      {showModal && selectedMeal && (
        <RecipeModal
          recipe={selectedMeal}
          setShowModal={setShowModal}
          showModal={showModal}
          source="search"
        />
      )}

      <Container>
        {/* Search Controls - always rendered */}
        <Row className="align-items-center mb-4">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search by condition..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col md={5}>
            <Dropdown
              show={showDropdown}
              onToggle={() => setShowDropdown(!showDropdown)}
            >
              <Dropdown.Toggle
                variant=""
                style={{ backgroundColor: "#5C4033" }}
                className="w-100"
              >
                Filter by Preference
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {foodPreferences.map((pref) => (
                  <Form.Check
                    key={pref}
                    type="checkbox"
                    label={pref}
                    checked={selectedPrefs.includes(pref)}
                    onChange={() => togglePref(pref)}
                    className="px-5"
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={2}>
            <Button
              onClick={handleSearch}
              className="w-100"
              style={{ backgroundColor: "#5C4033", borderColor: "#967969" }}
            >
              Search
            </Button>
          </Col>
        </Row>

        {/* Results Section - only if data exists */}
        {error && (
          <div className="alert alert-danger">
            Error loading recommendations
          </div>
        )}
        {data && !isLoading && (
          <Row className="gx-4 gy-4">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "1.5rem",
              }}
            >
              {data.recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  style={{
                    background: "#5E4B46",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    flex: "1 1 calc(33.33% - 1rem)",
                    maxWidth: "calc(33.33% - 1rem)",
                    minWidth: "250px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0, 0, 0, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => handleMealClick(recipe.label)}
                >
                  {/* Image */}
                  <CardImg
                    variant="top"
                    src={recipe.images.REGULAR.url}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    alt={recipe.label}
                  />

                  {/* Body */}
                  <CardBody style={{ color: "white" }}>
                    <CardTitle style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {recipe.mealType?.toUpperCase() || "RECIPE"}
                    </CardTitle>
                    <CardText
                      style={{ fontSize: "16px", marginBottom: "15px" }}
                    >
                      {recipe.label}
                    </CardText>

                    {/* Macros */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        backgroundColor: "#6F5C55",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#E0D2C4" }}>Calories</strong>
                        <br />
                        <span style={{ color: "#C0B0A3" }}>
                          {recipe.macros.calories} kcal
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: "#F0E6D2" }}>Protein</strong>
                        <br />
                        <span style={{ color: "#B8C1A3" }}>
                          {recipe.macros.protein} g
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: "#E8DAD0" }}>Carbs</strong>
                        <br />
                        <span style={{ color: "#A3B8C1" }}>
                          {recipe.macros.carbs} g
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: "#F5E1D8" }}>Fat</strong>
                        <br />
                        <span style={{ color: "#C1A3A3" }}>
                          {recipe.macros.fat} g
                        </span>
                      </div>
                    </div>
                  </CardBody>

                  {/* Footer */}
                  <CardFooter
                    style={{
                      backgroundColor: "transparent",
                      borderTop: "none",
                    }}
                  >
                    <Button
                      variant="light"
                      size="sm"
                      style={{ color: "#5E4B46", fontWeight: "bold" }}
                      onClick={() => handleMealClick(recipe.label)}
                    >
                      View Recipe
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Row>
        )}
      </Container>
    </>
  );
}
