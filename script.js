document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    const uiElements = {
        formFields: getFormFields(),
        workoutList: document.getElementById('workoutList'),
        chartExerciseSelect: document.getElementById('chartExercise'),
        generateChartButton: document.getElementById('generateChart'),
        personalRecordsDiv: document.getElementById('personalRecords'),
        myChart: document.getElementById('myChart'),
    };
    
    const state = {
        editIndex: null,
        chart: null,
    };

    const labels = {
        ADD_WORKOUT: 'Add Workout',
        UPDATE_WORKOUT: 'Update Workout',
    };

    const workoutHandler = new WorkoutHandler(uiElements, state, labels);
    workoutHandler.initialize();
}

function getFormFields() {
    return {
        exerciseSelect: document.getElementById('exercise'),
        repsInput: document.getElementById('reps'),
        weightInput: document.getElementById('weight'),
        modifierInput: document.getElementById('modifier'),
        setsInput: document.getElementById('sets'),
        rpeInput: document.getElementById('rpe'),
        addWorkoutButton: document.getElementById('addWorkout'),
    };
}

class WorkoutHandler {
    constructor(uiElements, state, labels) {
        this.uiElements = uiElements;
        this.state = state;
        this.labels = labels;
    }

    initialize() {
        this.loadWorkouts();
        this.updatePersonalRecordsAll();
        this.uiElements.formFields.addWorkoutButton.addEventListener('click', () => this.handleAddOrUpdateWorkout());
        this.uiElements.generateChartButton.addEventListener('click', () => this.generateChart());
    }

    loadWorkouts() {
        const workouts = this.getWorkoutsFromLocalStorage();
        workouts.forEach((workout, index) => {
            const listItem = this.createWorkoutListItem(workout, index);
            this.uiElements.workoutList.appendChild(listItem);
        });
    }

    getWorkoutsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('workouts') || '[]');
    }

    createWorkoutListItem(workout, index) {
        const listItem = document.createElement('li');
        listItem.textContent = this.getWorkoutText(workout);

        const deleteButton = this.createDeleteButton(index, listItem);
        listItem.appendChild(deleteButton);

        const editButton = this.createEditButton(workout, index);
        listItem.appendChild(editButton);

        return listItem;
    }

    getWorkoutText(workout) {
        return `Exercise: ${workout.exercise}, Reps: ${workout.reps}, Weight: ${workout.weight}, Modifier: ${workout.modifier}, Sets: ${workout.sets}, RPE: ${workout.rpe}, Date: ${workout.date}`;
    }

    createDeleteButton(index, listItem) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.deleteWorkout(index, listItem));
        return deleteButton;
    }

    deleteWorkout(index, listItem) {
        const workouts = this.getWorkoutsFromLocalStorage();
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        this.uiElements.workoutList.removeChild(listItem);
    }

    createEditButton(workout, index) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => this.editWorkout(workout, index));
        return editButton;
    }

    editWorkout(workout, index) {
        this.uiElements.formFields.exerciseSelect.value = workout.exercise;
        this.uiElements.formFields.repsInput.value = String(workout.reps);
        this.uiElements.formFields.weightInput.value = String(workout.weight);
        this.uiElements.formFields.modifierInput.value = workout.modifier;
        this.uiElements.formFields.setsInput.value = String(workout.sets);
        this.uiElements.formFields.rpeInput.value = String(workout.rpe);
        this.state.editIndex = index;
        this.uiElements.formFields.addWorkoutButton.value = this.labels.UPDATE_WORKOUT;
    }

    handleAddOrUpdateWorkout() {
        const workout = this.getWorkoutFromForm();
        const workouts = this.getWorkoutsFromLocalStorage();

        if (this.state.editIndex !== null) {
            this.updateWorkout(workout, workouts);
        } else {
            this.addWorkout(workout, workouts);
        }

        this.updatePersonalRecords(workout);
        this.uiElements.formFields.addWorkoutButton.value = this.labels.ADD_WORKOUT;
    }

    getWorkoutFromForm() {
        return {
            exercise: this.uiElements.formFields.exerciseSelect.value,
            reps: Number(this.uiElements.formFields.repsInput.value),
            weight: Number(this.uiElements.formFields.weightInput.value),
            modifier: this.uiElements.formFields.modifierInput.value,
            sets: Number(this.uiElements.formFields.setsInput.value),
            rpe: Number(this.uiElements.formFields.rpeInput.value),
            date: new Date().toISOString().split('T')[0],
        };
    }

    updateWorkout(workout, workouts) {
        workouts[this.state.editIndex] = workout;
        localStorage.setItem('workouts', JSON.stringify(workouts));
        this.uiElements.workoutList.replaceChild(this.createWorkoutListItem(workout, this.state.editIndex), this.uiElements.workoutList.childNodes[this.state.editIndex]);
        this.state.editIndex = null;
    }

    addWorkout(workout, workouts) {
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        const listItem = this.createWorkoutListItem(workout, workouts.length - 1);
        this.uiElements.workoutList.appendChild(listItem);
    }

    updatePersonalRecordsAll() {
        const workouts = this.getWorkoutsFromLocalStorage();
        const personalRecords = {};

        workouts.forEach(workout => {
            if (!personalRecords[workout.exercise] || personalRecords[workout.exercise].weight < workout.weight) {
                personalRecords[workout.exercise] = workout;
            }
        });

        localStorage.setItem('personalRecords', JSON.stringify(personalRecords));
        this.displayPersonalRecords();
    }

    displayPersonalRecords() {
        const personalRecords = JSON.parse(localStorage.getItem('personalRecords') || '{}');
        this.uiElements.personalRecordsDiv.textContent = '';

        for (const exercise in personalRecords) {
            const record = personalRecords[exercise];
            const recordDiv = document.createElement('div');
            recordDiv.textContent = this.getWorkoutText(record);
            this.uiElements.personalRecordsDiv.appendChild(recordDiv);
        }
    }

    generateChart() {
        if (this.state.chart !== null) {
            this.state.chart.destroy();
        }

        const selectedExercise = this.uiElements.chartExerciseSelect.value;
        const workouts = this.getWorkoutsFromLocalStorage().filter(workout => workout.exercise === selectedExercise);
        const dates = workouts.map(workout => workout.date);
        const weights = workouts.map(workout => workout.weight);
        const reps = workouts.map(workout => workout.reps);

        const ctx = this.uiElements.myChart.getContext('2d');
        this.state.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Weight',
                        data: weights,
                        borderColor: 'rgb(75, 192, 192)',
                        yAxisID: 'y',
                    },
                    {
                        label: 'Reps',
                        data: reps,
                        borderColor: 'rgb(255, 99, 132)',
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    y1: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
