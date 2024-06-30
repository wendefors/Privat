document.addEventListener("DOMContentLoaded", function() {
    const weeks = [27, 28, 29, 30, 31];
    const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
    const lunchTime = { start: '113000', end: '123000' };
    const dinnerTime = { start: '173000', end: '183000' };

    async function loadMeals() {
        const response = await fetch('meals.json');
        const data = await response.json();
        return data;
    }

    function saveSelections() {
        // Samma kod som tidigare
    }

    function loadSelections() {
        // Samma kod som tidigare
    }

    function createICalEvent(title, date, startTime, endTime) {
        // Samma kod som tidigare
    }

    function addICalButtons() {
        // Samma kod som tidigare
    }

    function createTable(week) {
        // Samma kod som tidigare
    }

    function showWeek(week) {
        // Samma kod som tidigare
    }

    async function init() {
        const meals = await loadMeals();
        populateDropdowns(meals.lunchOptions, meals.dinnerOptions);
        weeks.forEach(week => {
            document.body.insertAdjacentHTML('beforeend', createTable(week));
        });
        document.getElementById('week').addEventListener('change', function() {
            showWeek(this.value);
        });
        addICalButtons();
        loadSelections();
        showWeek(27);
    }

    function populateDropdowns(lunchOptions, dinnerOptions) {
        document.querySelectorAll('.lunch-dropdown').forEach(dropdown => {
            lunchOptions.forEach(option => {
                let opt = document.createElement('option');
                opt.value = option;
                opt.innerHTML = option;
                dropdown.appendChild(opt);
            });
        });

        document.querySelectorAll('.dinner-dropdown').forEach(dropdown => {
            dinnerOptions.forEach(option => {
                let opt = document.createElement('option');
                opt.value = option;
                opt.innerHTML = option;
                dropdown.appendChild(opt);
            });
        });
    }

    init();
});
