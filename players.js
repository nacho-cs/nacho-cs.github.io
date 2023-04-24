const url = "https://mcsrranked.com/api";
let uuid = "";

if (localStorage.getItem("prefers-light-theme") === "true")
  document.querySelector("html").classList.remove("dark");

document.querySelectorAll(".card").length > 0
  ? document.querySelectorAll(".card").forEach(card => card.classList.add("visually-hidden"))
  : "";

function clearRows() {
  if (document.querySelectorAll(".tr").length > 0)
    document.querySelectorAll(".tr").forEach(row => row.remove());
}

const q = new URLSearchParams(new URL(window.location.href).search).get("q");
if (q) document.querySelector("#players").value = q;
if (q) {
  getStats(q);
  getMatches(q);
  generateChart(q);
}

async function getStats(user) {
  let res = await fetch(`${url}/users/${user}`);
  res = await res.json();
  res = res.data;
  const tr = document.createElement("tr");
  tr.innerHTML = `<td> ${res["total_played"]} </td> <td> ${(
    (res.records[2].win / (res.records[2].win + res.records[2].lose + res.records[2].draw)) *
    100
  ).toFixed(1)}% </td> <td style="color: ${colorElo(res["elo_rate"])}" title="${addRank(
    res["elo_rate"]
  )}"> ${res["elo_rate"]} </td> <td> #${res["elo_rank"]}`;
  tr.classList.add("border-bottom");
  tr.classList.add("tr");
  document.querySelector("#stats").appendChild(tr);
  const tr3 = document.createElement("tr");
  tr3.innerHTML = `<th> best W/S </th> <th> current W/S </th> <th> best time </th> <th> last online </th>`;
  tr3.classList.add("border-bottom");
  tr3.classList.add("tr");
  document.querySelector("#stats").appendChild(tr3);
  const tr2 = document.createElement("tr");
  tr2.innerHTML = `<td> ${res["highest_winstreak"]} </td> <td> ${
    res["current_winstreak"]
  } </td> <td> ${new Date(res["best_record_time"]).toISOString().slice(14, 23)} </td> <td> ${format(
    res["latest_time"] * 1e3
  )}`;
  tr2.classList.add("border-bottom");
  tr2.classList.add("tr");
  document.querySelector("#stats").appendChild(tr2);
  document.querySelector("#youtube").classList.remove("visually-hidden");
  document.querySelector("#twitch").classList.remove("#visually-hidden");
  document.querySelector("#discord").classList.remove("visually-hidden");
  document.querySelector("#youtube").href = res.connections.youtube
    ? `https://youtube.com/channel/${res.connections.youtube.id}`
    : document.querySelector("#youtube").classList.add("visually-hidden");
  document.querySelector("#twitch").href = res.connections.twitch
    ? `https://twitch.com/${res.connections.twitch.name}`
    : document.querySelector("#twitch").classList.add("#visually-hidden");
  document.querySelector("#discord").href = res.connections.discord
    ? `https://discordlookup.com/user/${res.connections.discord.id}`
    : document.querySelector("#discord").classList.add("visually-hidden");
  document.querySelector("#player-title").innerText = `• stats for ${user}:`;
  if (document.querySelectorAll(".card").length > 0)
    document.querySelectorAll(".card").forEach(card => card.classList.remove("visually-hidden"));
}

async function getUUID(user) {
  let res = await fetch(`https://playerdb.co/api/player/minecraft/${user}`);
  res = await res.json();
  return res.data.player["raw_id"];
}

async function getMatches(user) {
  uuid = await getUUID(user);
  const offset = document.querySelectorAll(".match").length / 20;
  let res = await fetch(`${url}/users/${user}/matches?page=${offset}`);
  res = await res.json();
  res = res.data;
  res.forEach(match => {
    if (!match["is_decay"]) {
      const didWin = uuid === match.winner ? "won" : "lost";
      const opponents = listOpponents(uuid, match.members);
      const tr = document.createElement("tr");
      const finalTime = match.forfeit
        ? "<i> forfeit </i>"
        : didWin === "lost"
        ? "-"
        : new Date(match["final_time"]).toISOString().slice(14, 23);
      tr.innerHTML = `<td> ${opponents} </td>  <td style="color: ${colorResult(
        didWin
      )}"> ${didWin} </td> <td> ${finalTime} </td> <td> ${format(
        match["match_date"] * 1e3
      )} </td> <td> <a href="./matches.html?q=${
        match["match_id"]
      }" class="link"> more... </a> </td>`;
      tr.classList.add("border-bottom");
      tr.classList.add("tr");
      tr.classList.add("match");
      document.querySelector("#matches").appendChild(tr);
    }
  });
}

