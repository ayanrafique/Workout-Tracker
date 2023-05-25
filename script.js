document.addEventListener('DOMContentLoaded', initialize);

function initialize(event) {
    const formFields = getFormFields();
    const workoutList = document.getElementById('workoutList');
    let editIndex = null;
    const ADD_WORKOUT_LABEL = 'Add Workout';
    const UPDATE_WORKOUT_LABEL = 'Update Workout';

    loadWorkouts();

    formFields.addWorkoutButton.addEventListener('click', handleAddOrUpdateWorkout);

    function getFormFields() {
        return {
            exerciseSelect: document.getElementById('exercise'),
            repsInput: document.getElementById('reps'),
            weightInput: document.getElementById('weight'),
            modifierInput: document.getElementById('modifier'),
            setsInput: document.getElementById('sets'),
            rpeInput: document.getElementById('rpe'),
            addWorkoutButton: document.getElementById('addWorkout'),
        }
    }

    function loadWorkouts() {
        const workouts = getWorkoutsFromLocalStorage();
        workouts.forEach((workout, index) => {
            const listItem = createWorkoutListItem(workout, index);
            workoutList.appendChild(listItem);
        });
    }

    function getWorkoutsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('workouts') || '[]');
    }

    function createWorkoutListItem(workout, index) {
        const listItem = document.createElement('li');
        listItem.textContent = getWorkoutText(workout);

        const deleteButton = createDeleteButton(index, listItem);
        listItem.appendChild(deleteButton);

        const editButton = createEditButton(workout, index);
        listItem.appendChild(editButton);

        return listItem;
    }

    function getWorkoutText(workout) {
        return `Exercise: ${workout.exercise}, Reps: ${workout.reps}, Weight: ${workout.weight}, Modifier: ${workout.modifier}, Sets: ${workout.sets}, RPE: ${workout.rpe}, Date: ${workout.date}`;
    }

    function createDeleteButton(index, listItem) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteWorkout(index, listItem));
        return deleteButton;
    }

    function deleteWorkout(index, listItem) {
        const workouts = getWorkoutsFromLocalStorage();
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        workoutList.removeChild(listItem);
    }

    function createEditButton(workout, index) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editWorkout(workout, index));
        return editButton;
    }

    function editWorkout(workout, index) {
        formFields.exerciseSelect.value = workout.exercise;
        formFields.repsInput.value = String(workout.reps);
        formFields.weightInput.value = String(workout.weight);
        formFields.modifierInput.value = workout.modifier;
        formFields.setsInput.value = String(workout.sets);
        formFields.rpeInput.value = String(workout.rpe);
        editIndex = index;
        formFields.addWorkoutButton.value = UPDATE_WORKOUT_LABEL;
    }

    function handleAddOrUpdateWorkout() {
        const workout = getWorkoutFromForm();
        const workouts = getWorkoutsFromLocalStorage();
        
        if (editIndex !== null) {
            updateWorkout(workout, workouts);
        }
        else {
            addWorkout(workout, workouts);
        }

        resetFormFields();
        workoutList.innerHTML = '';
        loadWorkouts();
    }

    function getWorkoutFromForm() {
        return {
            exercise: formFields.exerciseSelect.value,
            reps: Number(formFields.repsInput.value),
            weight: Number(formFields.weightInput.value),
            modifier: formFields.modifierInput.value,
            sets: Number(formFields.setsInput.value),
            rpe: Number(formFields.rpeInput.value),
            date: new Date().toLocaleDateString(),
        };
    }

    function updateWorkout(workout, workouts) {
        workouts[editIndex] = workout;
        editIndex = null;
        formFields.addWorkoutButton.value = ADD_WORKOUT_LABEL;
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    function addWorkout(workout, workouts) {
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    function resetFormFields() {
        formFields.repsInput.value = '';
        formFields.weightInput.value = '';
        formFields.modifierInput.value = '';
        formFields.setsInput.value = '';
        formFields.rpeInput.value = '';
    }
}
