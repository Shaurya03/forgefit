import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import "./CategoryList.css";

function CategoryList({
  categories,
  exercises,
  createCategory,
  updateCategory,
  deleteCategory,
  onSelectCategory
}) {

  const [openCategoryMenu, setOpenCategoryMenu] = useState(null);

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);

  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);

  const [deleteCategoryError, setDeleteCategoryError] = useState(null);


  const handleCreateCategory = async (categoryData) => {
    await createCategory(categoryData);
    setIsCreateCategoryModalOpen(false);
  };

  const handleEditCategory = (category) => {
    setOpenCategoryMenu(null);
    setSelectedCategoryForEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveCategory = async (updatedCategory) => {
    await updateCategory(
      selectedCategoryForEdit._id,
      updatedCategory
    );

    setIsEditCategoryModalOpen(false);
    setSelectedCategoryForEdit(null);
  };

  const handleDeleteCategory = (category) => {
    setOpenCategoryMenu(null);
    setDeleteCategoryError(null);
    setSelectedCategoryForDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {

    if (!selectedCategoryForDelete) {
      return;
    }

    try {

      await deleteCategory(
        selectedCategoryForDelete._id
      );

      setDeleteCategoryError(null);
      setIsDeleteCategoryModalOpen(false);
      setSelectedCategoryForDelete(null);

    } catch (error) {
      setDeleteCategoryError(error);
    }
  };

  const exerciseCounts = exercises.reduce(
    (counts, exercise) => {

      const categoryId = exercise.categoryId?._id;

      counts[categoryId] =
        (counts[categoryId] || 0) + 1;

      return counts;

    },
    {}
  );

  return (
    <>
      <div className="category-list-page">

        <div className="category-list-top">

          <div className="page-header">

            <h2>Exercises</h2>

            <button
              className="add-category-btn"
              onClick={() =>
                setIsCreateCategoryModalOpen(true)
              }
            >
              + Category
            </button>

          </div>

        </div>

        <div className="category-list-body">

          <div className="category-list">

            <AnimatePresence>
              {categories.map((category) => (
                <motion.div
                  className="category-cards"
                  key={category._id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <CategoryCard
                    category={category}
                    exerciseCount={exerciseCounts[category._id ?? 0]}
                    openCategoryMenu={openCategoryMenu}
                    setOpenCategoryMenu={setOpenCategoryMenu}
                    onSelect={() => onSelectCategory(category)}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

        </div>

      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() =>
          setIsCreateCategoryModalOpen(false)
        }
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        category={selectedCategoryForEdit}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setSelectedCategoryForEdit(null);
        }}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        category={selectedCategoryForDelete}
        error={deleteCategoryError}
        onClose={() => {
          setDeleteCategoryError(null);
          setIsDeleteCategoryModalOpen(false);
          setSelectedCategoryForDelete(null);
        }}
        onDelete={handleConfirmDeleteCategory}
      />

    </>
  );
}

export default CategoryList;