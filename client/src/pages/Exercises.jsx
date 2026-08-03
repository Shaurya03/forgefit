import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import { useCategories } from "../hooks/useCategories";
import { useExercises } from "../hooks/useExercises";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "../utils/motionVariants";
import CategoryList from "../components/CategoryList";
import ExerciseList from "../components/ExerciseList";
import ExerciseLogger from "../components/ExerciseLogger";

import "./Exercises.css";

export const SESSION_CATEGORY_KEY = "exercises:lastCategoryId";
export const SESSION_EXERCISE_KEY = "exercises:lastExerciseId";

function Exercises() {
  const location = useLocation();

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const {
    exercises,
    fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise
  } = useExercises();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedExercise, setSelectedExercise] =
    useState(null);

  const [viewDirection, setViewDirection] = useState(1);

  const handleSelectCategory = (category) => {
    setViewDirection(1);
    setSelectedCategory(category);
  };

  const handleSelectExercise = (exercise) => {
    setViewDirection(1);
    setSelectedExercise(exercise);
  };

  const selectedExerciseId =
    location.state?.selectedExerciseId;

  const workoutId =
    location.state?.workoutId;

  const workoutDate =
    location.state?.workoutDate;

  const mode = location.state?.mode;
  const startFresh = location.state?.startFresh;

  const isDirectEditEntry = mode === "edit" && Boolean(selectedExerciseId);

  const handleBackFromExerciseList = () => {
    setViewDirection(-1);
    setSearchTerm("");
    setSelectedCategory(null);
    sessionStorage.removeItem(SESSION_CATEGORY_KEY);
  };

  const handleBackFromLogger = () => {
    setViewDirection(-1);
    setSelectedExercise(null);
    sessionStorage.removeItem(SESSION_EXERCISE_KEY);
  };

  const currentView = selectedExercise
    ? "logger"
    : selectedCategory
      ? "exerciseList"
      : "category";

  useBackButtonClose(
    !isDirectEditEntry && Boolean(selectedCategory),
    handleBackFromExerciseList
  );

  useBackButtonClose(
    !isDirectEditEntry && Boolean(selectedExercise),
    handleBackFromLogger
  );

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchCategories();
    fetchExercises();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/set-state-in-effect */

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }

    if (startFresh) {
      hasRestoredRef.current = true;
      sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      sessionStorage.removeItem(SESSION_EXERCISE_KEY);
      return;
    }

    if (categories.length === 0 || exercises.length === 0) {
      return;
    }

    hasRestoredRef.current = true;

    const exerciseIdToRestore =
      selectedExerciseId ||
      sessionStorage.getItem(SESSION_EXERCISE_KEY);

    if (exerciseIdToRestore) {
      const exercise = exercises.find(
        e => e._id === exerciseIdToRestore
      );

      if (exercise) {
        setSelectedCategory(exercise.categoryId);
        setSelectedExercise(exercise);
        return;
      }
    }

    const categoryIdToRestore = sessionStorage.getItem(
      SESSION_CATEGORY_KEY
    );

    if (categoryIdToRestore) {
      const category = categories.find(
        c => c._id === categoryIdToRestore
      );

      if (category) {
        setSelectedCategory(category);
      }
    }

  }, [selectedExerciseId, exercises, categories, startFresh]);

  useEffect(() => {
    if (selectedCategory) {
      sessionStorage.setItem(SESSION_CATEGORY_KEY, selectedCategory._id);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedExercise) {
      sessionStorage.setItem(SESSION_EXERCISE_KEY, selectedExercise._id);
    }
  }, [selectedExercise]);

  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (selectedExercise) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedExercise]);

  return (
    <div className="exercises-page">
      <div
        className={`exercises-container ${selectedExercise ? "logger-mode" : ""
          }`}
      >
        <AnimatePresence mode="wait" custom={viewDirection}>
          <motion.div
            key={currentView}
            custom={viewDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >

            {currentView === "category" && (
              <CategoryList
                categories={categories || []}
                exercises={exercises || []}
                createCategory={createCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {currentView === "exerciseList" && (
              <ExerciseList
                category={selectedCategory}
                categories={categories || []}
                exercises={exercises || []}
                createExercise={createExercise}
                updateExercise={updateExercise}
                deleteExercise={deleteExercise}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onBack={handleBackFromExerciseList}
                onSelectExercise={handleSelectExercise}
              />
            )}

            {currentView === "logger" && (
              <ExerciseLogger
                exercise={selectedExercise}
                workoutId={workoutId}
                workoutDate={workoutDate}
                onBack={handleBackFromLogger}
                mode={mode}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Exercises;