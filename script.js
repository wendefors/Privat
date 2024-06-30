document.addEventListener("DOMContentLoaded", function() {
    const weeks = [27, 28, 29, 30, 31];
    const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
    const lunchTime = { start: '113000', end: '123000' };
    const dinnerTime = { start: '173000', end: '183000' };

    async function loadMeals() {
        const response = await fetch('meals.json');
        const data = await response.json();
        console.log(data);
        return data;
    }

    function saveSelections() {
        const weeks = document.querySelectorAll('.week');
        weeks.forEach((week, weekIndex) => {
            const selects = week.querySelectorAll('select');
            const textareas = week.querySelectorAll('textarea');

            selects.forEach((select, selectIndex) => {
                localStorage.setItem(`week${weekIndex}_select${selectIndex}`, select.value);
            });

            textareas.forEach((textarea, textareaIndex) => {
                localStorage.setItem(`week${weekIndex}_textarea${textareaIndex}`, textarea.value);
            });
        });
    }

    function loadSelections() {
        const weeks = document.querySelectorAll('.week');
        weeks.forEach((week, weekIndex) => {
            const selects = week.querySelectorAll('select');
            const textareas = week.querySelectorAll('textarea');

            selects.forEach((select, selectIndex) => {
                const savedValue = localStorage.getItem(`week${weekIndex}_select${selectIndex}`);
                if (savedValue !== null) {
                    select.value = savedValue;
                }
            });

            textareas.forEach((textarea, textareaIndex) => {
                const savedValue = localStorage.getItem(`week${weekIndex}_textarea${textareaIndex}`);
                if (savedValue !== null) {
                    textarea.value = savedValue;
                }
            });
        });
    }

    function createICalEvent(title, date, startTime, endTime) {
        const icsFormat = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${date}T${startTime}
DTEND:${date}T${endTime}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsFormat], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.ics`;
        link.click();
    }

    function addICalButtons() {
        const weeks = [27, 28, 29, 30, 31];
        const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
        const lunchTime = { start: '113000', end: '123000' };
        const dinnerTime = { start: '173000', end: '183000' };

        weeks.forEach((week, weekIndex) => {
            days.forEach((day, dayIndex) => {
                const date = new Date(2024, 6, (week - 27) * 7 + dayIndex + 2).toISOString().slice(0, 10).replace(/-/g, '');
                const weekElement = document.getElementById(`week-${week}`);
                const rows = weekElement.querySelectorAll('tr');

                const lunchSelect = rows[dayIndex + 1].querySelector('.lunch-dropdown');
                const dinnerSelect = rows[dayIndex + 1].querySelector('.dinner-dropdown');

                const lunchButton = document.createElement('button');
                lunchButton.innerText = 'Lägg till i kalendern';
                lunchButton.onclick = () => createICalEvent(lunchSelect.value, date, lunchTime.start, lunchTime.end);
                lunchSelect.parentElement.appendChild(lunchButton);

                const dinnerButton = document.createElement('button');
                dinnerButton.innerText = 'Lägg till i kalendern';
                dinnerButton.onclick = () => createICalEvent(dinnerSelect.value, date, dinnerTime.start, dinnerTime.end);
                dinnerSelect.parentElement.appendChild(dinnerButton);
            });
        });
    }

    function createTable(week) {
        let table = `<div id="week-${week}" class="week hidden">
            <h2>Vecka ${week}</h2>
            <table>
                <tr>
                    <th>Dag</th>
                    <th>Lunch</th>
                    <th>Middag</th>
                </tr>`;

        days.forEach(day => {
            table += `<tr>
                <td>${day}</td>
                <td>
                    <select class="lunch-dropdown"></select>
                    <textarea placeholder="Kommentarer"></textarea>
                </td>
                <td>
                    <select class="dinner-dropdown"></select>
                    <textarea placeholder="Kommentarer"></textarea>
                </td>
            </tr>`;
        });

        table += `</table></div>`;
        return table;
    }

    function showWeek(week) {
        document.querySelectorAll('.week').forEach(weekTable => {
            weekTable.classList.add('hidden');
        });
        document.getElementById(`week-${week}`).classList.remove('hidden');
    }

    async function init() {
        const meals = await loadMeals();
        weeks.forEach(week => {
            document.body.insertAdjacentHTML('beforeend', createTable(week));
        });
        populateDropdowns(meals.lunchOptions, meals.dinnerOptions);
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
