const scoresContainer = document.getElementById("scores");
const newsContainer = document.getElementById("news");

// Fetch and display scores
async function fetchScores() {
  try {
    const response = await fetch("/api/scores");
    const scores = await response.json();
    scoresContainer.innerHTML = scores
      .map(
        (s) => `
        <div class="score-card">
          <h3>${s.team} vs ${s.opponent}</h3>
          <p>Score: ${s.score}</p>
          <small>${new Date(s.date).toLocaleString()}</small>
        </div>`
      )
      .join("");
  } catch {
    scoresContainer.innerHTML = "<p>Error loading scores</p>";
  }
}

// Fetch and display news
async function fetchNews() {
  try {
    const response = await fetch("/api/news");
    const newsList = await response.json();
    newsContainer.innerHTML = newsList
      .map(
        (n) => `
        <div class="news-card">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          <small>Source: ${n.source} | ${new Date(n.date).toLocaleString()}</small>
        </div>`
      )
      .join("");
  } catch {
    newsContainer.innerHTML = "<p>Error loading news</p>";
  }
}

// Add new score
document.getElementById("scoreForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const team = team.value.trim();
  const opponent = opponent.value.trim();
  const score = scoreInput.value.trim();
  if (!team || !opponent || !score) return alert("All fields required!");
  await fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team, opponent, score }),
  });
  e.target.reset();
  fetchScores();
});

// Add new news
document.getElementById("newsForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const source = sourceInput.value.trim();
  if (!title || !content || !source) return alert("All fields required!");
  await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, source }),
  });
  e.target.reset();
  fetchNews();
});

// Load data initially
fetchScores();
fetchNews();
