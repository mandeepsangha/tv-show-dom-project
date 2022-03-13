const backToShowBtn = document.getElementById("backtoshows");
backToShowBtn.style.display = "none";
const showsView = document.getElementById("showsView");

//searchbar box
const searchBar = document.getElementById("input-search");
const searchShows = document.getElementById("input-shows");

function setup() {
  displayShowList();
  let allEpisodes = getAllShows().sort((a, b) =>
    a.name.toUpperCase() > b.name.toUpperCase()
      ? 1
      : b.name.toUpperCase() > a.name.toUpperCase()
      ? -1
      : 0
  );
  makePageForShows(allEpisodes);

  const shows = document.querySelectorAll(".show");
  backToShowBtn.addEventListener("click", () => {
    // showsView.style.display = "block";
    // episodesView.style.display = "none";
    backToShowBtn.style.display = "none";
  });

  //add event listener on key up to Show Search
  searchShows.addEventListener("keyup", (e) => {
    e.preventDefault();

    let filterValue = e.target.value.toLowerCase();
    makePageForEpisodes(
      allEpisodes.filter((episode) => {
        return (
          episode.name.toLowerCase().indexOf(filterValue) != -1 ||
          episode.summary.toLowerCase().indexOf(filterValue) != -1 ||
          episode.genres.join(" ").toLowerCase().includes(filterValue)
        );
      })
    );
  });

  //add event listener on key up to Episode Search
  searchBar.addEventListener("keyup", (e) => {
    e.preventDefault();
    let filterValue = e.target.value.toLowerCase();
    makePageForEpisodes(
      allEpisodes.filter((episode) => {
        return (
          episode.name.toLowerCase().indexOf(filterValue) != -1 ||
          episode.summary.toLowerCase().indexOf(filterValue) != -1
        );
      })
    );
  });

  //This function add an EventListener on show change to fetch the episodes list of that selected show.
  select_show.addEventListener("change", (e) => {
    e.preventDefault();
    let showId = e.currentTarget.value;

    async function displayEpisodesList() {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`
      );
      allEpisodes = await response.json();

      select_episode.innerHTML = populateSelectEpisodeBar(allEpisodes);
      makePageForEpisodes(allEpisodes);
    }

    displayEpisodesList();
  });
}

function makePageForShows(episodeList) {
  const episode_count = document.getElementById("episode-count");
  const rootElem = document.getElementById("root");

  // empty rootElem content to clear the page.
  rootElem.textContent = "";
  episode_count.textContent = `Got ${episodeList.length} episode(s)`;

  // loop through the episodeList to create each episode card .
  episodeList.forEach((episode) => {
    if (episode.image) {
      rootElem.innerHTML += `<div class = "card">
     <h1> ${episode.name}</h1>
     
     <img src= ${episode.image.medium}>
     
     <div> rated: ${episode.rating.average} <br> runtime: ${episode.runtime} <br> status: ${episode.status}</div>
          </div>
       
     </div>`;
    } else {
      rootElem.innerHTML += `<div class = "card">
     <h1> ${episode.name}</h1>
     
     <div> rated: ${episode.rating.average} <br> runtime: ${episode.runtime} <br> status: ${episode.status}</div>
          </div>
       
     </div>`;
    }
  });
}

function makePageForEpisodes(episodeList) {
  const episode_count = document.getElementById("episode-count");
  const rootElem = document.getElementById("root");

  // empty rootElem content to clear the page.
  rootElem.textContent = "";
  episode_count.textContent = `Got ${episodeList.length} episode(s)`;

  // loop through the episodeList to create each episode card .
  episodeList.forEach((episode) => {
    if (episode.image) {
      rootElem.innerHTML += `<div class = "card">
   <h1> ${episode.name} - S${
        episode.season < 10 ? "0" + episode.season : episode.season
      }E${episode.number < 10 ? "0" + episode.number : episode.number}</h1>
   <img src= ${episode.image.medium}>
   ${episode.summary}
   </div>`;
    } else {
      rootElem.innerHTML += `<div class = "card">
   <h1> ${episode.name} - S${
        episode.season < 10 ? "0" + episode.season : episode.season
      }E${episode.number < 10 ? "0" + episode.number : episode.number}</h1>
   
   ${episode.summary}
   </div>`;
    }
  });
}
// drop down menu for episode and show selection

const select_episode = document.getElementById("episode-select");
const select_show = document.getElementById("shows-select");

//This function populate the episode bar
function populateSelectEpisodeBar(episodeList) {
  select_episode.innerText = "";
  episodeList.forEach((episode) => {
    select_episode.innerHTML += `<option value="${episode.id}">S${
      episode.season < 10 ? "0" + episode.season : episode.season
    }E${episode.number < 10 ? "0" + episode.number : episode.number} - ${
      episode.name
    }</option>`;
  });
}

//event handler on change for select episodes, reset after 5 seconds back to full list

function handleChangeEpisodeOption(e) {
  const allEpisodes2 = allEpisodes;
  if (e.target.value == "") {
    makePageForEpisodes(allEpisodes2);
  } else {
    let filteredEpisode = allEpisodes2.filter(
      (episode) => e.target.value == episode.id
    );
    makePageForEpisodes(filteredEpisode);
    setTimeout(() => {
      makePageForEpisodes(allEpisodes2);
    }, 5000);
  }
}

select_episode.addEventListener("change", handleChangeEpisodeOption);

//using async function to make GET request from URL

async function getEpisodes(url) {
  const res = await fetch(url); //instead of doing .then
  allEpisodes = await res.json(); //uses .json() method to convert response to JSON
  populateSelectEpisodeBar(allEpisodes); //create dropdown for episodes
  makePageForShows(allEpisodes); //runs make Pages
}

async function displayShowList() {
  const response = await fetch("https://api.tvmaze.com/shows"); //instead of doing .then
  const allShowsList = await response.json(); //uses .json() method to convert response to JSON
  select_show.innerHTML =
    `<option value="">All shows</option>` + populateShows(allShowsList);
}

// The function populate the show bar

function populateShows(shows) {
  let selected_show = "";
  shows.sort((a, b) =>
    a.name.toUpperCase() > b.name.toUpperCase()
      ? 1
      : b.name.toUpperCase() > a.name.toUpperCase()
      ? -1
      : 0
  );
  for (let i = 0; i < shows.length; i++) {
    selected_show += `<option value = "${shows[i].id}">${shows[i].name}</option>`;
  }
  return selected_show;
}

displayShowList();

//populate episodes
function populateEpisodes(episodeList) {
  let selected_episode = "";
  for (let i = 0; i < episodeList.length; i++) {
    selected_episode += `
       <option value = ${episodeList[i].id}>S${
      episodeList[i].season < 10
        ? "0" + episodeList[i].season
        : episodeList[i].season
    }
      E${
        episodeList[i].number < 10
          ? "0" + episodeList[i].number
          : episodeList[i].number
      } - ${episodeList[i].name}
      </option>`;
  }
  return selected_episode;
}

//addEventListener to fetch episode list on show change
select_show.addEventListener("change", (e) => {
  e.preventDefault();
  backToShowBtn.style.display = "block";
  let showId = e.currentTarget.value;

  async function displayEpisodesList() {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    allEpisodes = await response.json();
    select_episode.innerHTML = populateEpisodes(allEpisodes);
    makePageForEpisodes(allEpisodes);
  }

  displayEpisodesList();
});
window.onload = setup;
