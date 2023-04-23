const url = "https://mcsrranked.com/api";

const id = new URLSearchParams(new URL(window.location.href).search).get(
  "q"
);
if (id) document.querySelector("#input").value = id;
if (id) getMatchInfo(id);
clearRows();
document.querySelector(".card").classList.add("visually-hidden");

function clearRows() {
  if (document.querySelectorAll(".tr").length > 0)
    document.querySelectorAll(".tr").forEach(row => row.remove());
}

async function getMatchInfo(id) {
  clearRows();
  const newURL = new URL(window.location.href);
  newURL.search = new URLSearchParams({ q: id });
  window.history.pushState(null, null, newURL);
  let match = await fetch(`${url}/matches/${id}`);
  match = await match.json();
  match = match.data;
  const timeline = match.timelines ? match.timelines.reverse() : "";
  let winner = "";
  let players = [];
  match.members.forEach(member => {
    players.push(
      `<a href="./players.html?q=${member.nickname}" class="link"> ${member.nickname} </a>`
    );
    if (member.uuid === match.winner) {
      winner = member.nickname;
    }
  });
  document.querySelector(
    ".card-header"
  ).innerHTML = `players: ${players.join(" • ")}`;
  document.querySelector(
    ".card-footer"
  ).innerHTML = `winner: <span class="text-dark"> ${
    winner ? winner : "n/a"
  } </span> • seed type: <span class="text-dark"> ${formatText(
    match["seed_type"]
  )} </span> • match type: <span class="text-dark"> ${findMatchType(
    match["match_type"]
  )} </span> • time: <span class="text-dark"> ${new Date(
    match["final_time"]
  )
    .toISOString()
    .slice(14, 23)} ${
    match.forfeit ? "(fofeit)" : ""
  } </span> date: <span class="text-dark"> ${format(
    match["match_date"] * 1e3
  )}</span>`;
  if (timeline) {
    timeline.forEach(ev => {
      const tr = document.createElement("tr");
      let nickname = "";
      match.members.forEach(member => {
        if (member.uuid === ev.uuid) {
          nickname = member.nickname;
        }
      });
      tr.innerHTML = `<td> ${nickname} </td> <td> ${new Date(ev.time)
        .toISOString()
        .slice(14, 23)} </td> <td> ${labelAdvancement(ev.timeline)}`;
      tr.classList.add("border-bottom");
      tr.classList.add("tr");
      document.querySelector("table").appendChild(tr);
    });
  }
  document.querySelector(".card").classList.remove("visually-hidden");
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
      const count = Math.floor(diff / measure.amount) * -1;
      return rtf.format(count, measure.label);
    }
  }
  return rtf.format(0, "second");
}

function findMatchType(type) {
  return type === 1
    ? "casual"
    : type === 2
    ? "ranked"
    : type === 3
    ? "private"
    : "";
}

function formatText(text) {
  return text.split("_").join(" ");
}

// someone can finish this perhaps
// function labelAdvancement(ev) {
//   return ev === "story.root"
//     ? "minecraft"
//     : ev === "story.mine_stone"
//     ? "mined stone"
//     : ev === "story.upgrade_tools"
//     ? "upgraded tools"
//     : ev === "story.smelt_iron"
//     ? "smelted iron"
//     : ev === "story.obtain_armor"
//     ? "obtained armor"
//     : ev === "story.lava_bucket"
//     ? "made a lava bucket"
//     : ev === "story.iron_tools"
//     ? "made iron tools"
//     : ev === "story.deflect_arrow"
//     ? "deflected arrow"
//     : ev === "story.form_obsidian"
//     ? "got obsidian"
//     : ev === "story.mine_diamond"
//     ? "got diamonds"
//     : ev === "story.enter_the_nether"
//     ? "entered the nether"
//     : ev === "";
// }

// this is just the lazy way
function labelAdvancement(ev) {
  let last = ev.split(".");
  last = last[last.length - 1];
  return last.split("_").join(" ");
}
