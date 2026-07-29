import { useRef } from "react";
import { FiMoreVertical } from "react-icons/fi";
import MenuPortal from "./MenuPortal";
import "./CategoryCard.css";

function CategoryCard({
  category,
  exerciseCount = 0,
  openCategoryMenu,
  setOpenCategoryMenu,
  onSelect,
  onEditCategory,
  onDeleteCategory
}) {

  const menuButtonRef = useRef(null);

  const handleEdit = () => {
    setOpenCategoryMenu(null);
    onEditCategory(category);
  };

  const handleDelete = () => {
    setOpenCategoryMenu(null);
    onDeleteCategory(category);
  };

  return (

    <div
      className="category-card"
      onClick={onSelect}
    >

      <div className="category-card-content">

        <h3>
          {category.name}
        </h3>

        <p className="category-count">
          {exerciseCount}{" "}
          {exerciseCount === 1
            ? "Exercise"
            : "Exercises"}
        </p>

      </div>

      <div className="category-actions">

        <button
          ref={menuButtonRef}
          className="category-menu-btn"
          onClick={(event) => {
            event.stopPropagation();

            setOpenCategoryMenu(
              openCategoryMenu === category._id
                ? null
                : category._id
            );
          }}
        >
          <FiMoreVertical />
        </button>

        {openCategoryMenu === category._id && (

          <MenuPortal
            anchorRef={menuButtonRef}
            isOpen={openCategoryMenu === category._id}
            onClose={() => setOpenCategoryMenu(null)}
          >
            <div
              className="category-menu"
              onClick={(event) => event.stopPropagation()}
            >

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleEdit();
                }}
              >
                Edit
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete();
                }}
              >
                Delete
              </button>

            </div>
          </MenuPortal>
        )}

      </div>

    </div>

  );

}

export default CategoryCard;