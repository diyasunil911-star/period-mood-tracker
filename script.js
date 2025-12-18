function savePeriod() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const flow = document.getElementById("flow").value;

  if (!start || !end) {
    document.getElementById("status").innerText = "⚠️ Please select both dates";
    return;
  }

  const periodData = {
    startDate: start,
    endDate: end,
    flow: flow
  };

  localStorage.setItem("periodData", JSON.stringify(periodData));

  document.getElementById("status").innerText = "✅ Period data saved successfully!";
}
let selectedMood = "";

function selectMood(mood) {
  selectedMood = mood;
  document.getElementById("moodStatus").innerText = "Selected: " + mood;
}

function saveMood() {
  const date = document.getElementById("moodDate").value;
  const notes = document.getElementById("notes").value;

  if (!date || !selectedMood) {
    document.getElementById("moodStatus").innerText = "⚠️ Please select date & mood";
    return;
  }

  const moodEntry = {
    date: date,
    mood: selectedMood,
    notes: notes
  };

  let moods = JSON.parse(localStorage.getItem("moodData")) || [];
  moods.push(moodEntry);

  localStorage.setItem("moodData", JSON.stringify(moods));

  document.getElementById("moodStatus").innerText = "✅ Mood saved!";
}

function loadInsights() {
  const moods = JSON.parse(localStorage.getItem("moodData")) || [];
  const period = JSON.parse(localStorage.getItem("periodData"));

  // Mood summary
  if (moods.length === 0) {
    document.getElementById("moodSummary").innerText = "No mood data yet.";
  } else {
    let moodCount = {};
    moods.forEach(m => {
      moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
    });

    let mostCommonMood = Object.keys(moodCount).reduce((a, b) =>
      moodCount[a] > moodCount[b] ? a : b
    );

    let insightText = "";

if (mostCommonMood === "Happy") {
  insightText = "🌸 You tend to feel emotionally balanced lately. Keep nurturing what makes you happy.";
} else if (mostCommonMood === "Sad") {
  insightText = "💗 You’ve had more low days recently. Gentle self-care and rest may help.";
} else if (mostCommonMood === "Tired") {
  insightText = "😴 Your data suggests fatigue. Make sure you’re getting enough rest.";
} else if (mostCommonMood === "Angry") {
  insightText = "🔥 Emotional intensity detected. Journaling or breathing exercises might help.";
} else {
  insightText = "🌿 Your moods appear fairly stable overall.";
}

document.getElementById("moodInsight").innerText = insightText;
document.getElementById("moodSummary").classList.remove("loading");
  }

  // Period info
  if (!period) {
    document.getElementById("periodInfo").innerText =
      "No period data saved.";
  } else {
    document.getElementById("periodInfo").innerText =
      `Last period: ${period.startDate} to ${period.endDate} (Flow: ${period.flow})`;
  }
}

// Auto-load insights page
if (window.location.pathname.includes("insights.html")) {
  loadInsights();
}

function loadCalendar() {
  const calendarDiv = document.getElementById("calendar");
  if (!calendarDiv) return;

  const period = JSON.parse(localStorage.getItem("periodData"));
  const moods = JSON.parse(localStorage.getItem("moodData")) || [];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "<div class='calendar-grid'>";

  // Empty slots before month starts
  for (let i = 0; i < firstDay; i++) {
    html += "<div class='empty'></div>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let classes = "day";

    // Highlight period days
    if (period) {
      if (dateStr >= period.startDate && dateStr <= period.endDate) {
        classes += " period-day";
      }
    }

    // Highlight mood days
    const moodForDay = moods.find(m => m.date === dateStr);
    html += `<div class="${classes}">
              ${day}
              <div class="mood-icon">${moodForDay ? getMoodEmoji(moodForDay.mood) : ""}</div>
            </div>`;
  }

  html += "</div>";
  calendarDiv.innerHTML = html;
}

function getMoodEmoji(mood) {
  const map = {
    Happy: "😊",
    Neutral: "😐",
    Sad: "😔",
    Angry: "😡",
    Tired: "😴"
  };
  return map[mood] || "";
}

if (window.location.pathname.includes("calendar.html")) {
  loadCalendar();
}



