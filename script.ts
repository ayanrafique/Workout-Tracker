document.addEventListener('DOMContentLoaded', (event) => {
    const exerciseSelect = document.getElementById('exercise') as HTMLSelectElement;
    const repsInput = document.getElementById('reps') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const modifierInput = document.getElementById('modifier') as HTMLInputElement;
    const setsInput = document.getElementById('sets') as HTMLInputElement;
    const rpeInput = document.getElementById('rpe') as HTMLInputElement;
    const addWorkoutButton = document.getElementById('addWorkout') as HTMLButtonElement;
    const workoutList = document.getElementById('workoutList') as HTMLUListElement;

    let editIndex: number | null = null;

    const loadWorkouts = () => {
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        
        const createWorkoutListItem = (workout, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Exercise: ${workout.exercise}, Reps: ${workout.reps}, Weight: ${workout.weight}, Modifier: ${workout.modifier}, Sets: ${workout.sets}, RPE: ${workout.rpe}, Date: ${workout.date}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                workouts.splice(index, 1);
                localStorage.setItem('workouts', JSON.stringify(workouts));
                workoutList.removeChild(listItem);
            });
            listItem.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                exerciseSelect.value = workout.exercise;
                repsInput.value = String(workout.reps);
                weightInput.value = String(workout.weight);
                modifierInput.value = workout.modifier;
                setsInput.value = String(workout.sets);
                rpeInput.value = String(workout.rpe);
                editIndex = index;
                addWorkoutButton.value = 'Update Workout';
            });
            listItem.appendChild(editButton);

            return listItem;
        };

        workouts.forEach((workout: any, index: number) => {
            const listItem = createWorkoutListItem(workout, index);
            workoutList.appendChild(listItem);
        });
    };

    addWorkoutButton.addEventListener('click', () => {
        const exercise = exerciseSelect.value;
        const reps = Number(repsInput.value);
        const weight = Number(weightInput.value);
        const modifier = modifierInput.value;
        const sets = Number(setsInput.value);
        const rpe = Number(rpeInput.value);
        const date = new Date().toLocaleDateString();

        const workout = { exercise, reps, weight, modifier, sets, rpe, date };
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');

        if (editIndex !== null) {
            workouts[editIndex] = workout;
            editIndex = null;
            addWorkoutButton.value = 'Add Workout';
        } else {
            workouts.push(workout);
        }

        localStorage.setItem('workouts', JSON.stringify(workouts));

        repsInput.value = '';
        weightInput.value = '';
        modifierInput.value = '';
        setsInput.value = '';
        rpeInput.value = '';

        workoutList.innerHTML = '';
        loadWorkouts();
    });

    loadWorkouts();
});
