'use strict';



// WORKOUT CLASS AND CHILDREN

class Workout {
    date = new Date();
    clicks = 0;
    id = (Date.now() + "").slice(-7)

    constructor(coords, distance, duration) {
        this.coords = coords;   //[lat/ lng]
        this.distance = distance; // in km
        this.duration = duration; // in minutes
    }

    _setDescription() {
        // prettier-ignore
        const cap = function(string) {
            return string[0].toUpperCase() + string.slice(1);
        }
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${cap(this.type)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

class Running extends Workout {
    type = "running";

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calPace();
        this._setDescription();
    }

    

    calPace() {
        //min\km
        this.pace = (this.duration / this.distance).toFixed(2);
        return this.pace;
    }
}
class Cycling extends Workout {
    type = "cycling";


    constructor(coords, distance, duration, eGain) {
        super(coords, distance, duration);
        this.eGain = eGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        // Km / hr
        this.speed = (this.distance / (this.duration/60)).toFixed(2);
        return this.speed;
    }
}

// //////////////////////////////////////////////\


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const workoutsArea = document.querySelector(".workouts");


// Application Architecture
// APP CLASS
class App {
    #map;
    #mapEvent;
    #markers = [];
    #mapzoomLevel = 13;
    #workouts = [];
    constructor() {
        
        // Get users position
        this._getPosition();

        // get data from localStorage
        this._getLocalStorage();

        // EVENT HANDLERS
        form.addEventListener("submit", this._newWorkout.bind(this)); 
        inputType.addEventListener("change", this._toggleElevationField);
        workoutsArea.addEventListener("click", this._moveTomarker.bind(this));

    }

    _getPosition(){
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                alert("Could not get your position")
            });

    }

    _loadMap(position) {
        const {latitude, longitude} = position.coords;
        const coords = [latitude, longitude]

        this.#map = L.map('map').setView(coords, this.#mapzoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

        this.#workouts?.forEach(workout => this._renderWorkoutMarker(workout))
        this.#map.on("click", this._showForm.bind(this));
    }
    
    _showForm(mapE) {
    // Handling Clicks on Map
        this.#mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
    }

    _hideForm() {
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = "";
        form.style.display = "none";
        form.classList.add("hidden");
        setTimeout(() => form.style.display = "grid", 1000)
        ;
    }

    _toggleElevationField() {
        inputCadence.parentNode.classList.toggle("form__row--hidden");
        inputElevation.parentNode.classList.toggle("form__row--hidden");
    }

    _newWorkout(e) {
        
        const validInputs = (...inputs) => {
            const valid = inputs.every(inp => Number.isFinite(inp))
                return valid;
            }

        const isPositive = (...inputs) => {
            const positive = inputs.every(inp => inp > 0);
            return positive;
        }

        e.preventDefault();

        // Get data from form
        const type  = inputType.value;
        const distance = +inputDistance.value;
        const duartion = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;

        // If Running create Running Object
        if(type == "running") {
            const cadence =  +inputCadence.value;


            if( 
                !validInputs(distance, duartion, cadence) || 
                !isPositive(distance, duartion, cadence)) {
                return alert("Inputs have to be positive") 
            }

            workout = new Running([lat, lng], distance, duartion, cadence);
            
        }

        // If Cycling, create Cycling Object
        if(type == "cycling") {
            const elevation = +inputElevation.value;
            if((!validInputs(distance, duartion, elevation)) || 
            (!isPositive(distance, duartion))) {
                return alert("Inputs have to be positive") 
            }
            
            workout = new Cycling([lat, lng], distance, duartion, elevation);

        }
        

        
        // Add new Object to workout Array
        this.#workouts.push(workout);

        // Render workout on list
        this._renderWorkout(workout)
    
        // Display Marker
        this._renderWorkoutMarker(workout);

        // Clear input fields
        
        // Hide form and clear Input fields
        
        this._hideForm();

        this._setLocalStorage();
    }

    _renderWorkoutMarker(workout) {
        const [lat, lng] = workout.coords;
        this.#markers[`${lat}-${lng}`] = L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
        }))
        .setPopupContent(`${workout.type == "running"? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`)
        .openPopup();
    }

    _renderWorkout(workout) {
        let workoutHTML = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description} <span class="close__btn">&#x2715</span></h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type == "running"? "🏃‍♂️" : "🚴‍♀️"}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>`;


        if(workout.type == "running") {
            workoutHTML += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        }
        if(workout.type == "cycling") {
            workoutHTML += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.eGain}</span>
                <span class="workout__unit">m</span>
            </div>
        </li>`
        }

        form.insertAdjacentHTML("afterend", workoutHTML);
        
        const workoutNode = document.querySelector(`.workout--${workout.type}`);
        let closeBtn = workoutNode.querySelector(".close__btn");
        closeBtn.addEventListener("click", this._deleteWorkout.bind(this, workout))

    }

    _moveTomarker(e) {
        const workout = e.target.closest(".workout");
        if(!workout) return;
        const workId = workout.dataset.id;
        const workoutValue = this.#workouts.find(workout => workout.id == workId);
        if(!workoutValue) return;
        this.#map.setView(workoutValue.coords, this.#mapzoomLevel, {
            animate: true,
            pan: {duration: 0.8}
        });
    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        
        const data = JSON.parse(localStorage.getItem('workouts'));
        if(!data) return;
        this.#workouts = data;
        this.#workouts.forEach((workout => {
            this._renderWorkout(workout);
        }))
    }
    _deleteWorkout(workout) {
        // REMOVE MARKER
        const [lat, lng] = workout.coords;
        this.#markers[`${lat}-${lng}`].remove();

        // REMOVE WORKOUT FROM ARRAY
        const index = this.#workouts.findIndex((workO) => {
           return +workO.id == +workout.id
        });
        
        this.#workouts.splice(index, 1);

        // REMOVE WORKOUT FROM SIDE BAR STUFF
        document.querySelector(`[data-id="${workout.id}"]`).style.display = "none";

        // UPDATE LOCAL STORAGE
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }
    reset() {
        this.#workouts = [];
        localStorage.removeItem('workouts');
        location.reload();
    }
}
const app = new App();