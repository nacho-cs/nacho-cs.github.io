// global variables
const rootUrl = "https://mcsrranked.com/api";
const input = document.querySelector("#input");

// add the param "?q" to the url
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", search);
} else {
  search();
}

if (window.location.href.includes("?q")) {
  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", getInfo);
  } else {
    getInfo();
  }
}

function search() {
  const url = new URL(window.location);
  const q = new URLSearchParams(url.search).get("q");
  document.querySelector("input").value = q;
  document.title = q
    ? `${q} • mcsr ranked stats browser`
    : "• mcsr ranked stats browser";
}

function load() {
  const url = new URL(window.location);
  const q = document.querySelector("input").value;
  url.searchParams.set("q", q);
  window.history.pushState(null, null, url);
  document.title = q
    ? `${q} • mcsr ranked stats browser`
    : "• mcsr ranked stats browser";
}

// get the uuid of a player
// example of a uuid: 9a8e24df4c8549d696a6951da84fa5c4 (this is the uuid for feinberg)
async function getUUID() {
  const res = await fetch(
    `https://playerdb.co/api/player/minecraft/${input.value}`
  );
  const data = await res.json();
  return data.data.player.id.split("-").join("");
}

// get the stats of a player
async function getStats() {
  const uuid = await getUUID();
  const res = await fetch(`${rootUrl}/users/${uuid}`);
  let stats = await res.json();
  stats = stats.data;
  document.querySelector("#loading").classList.toggle("hidden");
  document.querySelector("#stats").style.visibility = "visible";
  const eloColor = checkElo(stats["elo_rate"]);
  const tr = document.createElement("tr");
  if (stats["elo_rank"] < 4) {
    var img_url = trophies(stats["elo_rank"] - 1);
  } else {
    var img_url = "";
  }
  tr.innerHTML = `<td> ${stats["total_played"]} </td> <td> ${Math.round(
    (stats.records[2].win / stats["total_played"]) * 100
  )}% </td> <td style="color: ${eloColor}"> ${stats["elo_rate"]} </td> <td> ${
    img_url + stats["elo_rank"]
  } </td> <td> ${stats["highest_winstreak"]} </td> <td> ${
    stats["current_winstreak"]
  } </td> <td> ${new Date(stats["best_record_time"])
    .toISOString()
    .substring(11, 19)}</td><td> ${new Date(
    stats["latest_time"] * 1000
  ).toLocaleDateString("en-US")} </td>`;
  tr.classList.add("tr");
  document.querySelector("#stats").appendChild(tr);
}

// make the elo number be colored
function checkElo(elo) {
  if (elo > 1800 && elo < 2399) {
    return "#b9f2ff";
  } else if (elo > 1200 && elo < 1799) {
    return "#ffd700";
  } else if (elo > 600 && elo < 1199) {
    return "#a19d94";
  }
}

// add trophies to 1st, 2nd, and 3rd place
function trophies(i) {
  let base_img_url = "https://speedrun.com/images";
  if (i == 0) {
    return `<img src="${base_img_url}/${i + 1}st.png" />`;
  } else if (i == 1) {
    return `<img src="${base_img_url}/${i + 1}nd.png" />`;
  } else if (i == 2) {
    return `<img src="${base_img_url}/${i + 1}rd.png" />`;
  }
}

// get the current leaderboard
async function getLb() {
  const res = await fetch(`${rootUrl}/leaderboard`);
  let lb = await res.json();
  lb = lb.data.users;
  document.querySelector("#loading").classList.toggle("hidden");
  document.querySelector("#lb").style.visibility = "visible";
  for (let i = 0; i < lb.length; i++) {
    const elo = lb[i]["elo_rate"];
    let eloColor = checkElo(elo);
    const tr = document.createElement("tr");
    // add evrything to the website
    img_url = trophies(i);
    tr.innerHTML = `<td> ${
      i < 3 ? img_url + lb[i]["elo_rank"] : lb[i]["elo_rank"]
    } </td> <td> <a href="./?q=${lb[i].nickname}"> ${
      lb[i].nickname
    } </a> </td> <td style="color: ${eloColor};"> ${elo} </td>`;
    tr.classList.add("tr");
    document.querySelector("#lb").appendChild(tr);
  }
  document.querySelector("#show-more");
}

