const url = "https://mcsrranked.com/api";

if (localStorage.getItem("prefers-light-theme") === "true")
  document.querySelector("html").classList.remove("dark");

window.onload = () => {
  getEloLeaderboard();
  getRunLeaderboard();
};

async function getEloLeaderboard() {
  let res = await fetch(`${url}/leaderboard`);
  res = await res.json();
  res = res.data.users;
  res.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td> ${row["elo_rank"]} </td> <td> <a href="./players.html?q=${
      row.nickname
    }" class="link"> ${row.nickname} </a> </td> <td style="color: ${colorElo(
      row["elo_rate"]
    )}" title="${addRank(row["elo_rate"])}"> ${row["elo_rate"]} </td>`;
    tr.classList.add("border-bottom");
    document.querySelector("#elo-table").appendChild(tr);
  });
}

async function getRunLeaderboard() {
  let res = await fetch(`${url}/record-leaderboard`);
  res = await res.json();
  res = res.data;
  res.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td> ${row["final_time_rank"]} </td> <td> <a href="./players.html?q=${
      row.user.nickname
    }" class="link"> ${row.user.nickname} </a> </td> <td> ${new Date(row["final_time"])
      .toISOString()
      .slice(14, 23)} </td> <td> ${format(row["match_date"] * 1e3)} </td>`;
    tr.classList.add("border-bottom");
    document.querySelector("#runs-table").appendChild(tr);
  });
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

function colorElo(elo) {
  return elo > 0 && elo < 599
    ? "#252525"
    : (elo > 600) & (elo < 1199)
    ? "#E3E3E3"
    : elo > 1200 && elo < 1799
    ? "#FFD700"
    : elo > 1800
    ? "#99EBFF"
    : null;
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
    : null;
}

function manageTheme() {
  localStorage.setItem(
    "prefers-light-theme",
    !document.querySelector("html").classList.contains("dark")
  );
}