function colorResult(result) {
  return result === "won" ? "#55ff00" : result === "lost" ? "#ff0055" : "";
}

function listOpponents(main, members) {
  const opponents = [];
  members.forEach(member => {
    if (member.uuid !== main) {
      opponents.push(
        `<a href="./players.html?q=${member.nickname}" class="link"> ${member.nickname}</a>`
      );
    }
  });
  return opponents;
}

function colorElo(elo) {
  return elo > 0 && elo < 599
    ? "#252525"
    : (elo > 600) & (elo < 1199)
    ? "#E3E3E3"
    : elo > 1200 && elo < 1799
    ? "#FFD700"
    : elo > 1800
    ? "#99EBFF"
    : "";
}

function addRank(elo) {
  return elo > 0 && elo < 199
    ? "coal I"
    : elo > 200 && elo < 399
    ? "coal II"
    : elo > 400 && elo < 599
    ? "coal III"
    : elo > 600 && elo < 799
    ? "iron I"
    : elo > 800 && elo < 999
    ? "iron II"
    : elo > 1000 && elo < 1199
    ? "iron III"
    : elo > 1200 && elo < 1399
    ? "gold I"
    : elo > 1400 && elo < 1599
    ? "gold II"
    : elo > 1600 && elo < 1799
    ? "gold III"
    : elo > 1800 && elo < 1999
    ? "diamond I"
    : (elo > 2000) & (elo < 2199)
    ? "diamond II"
    : elo > 2200 && elo < 2399
    ? "diamond III"
    : "";
}

function format(timeStamp) {
  const rtf = new Intl.RelativeTimeFormat("en-US", {
    numeric: "auto",
    style: "narrow",
  });
  const time = [
    { label: "year", amount: 31536e6 },
    { label: "month", amount: 2592e6 },
    { label: "week", amount: 3456e5 },
    { label: "day", amount: 864e5 },
    { label: "hour", amount: 36e5 },
    { label: "minute", amount: 6e4 },
    { label: "second", amount: 1e3 },
  ];
  const diff = Date.now() - timeStamp;
  for (const measure of time) {
    if (measure.amount < Math.abs(diff)) {
      const count = Math.round(diff / measure.amount) * -1;
      return rtf.format(count, measure.label);
    }
  }
  return rtf.format(0, "second");
}

async function generateChart() {
  const labels = [...Array(50).keys()].map(i => i + 1);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Elo",
        tension: 0.2,
        borderColor: "#eee",
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      legend: { display: false },
      plugins: {
        title: {
          display: true,
          text: "elo over the past few games",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "games",
          },
        },
        y: {
          title: {
            display: true,
            text: "elo",
          },
        },
      },
    },
  };
  new Chart(document.querySelector("canvas"), config);
}

async function updateChart(user) {
  const newURL = new URL(window.location.href);
  newURL.search = new URLSearchParams({ q: user });
  window.history.pushState(null, null, newURL);
  let res = await fetch(`${url}/users/${user}/matches?filter=2&count=50`);
  res = await res.json();
  res = res.data;
  const elo = [];
  res.forEach(match => {
    if (!match["is_decay"]) {
      match["score_changes"].forEach(member => {
        if (uuid === member.uuid) {
          elo.push(member.score);
        }
      });
    }
  });
  elo.reverse();
  Chart.getChart(document.querySelector("canvas")).data.datasets[0].data = elo;
  Chart.getChart(document.querySelector("canvas")).update();
}

function downloadChart() {
  const base64URL = Chart.getChart(document.querySelector("canvas")).toBase64Image();
  const dl = document.createElement("a");
  dl.href = base64URL;
  dl.download = "elo-chart.png";
  document.body.appendChild(dl);
  dl.click();
  document.body.removeChild(dl);
}

async function playerSuggestions() {
  let res = await fetch(`${url}/leaderboard`);
  res = await res.json();
  res = res.data.users;
  res.forEach(player => {
    const option = document.createElement("option");
    option.value = player.nickname;
    option.innerText = player.nickname;
    document.querySelector("#suggestions").appendChild(option);
  });
}

playerSuggestions();

document.querySelector("#players").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    clearRows();
    const player = document.querySelector("#players").value;
    getStats(player);
    getMatches(player);
    generateChart(player);
  }
});

function manageTheme() {
  localStorage.setItem(
    "prefers-light-theme",
    !document.querySelector("html").classList.contains("dark")
  );
}