// get the stats for matches
async function getMatches() {
  const uuid = await getUUID();
  const offset = document.querySelectorAll(".match")
    ? document.querySelectorAll(".match").length / 20
    : 0;
  const res = await fetch(`${rootUrl}/users/${uuid}/matches?page=${offset}`);
  let matches = await res.json();
  matches = matches.data;
  document.querySelector("#matches").style.visibility = "visible";
  matches.forEach((match) => {
    // properly format and account for everything
    const didWin = match.winner == uuid ? "Won" : "Lost";
    const finalTime = match.forfeit
      ? "<i> Forfeited </i>"
      : didWin == "Lost"
      ? "-"
      : new Date(match["final_time"]).toISOString().substring(11, 19);
    const wlColor = didWin == "Won" ? "#55ff00" : "#ff0055";
    let players = [];
    for (let i = 0; i < match.members.length; i++) {
      if (match.members[i].uuid !== uuid) {
        players.push(
          `<a href="./?q=${match.members[i].nickname}"> ${match.members[i].nickname}</a>`
        );
      }
    }
    // add evrything to the website
    const tr = document.createElement("tr");
    tr.innerHTML = `<td> ${players} </td> <td> ${
      match["match_seed"]
    }  </td> <td style="color: ${wlColor};" > ${didWin} </td> <td> ${finalTime} </td> <td>${new Date(
      match["match_date"] * 1000
    ).toLocaleDateString("en-us")}</td>`;
    tr.classList.add("tr");
    tr.classList.add("match");
    document.querySelector("#matches").appendChild(tr);
  });
  document.querySelector("#show-more").style.visibility = "visible";
}

// manage all the functions
async function getInfo() {
  clearData();
  hideAll();
  if (
    input.value.includes("leaderboard") ||
    (input.value.includes("lb") && input.value.length == 2)
  ) {
    getLb();
    load();
  } else {
    showPlayerInfo();
    getStats();
    getMatches();
    document.querySelector("#back-up").style.visibility = "visible";
  }
}

// clear all the rows of the tables
function clearData() {
  const data = document.querySelectorAll(".tr");
  data.length > 0
    ? data.forEach((td) => td.remove())
    : console.log("table is empty");
}

// hide the tables
function hideAll() {
  const elements = document.querySelectorAll(".info");
  elements.length > 0
    ? elements.forEach((element) => (element.style.visibility = "hidden"))
    : console.log("no elements found");
  document.querySelector("#loading").classList.toggle("hidden");
}

// populate the input
async function autoComplete() {
  const res = await fetch(`${rootUrl}/leaderboard`);
  let players = await res.json();
  players = players.data.users;
  players.push({ nickname: "leaderboard" });
  players.push({ nickname: "lb" });
  players.forEach((player) => {
    const option = document.createElement("option");
    option.value = player.nickname;
    option.innerText = player.nickname;
    document.querySelector("#player-options").appendChild(option);
  });
}

// do everthing if you press enter
document.querySelector("#input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    document.querySelector("#submit").classList.toggle("lower");
    getInfo();
    load();
  }
});

document.querySelector("#input").addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    document.querySelector("#submit").classList.toggle("lower");
  }
});

async function showPlayerInfo() {
  document.querySelector("#player-info").innerHTML = "";
  document.querySelector("#player-info").style.visibility = "visible";
  document.querySelector("#match").style.visibility = "visible";
  const uuid = await getUUID();
  document.querySelector(
    "#player-info"
  ).innerHTML = `Stats for <img id="player-head" src="https://mc-heads.net/avatar/${uuid}" /> ${input.value}:`;
}
