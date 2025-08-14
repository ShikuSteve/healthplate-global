import { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardImg,
  CardText,
  Container,
  CardFooter,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { RecipeModal } from "../common/recipe-modal";
import { Loader } from "../common/dashboard-loader";
import { useGetRecommendationsMutation } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  RecommendationResponse,
  Recipe,
  MealRecommendation,
  chunkRecipes,
} from "../../utils/types";
import { updateEnergy } from "../../store/redux/auth-slice";

export function Suggestions() {
  const userId = useSelector((state: RootState) => state.auth?.user?.id);
  const disease = useSelector(
    (state: RootState) => state.auth?.user?.healthConditions
  );
  const restrictions = useSelector(
    (state: RootState) => state.auth?.user?.dietaryRestrictions || []
  );
  console.log(userId, disease, restrictions, "data1");
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [getRecommendations, { isLoading, error }] =
    useGetRecommendationsMutation();
  const dispatch = useDispatch();
  console.log(userId, disease, restrictions, "data2");
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !Array.isArray(restrictions)) {
        setLoading(false);
        return;
      }

      try {
        const result = await getRecommendations({
          userId,
          disease,
          restrictions,
        }).unwrap();

        dispatch(
          updateEnergy({
            BMR: result.energy.BMR,
            TDEE: result.energy.TDEE,
            perMeal: result.energy.perMeal,
          })
        );

        // Enhance meals with images from recipes
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, disease, restrictions, getRecommendations, dispatch]);

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

  const handleMealClick = (mealName: string) => {
    if (!data) return;

    const meal = data.recipes.find((r) => r.label === mealName);
    if (meal) {
      setSelectedMeal(meal);
      setShowModal(true);
    }
  };

  if (loading || isLoading) return <Loader />;
  if (error)
    return (
      <div className="alert alert-danger">Error loading recommendations</div>
    );
  if (!data) return null;

  const rows = chunkRecipes(data.recipes, 3);

  return (
    <>
      <Container>
        <Card
          className="mb-5"
          style={{
            backgroundColor: "#3B2F2F",
            color: "#F5DEB3",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
          }}
        >
          <CardBody>
            <h2 className="text-center mb-4" style={{ color: "#FFD700" }}>
              🩺 HealthPlate Analysis
            </h2>

            <div
              className="analysis-row"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                { label: "🩻 Disease:", value: data.disease, bg: "#5A189A" },
                {
                  label: "🛑 Preference:",
                  value: data.dietaryRestrictions.join(", "),
                  bg: "#4B0082",
                },
                {
                  label: "🔥 BMR:",
                  value: `${data.energy.BMR} kcal`,
                  bg: "#006400",
                },
                {
                  label: "⚡ TDEE:",
                  value: `${data.energy.TDEE} kcal`,
                  bg: "#8B0000",
                },
                {
                  label: "🍽 Calories/Meal:",
                  value: `${data.energy.perMeal} kcal`,
                  bg: "#2F4F4F",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="analysis-item"
                  style={{
                    backgroundColor: item.bg,
                    color: "#fff",
                    padding: "1rem",
                    borderRadius: "10px",
                    flex: "1 1 200px",
                    minWidth: "200px",
                    maxWidth: "300px",
                    boxSizing: "border-box",
                  }}
                >
                  <strong>{item.label}</strong>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <h4>Recommended Meals</h4>

        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              gap: "1.5rem",
              paddingBottom: "1rem",
              flexWrap: "wrap", // so it’s responsive
              justifyContent: "flex-start",
            }}
          >
            {row.map((recipe) => (
              <Card
                key={recipe.id}
                className="m-2 shadow"
                style={{
                  background: "#5E4B46",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  flex: "1 1 30%",
                  maxWidth: "35%",
                  minWidth: "300px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* ✅ Image or fallback */}
                {recipe.images?.REGULAR?.url ? (
                  <CardImg
                    variant="top"
                    src={recipe.images.REGULAR.url}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                    alt={recipe.label}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#3E2723",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    {recipe.label}
                  </div>
                )}

                <CardBody className="text-center text-white">
                  <CardTitle className="fs-5 fw-bold mb-2">
                    {recipe.mealType?.toUpperCase() || "RECIPE"}
                  </CardTitle>

                  <CardText className="mb-3">{recipe.label}</CardText>

                  {/* Nutrition Row */}
                  <Row className="text-center">
                    <Col
                      style={{
                        backgroundColor: "#3E2723",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "2px",
                      }}
                    >
                      <small>
                        Calories
                        <br />
                        <strong>{recipe.macros.calories} kcal</strong>
                      </small>
                    </Col>
                    <Col
                      style={{
                        backgroundColor: "#4E342E",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "2px",
                      }}
                    >
                      <small>
                        Protein
                        <br />
                        <strong>{recipe.macros.protein} g</strong>
                      </small>
                    </Col>
                    <Col
                      style={{
                        backgroundColor: "#5D4037",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "2px",
                      }}
                    >
                      <small>
                        Carbs
                        <br />
                        <strong>{recipe.macros.carbs} g</strong>
                      </small>
                    </Col>
                    <Col
                      style={{
                        backgroundColor: "#6D4C41",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "2px",
                      }}
                    >
                      <small>
                        Fat
                        <br />
                        <strong>{recipe.macros.fat} g</strong>
                      </small>
                    </Col>
                  </Row>
                </CardBody>

                <CardFooter className="bg-transparent border-top-0 d-flex justify-content-center pb-3">
                  <Button
                    variant="light"
                    size="sm"
                    className="fw-semibold"
                    onClick={() => handleMealClick(recipe.label)}
                  >
                    View Recipe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ))}
      </Container>

      <RecipeModal
        recipe={selectedMeal}
        setShowModal={setShowModal}
        showModal={showModal}
        source="suggestions"
      />
    </>
  );
}
