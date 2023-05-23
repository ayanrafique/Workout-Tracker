document.addEventListener('DOMContentLoaded', function (event) {
    var exerciseSelect = document.getElementById('exercise');
    var repsInput = document.getElementById('reps');
    var weightInput = document.getElementById('weight');
    var modifierInput = document.getElementById('modifier');
    var setsInput = document.getElementById('sets');
    var addWorkoutButton = document.getElementById('addWorkout');
    var workoutList = document.getElementById('workoutList');
    var editIndex = null;
    var loadWorkouts = function () {
        var workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        var createWorkoutListItem = function (workout, index) {
            var listItem = document.createElement('li');
            listItem.textContent = "Exercise: ".concat(workout.exercise, ", Reps: ").concat(workout.reps, ", Weight: ").concat(workout.weight, ", Modifier: ").concat(workout.modifier, ", Sets: ").concat(workout.sets, ", Date: ").concat(workout.date);
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                workouts.splice(index, 1);
                localStorage.setItem('workouts', JSON.stringify(workouts));
                workoutList.removeChild(listItem);
            });
            listItem.appendChild(deleteButton);
            var editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                exerciseSelect.value = workout.exercise;
                repsInput.value = String(workout.reps);
                weightInput.value = String(workout.weight);
                modifierInput.value = workout.modifier;
                setsInput.value = String(workout.sets);
                editIndex = index;
                addWorkoutButton.value = 'Update Workout';
            });
            listItem.appendChild(editButton);
            return listItem;
        };
        workouts.forEach(function (workout, index) {
            var listItem = createWorkoutListItem(workout, index);
            workoutList.appendChild(listItem);
        });
    };
    addWorkoutButton.addEventListener('click', function () {
        var exercise = exerciseSelect.value;
        var reps = Number(repsInput.value);
        var weight = Number(weightInput.value);
        var modifier = modifierInput.value;
        var sets = Number(setsInput.value);
        var date = new Date().toLocaleDateString();
        var workout = { exercise: exercise, reps: reps, weight: weight, modifier: modifier, sets: sets, date: date };
        var workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        if (editIndex !== null) {
            workouts[editIndex] = workout;
            editIndex = null;
            addWorkoutButton.value = 'Add Workout';
        }
        else {
            workouts.push(workout);
        }
        localStorage.setItem('workouts', JSON.stringify(workouts));
        repsInput.value = '';
        weightInput.value = '';
        modifierInput.value = '';
        setsInput.value = '';
        workoutList.innerHTML = '';
        loadWorkouts();
    });
    loadWorkouts();
});
