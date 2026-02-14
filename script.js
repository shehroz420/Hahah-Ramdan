const tableBody = document.querySelector("#ramadan-table tbody");
const countdown = document.getElementById("countdown");
const currentStatus = document.getElementById("current-status");
const nextPrayer = document.getElementById("next-prayer");
const modeToggle = document.getElementById("mode-toggle");

let timings = {};

// Load JSON timings
fetch("timings.json")
.then(res => res.json())
.then(data => {
    timings = data;
    populateTable();
    startCountdown();
})
.catch(err => {
    console.error(err);
    currentStatus.textContent = "Error loading timings";
});

modeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
});

function populateTable() {
    tableBody.innerHTML = "";
    for(let i=1;i<=30;i++){
        const day = i.toString();
        tableBody.innerHTML += `<tr>
            <td>${day}</td>
            <td>${timings[day].sehri}</td>
            <td>${timings[day].iftar}</td>
        </tr>`;
    }
}

function startCountdown(){
    setInterval(()=>{
        const now = new Date();
        const today = now.getDate();
        const todayTiming = timings[today.toString()];
        if(!todayTiming) return;

        const sehriParts = todayTiming.sehri.split(":").map(Number);
        const iftarParts = todayTiming.iftar.split(":").map(Number);

        const sehriTime = new Date();
        sehriTime.setHours(sehriParts[0], sehriParts[1], 0, 0);

        const iftarTime = new Date();
        iftarTime.setHours(iftarParts[0], iftarParts[1], 0, 0);

        let targetTime, status;
        if(now < sehriTime){
            targetTime = sehriTime;
            status = "Sehri in";
        } else if(now < iftarTime){
            targetTime = iftarTime;
            status = "Iftar in";
        } else {
            // Next day
            const nextDay = today+1;
            const nextTiming = timings[nextDay.toString()] || timings["1"];
            const nextSehriParts = nextTiming.sehri.split(":").map(Number);
            targetTime = new Date();
            targetTime.setDate(now.getDate()+1);
            targetTime.setHours(nextSehriParts[0], nextSehriParts[1],0,0);
            status = "Sehri in";
        }

        const diff = targetTime - now;
        const hours = Math.floor(diff/1000/60/60);
        const minutes = Math.floor((diff/1000/60)%60);
        const seconds = Math.floor((diff/1000)%60);

        countdown.textContent = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
        currentStatus.textContent = status;
        nextPrayer.textContent = `Next: ${targetTime.toLocaleTimeString('en-PK',{hour12:false})}`;
    },1000);
                                          }
