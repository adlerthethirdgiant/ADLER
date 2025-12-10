/* events.js – Homepage only */

const UPCOMING_EVENTS = [
  {
    id: "race-01",
    date: "Feb 20, 2025",
    time: "7:00 PM",
    teams: "ADLER vs FASTKEYS",
    players: ["Smirks", "Void", "Annelise"],
    rules: [
      "100 WPM warm-up",
      "Screen recording required",
      "Discord call"
    ]
  },
  {
    id: "race-02",
    date: "Feb 27, 2025",
    time: "8:00 PM",
    teams: "ADLER vs TYPERS",
    players: ["TT Sushi", "BugattiChiron"],
    rules: ["No macros", "Live race only"]
  }
];

(function renderEvents(){
  const root = document.getElementById("eventsList");
  if (!root) return;

  UPCOMING_EVENTS.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-title">${ev.teams}</div>
      <div class="event-meta">${ev.date} • ${ev.time}</div>
      <div class="event-players">
        Players: ${ev.players.join(", ")}
      </div>
      <div class="event-rules">
        ${ev.rules.map(r => `<span>${r}</span>`).join(" • ")}
      </div>
    `;

    root.appendChild(card);
  });
})();
