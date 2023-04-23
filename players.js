const url = "https://mcsrranked.com/api";
let uuid = "";

document.querySelectorAll(".card").length > 0
  ? document
      .querySelectorAll(".card")
      .forEach(card => card.classList.add("visually-hidden"))
  : "";

function clearRows() {
  if (document.querySelectorAll(".tr").length > 0)
    document.querySelectorAll(".tr").forEach(row => row.remove());
}

const q = new URLSearchParams(new URL(window.location.href).search).get(
  "q"
);
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
    (res.records[2].win /
      (res.records[2].win + res.records[2].lose + res.records[2].draw)) *
    100
  ).toFixed(1)}% </td> <td style="color: ${colorElo(
    res["elo_rate"]
  )}" title="${addRank(res["elo_rate"])}"> ${
    res["elo_rate"]
  } </td> <td> #${res["elo_rank"]}`;
  tr.classList.add("border-bottom");
  tr.classList.add("tr");
  document.querySelector("#stats").appendChild(tr);
  const tr2 = document.createElement("tr");
  tr2.innerHTML = `<td> ${res["highest_winstreak"]} </td> <td> ${
    res["current_winstreak"]
  } </td> <td> ${new Date(res["best_record_time"])
    .toISOString()
    .slice(14, 23)} </td> <td> ${format(res["latest_time"] * 1e3)}`;
  tr2.classList.add("border-bottom");
  tr2.classList.add("tr");
  document.querySelector("#stats-2").appendChild(tr2);
  document.querySelector("#youtube").href = res.connections.youtube
    ? `https://youtube.com/channel/${res.connections.youtube.id}`
    : "";
  document.querySelector("#twitch").href = res.connections.twitch
    ? `https://twitch.com/${res.connections.twitch.name}`
    : "";
  document.querySelector("#discord").title = res.connections.discord
    ? res.connections.discord.name
    : "";
  document.querySelector(
    ".card-header"
  ).innerText = `• stats for ${user}:`;
  if (document.querySelectorAll(".card").length > 0)
    document
      .querySelectorAll(".card")
      .forEach(card => card.classList.remove("visually-hidden"));
}

async function getUUID(user) {
  let res = await fetch(
    `https://playerdb.co/api/player/minecraft/${user}`
  );
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
    ? "#B9F2FF"
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

async function generateChart(user) {
  const newURL = new URL(window.location.href);
  newURL.search = new URLSearchParams({ q: user });
  window.history.pushState(null, null, newURL);
  let res = await fetch(`${url}/users/${user}/matches?filter=2`);
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
  new chartXkcd.Line(document.querySelector("svg"), {
    title: "elo over the past few games",
    xLabel: "games",
    yLabel: "elo",
    data: {
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
      ],
      datasets: [
        {
          label: "elo",
          data: elo,
        },
      ],
    },
  });
}

async function playerSuggestions() {
  let res = await fetch(`${url}/leaderboard`);
  res = await res.json();
  res = res.data.users;
  res.forEach(player => {
    const option = document.createElement("option");
    option.value = player.nickname;
    option.innerHTML = `<a href="./players.html?q=${player.nickname}"> ${player.nickname} </a>`;
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
