import { Button, Modal } from "react-bootstrap";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Recipe } from "../../utils/types";
import { useBookmarkRecipeMutation } from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Loader } from "./dashboard-loader";

interface Props {
  showModal: boolean;
  setShowModal: (x: boolean) => void;
  recipe: Recipe | null;
  source: "suggestions" | "search" | "bookmarks";
  onBookmarkToggle?: (recipeId: string, isBookmarked: boolean) => void;
}
export function RecipeModal({
  showModal,
  setShowModal,
  recipe,
  source,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(
    recipe?.isBookmarked || false
  );

  useEffect(() => {
    setIsBookmarked(recipe?.isBookmarked || false);
  }, [recipe]);
  const [toggleBookmark, { isLoading, error }] = useBookmarkRecipeMutation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const handleBookmarkClick = async () => {
    if (!recipe || !userId) {
      console.error("The recipe or user does not exist");
      return;
    }

    try {
      const result = await toggleBookmark({
        userId,
        recipeUri: recipe.id, // ensure this matches your backend type
      }).unwrap();

      // Flip local state based on what the server did:
      setIsBookmarked(!result.removed);

      // Show toast
      if (result.removed) {
        toast.info("Recipe has been removed from bookmarks.", {
          style: {
            background: "#ddd",
            color: "#333",
          },
        });

        // ✅ Close modal if source is 'bookmarks'
        if (source === "bookmarks") {
          setShowModal(false);
        }
      } else {
        toast.success("Recipe bookmarked!", {
          style: {
            background: "rgb(113, 84, 44)",
            color: "white",
          },
        });
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      toast.error("Failed to update bookmark", {
        style: {
          background: "#ff4444",
          color: "white",
        },
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="alert alert-danger">Error loading recommendations</div>
    );

  const getBookmarkButtonLabel = () => {
    if (source === "bookmarks") return "Remove from Bookmarks";
    if ((source === "suggestions" || source === "search") && isBookmarked)
      return "Remove from Bookmarks";
    return "Bookmark the Recipe";
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        style={{ alignSelf: "center" }}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#5E4B46", color: "#E0DAD3" }}
        >
          <Modal.Title>{recipe?.label}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "#5E4B46", color: "#D6CEC6" }}>
          {recipe && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={recipe.images.REGULAR.url}
                  alt={recipe.label}
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "10%",
                    marginBottom: "1rem",
                  }}
                />

                <div style={{ maxWidth: "300px" }}>
                  <h5 style={{ color: "#F5EBDD" }}>Ingredients</h5>
                  <ul style={{ paddingLeft: "1rem" }}>
                    {recipe.ingredients.map((line: string, index: number) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: "2rem" }}>
                <h4 style={{ color: "#F5EBDD", marginBottom: "1rem" }}>
                  Procedure
                </h4>
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  <ol
                    style={{
                      padding: "0 1rem",
                      color: "#DDD6CF",
                      lineHeight: "1.6",
                    }}
                  >
                    {recipe.instructions.map((step: string, index: number) => (
                      <li key={index} style={{ marginBottom: "1rem" }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p style={{ color: "#B6AFA6", fontStyle: "italic" }}>
                    No instructions available for this recipe.
                  </p>
                )}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer
          style={{
            backgroundColor: "#5E4B46",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Button
            style={{
              backgroundColor:
                source === "bookmarks"
                  ? "#e6a1a1" // faded red
                  : isBookmarked
                  ? "#d4af37" // golden yellow for bookmarked
                  : "#ffde59", // lighter golden yellow for bookmarking
              color: "#fff",
              border: "none",
            }}
            onClick={handleBookmarkClick}
          >
            {getBookmarkButtonLabel()}
          </Button>

          <Button variant="outline-light" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
