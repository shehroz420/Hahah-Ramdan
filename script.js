const apiURL = "https://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=2";
const countdown = document.getElementById("countdown");
const currentStatus = document.getElementById("current-status");
const nextPrayer = document.getElementById("next-prayer");
const tableBody = document.querySelector("#ramadan-table tbody");
const modeToggle = document.getElementById("mode-toggle");

let timings = [];

// Dark / Light Mode
modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Fetch Timings
async function fetchTimings() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        const todayTimings = data.data.timings;
        const monthTimings = data.data.meta;
        
        // Store today's Sehri & Iftar
        timings = {
            sehri: todayTimings.Fajr,
            iftar: todayTimings.Maghrib
        };

        // Populate table (optional: just today for simplicity)
        tableBody.innerHTML = "";
        for (let i = 1; i <= 30; i++) {
            tableBody.innerHTML += `<tr>
                <td>${i}</td>
                <td>${timings.sehri}</td>
                <td>${timings.iftar}</td>
            </tr>`;
        }

        startCountdown();
    } catch (err) {
        console.error(err);
        currentStatus.textContent = "Error fetching timings";
    }
}

// Countdown
function startCountdown() {
    setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentSec = now.getSeconds();

        const sehriTime = new Date();
        const [sehriH, sehriM] = timings.sehri.split(":").map(Number);
        sehriTime.setHours(sehriH, sehriM, 0);

        const iftarTime = new Date();
        const [iftarH, iftarM] = timings.iftar.split(":").map(Number);
        iftarTime.setHours(iftarH, iftarM, 0);

        let targetTime;
        let statusText;

        if (now < sehriTime) {
            targetTime = sehriTime;
            statusText = "Sehri in";
        } else if (now < iftarTime) {
            targetTime = iftarTime;
            statusText = "Iftar in";
        } else {
            // Next day
            targetTime = new Date(sehriTime.getTime() + 24*60*60*1000);
            statusText = "Sehri in";
        }

        const diff = targetTime - now;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdown.textContent = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
        currentStatus.textContent = statusText;
        nextPrayer.textContent = `Next: ${targetTime.toLocaleTimeString()}`;
    }, 1000);
}

// Init
fetchTimings();
