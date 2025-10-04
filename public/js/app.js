async function loadScores() {
  const res = await fetch("/api/scores");
  const data = await res.json();
  document.getElementById("scoresData").innerHTML = data.data
    .map(
      (g) => `<p><strong>${g.team1}</strong> vs <strong>${g.team2}</strong>: ${g.score}</p>`
    )
    .join("");
}

async function loadNews() {
  const res = await fetch("/api/news");
  const data = await res.json();
  document.getElementById("newsData").innerHTML = data.data
    .map((n) => `<p>${n.title} <em>(${n.source})</em></p>`)
    .join("");
}

loadScores();
loadNews();
