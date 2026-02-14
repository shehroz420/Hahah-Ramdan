const tableBody = document.querySelector("#ramadan-table tbody");
const countdown = document.getElementById("countdown");
const currentStatus = document.getElementById("current-status");
const nextPrayer = document.getElementById("next-prayer");
const modeToggle = document.getElementById("mode-toggle");

// Karachi Ramadan 2026 timings
const timings = {
  "1":{"sehri":"04:33","iftar":"18:18"},
  "2":{"sehri":"04:32","iftar":"18:18"},
  "3":{"sehri":"04:31","iftar":"18:18"},
  "4":{"sehri":"04:30","iftar":"18:19"},
  "5":{"sehri":"04:29","iftar":"18:19"},
  "6":{"sehri":"04:28","iftar":"18:19"},
  "7":{"sehri":"04:27","iftar":"18:20"},
  "8":{"sehri":"04:26","iftar":"18:20"},
  "9":{"sehri":"04:25","iftar":"18:20"},
  "10":{"sehri":"04:24","iftar":"18:21"},
  "11":{"sehri":"04:23","iftar":"18:21"},
  "12":{"sehri":"04:22","iftar":"18:21"},
  "13":{"sehri":"04:21","iftar":"18:22"},
  "14":{"sehri":"04:20","iftar":"18:22"},
  "15":{"sehri":"04:19","iftar":"18:22"},
  "16":{"sehri":"04:18","iftar":"18:23"},
  "17":{"sehri":"04:17","iftar":"18:23"},
  "18":{"sehri":"04:16","iftar":"18:23"},
  "19":{"sehri":"04:15","iftar":"18:24"},
  "20":{"sehri":"04:14","iftar":"18:24"},
  "21":{"sehri":"04:13","iftar":"18:24"},
  "22":{"sehri":"04:12","iftar":"18:25"},
  "23":{"sehri":"04:11","iftar":"18:25"},
  "24":{"sehri":"04:10","iftar":"18:25"},
  "25":{"sehri":"04:09","iftar":"18:26"},
  "26":{"sehri":"04:08","iftar":"18:26"},
  "27":{"sehri":"04:07","iftar":"18:26"},
  "28":{"sehri":"04:06","iftar":"18:27"},
  "29":{"sehri":"04:05","iftar":"18:27"},
  "30":{"sehri":"04:04","iftar":"18:27"}
};

// Populate table
for(let day=1; day<=30; day++){
    const d = day.toString();
    tableBody.innerHTML += `<tr>
        <td>${d}</td>
        <td>${timings[d].sehri}</td>
        <td>${timings[d].iftar}</td>
    </tr>`;
}

// Dark/Light Mode
modeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("light");
});

// Countdown
function startCountdown(){
    setInterval(()=>{
        const now = new Date();
        const today = now.getDate() <= 30 ? now.getDate() : 30;
        const todayTiming = timings[today.toString()];
        if(!todayTiming) return;

        const sehriParts = todayTiming.sehri.split(":").map(Number);
        const iftarParts = todayTiming.iftar.split(":").map(Number);

        const sehriTime = new Date();
        sehriTime.setHours(sehriParts[0], sehriParts[1], 0,0);

        const iftarTime = new Date();
        iftarTime.setHours(iftarParts[0], iftarParts[1],0,0);

        let targetTime, status;
        if(now < sehriTime){
            targetTime = sehriTime;
            status = "Sehri in";
        } else if(now < iftarTime){
            targetTime = iftarTime;
            status = "Iftar in";
        } else {
            const nextDay = today<30 ? today+1 : 1;
            const nextTiming = timings[nextDay.toString()];
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

startCountdown();
