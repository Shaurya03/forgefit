// Builds a realistic ~8-week training history for the demo account.
// Dates are relative to "today" so the demo never looks stale.

function daysAgo(n) {
  const d = new Date();
  d.setHours(17, 30, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

// Linear progression across 8 weeks (week 0 = oldest, week 7 = most recent)
function progress(start, end, week, totalWeeks = 8) {
  const step = (end - start) / (totalWeeks - 1);
  return Math.round((start + step * week) * 2) / 2;
}

function logSet(metrics, units = {}) {
  return { metrics, inputUnits: units };
}

function buildDemoWorkouts(exerciseIds, categoryIds) {
  const workouts = [];

  for (let week = 0; week < 8; week++) {
    const weeksAgo = 7 - week;
    const base = weeksAgo * 7;

    const bench = progress(60, 77.5, week);
    workouts.push({
      title: "Push Day",
      date: daysAgo(base + 6),
      exercises: [
        {
          exerciseId: exerciseIds["Flat Barbell Bench Press"],
          categoryId: categoryIds["Chest"],
          sets: [
            logSet({ weight: bench, reps: 8 }, { weight: "kg" }),
            logSet({ weight: bench, reps: 7 }, { weight: "kg" }),
            logSet({ weight: bench, reps: 6 }, { weight: "kg" }),
            logSet({ weight: bench - 5, reps: 8 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Incline Dumbbell Press"],
          categoryId: categoryIds["Chest"],
          sets: [
            logSet({ weight: progress(20, 27.5, week), reps: 10 }, { weight: "kg" }),
            logSet({ weight: progress(20, 27.5, week), reps: 9 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Dumbbell Lateral Raise"],
          categoryId: categoryIds["Shoulders"],
          sets: [
            logSet({ weight: 10, reps: 12 }, { weight: "kg" }),
            logSet({ weight: 10, reps: 10 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Rope Tricep Pushdown"],
          categoryId: categoryIds["Triceps"],
          sets: [
            logSet({ weight: progress(18, 25, week), reps: 12 }, { weight: "kg" }),
            logSet({ weight: progress(18, 25, week), reps: 11 }, { weight: "kg" })
          ]
        }
      ]
    });

    const deadlift = progress(100, 132.5, week);
    workouts.push({
      title: "Pull Day",
      date: daysAgo(base + 5),
      exercises: [
        {
          exerciseId: exerciseIds["Conventional Deadlift"],
          categoryId: categoryIds["Back"],
          sets: [
            logSet({ weight: deadlift, reps: 5 }, { weight: "kg" }),
            logSet({ weight: deadlift, reps: 4 }, { weight: "kg" }),
            logSet({ weight: deadlift - 10, reps: 6 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Lat Pulldown"],
          categoryId: categoryIds["Back"],
          sets: [
            logSet({ weight: progress(45, 60, week), reps: 10 }, { weight: "kg" }),
            logSet({ weight: progress(45, 60, week), reps: 9 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Barbell Curl"],
          categoryId: categoryIds["Biceps"],
          sets: [
            logSet({ weight: progress(20, 30, week), reps: 10 }, { weight: "kg" }),
            logSet({ weight: progress(20, 30, week), reps: 9 }, { weight: "kg" })
          ]
        }
      ]
    });

    const squat = progress(80, 102.5, week);
    workouts.push({
      title: "Leg Day",
      date: daysAgo(base + 3),
      exercises: [
        {
          exerciseId: exerciseIds["Barbell High Bar Squat"],
          categoryId: categoryIds["Legs"],
          sets: [
            logSet({ weight: squat, reps: 6 }, { weight: "kg" }),
            logSet({ weight: squat, reps: 6 }, { weight: "kg" }),
            logSet({ weight: squat, reps: 5 }, { weight: "kg" }),
            logSet({ weight: squat - 10, reps: 8 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Romanian Deadlift"],
          categoryId: categoryIds["Legs"],
          sets: [
            logSet({ weight: progress(50, 70, week), reps: 10 }, { weight: "kg" }),
            logSet({ weight: progress(50, 70, week), reps: 9 }, { weight: "kg" })
          ]
        },
        {
          exerciseId: exerciseIds["Leg Extension"],
          categoryId: categoryIds["Legs"],
          sets: [
            logSet({ weight: progress(35, 45, week), reps: 12 }, { weight: "kg" }),
            logSet({ weight: progress(35, 45, week), reps: 11 }, { weight: "kg" })
          ]
        }
      ]
    });

    workouts.push({
      title: "Cardio",
      date: daysAgo(base + 1),
      exercises: [
        {
          exerciseId: exerciseIds["Running"],
          categoryId: categoryIds["Cardio"],
          sets: [
            logSet(
              {
                distance: progress(3000, 5500, week),   // meters (was km)
                duration: progress(1320, 1800, week)    // seconds (was minutes)
              },
              { distance: "km", duration: "min" }
            )
          ]
        }
      ]
    });
  }

  return workouts;
}

module.exports = buildDemoWorkouts;