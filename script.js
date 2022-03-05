//You can edit ALL of the code here

const API_URL = "https://api.tvmaze.com/shows/527/episodes "; //returns object with episode data

function setup() {
  // const allEpisodes = getAllEpisodes(); // this gives an array
  // makePageForEpisodes(allEpisodes);

  getEpisodes(API_URL); //calls the getEpisodes function passing in API URL

  //searchbar box
  const searchBar = document.getElementById("input-search");

  //add event listener on key up
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
}

const showsView = document.getElementById("showsView");

function makePageForEpisodes(episodeList) {
  const episode_count = document.getElementById("episode-count");
  const rootElem = document.getElementById("root");

  // empty rootElem content to clear the page.
  rootElem.textContent = "";
  episode_count.textContent = `Got ${episodeList.length} episode(s)`;

  populateSelectEpisodeBar(episodeList);

  // loop through the episodeList to create each episode card .
  episodeList.forEach((episode) => {
    rootElem.innerHTML += `<div class = "card">
     <h1> ${episode.name} - S${
      episode.season < 10 ? "0" + episode.season : episode.season
    }E${episode.number < 10 ? "0" + episode.number : episode.number}</h1>
     <img src= ${episode.image.medium}>
     ${episode.summary}
     </div>`;
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

//using fetch() to make GET request from URL

async function getEpisodes(url) {
  const res = await fetch(url); //instead of doing .then
  allEpisodes = await res.json(); //uses .json() method to convert response to JSON
  populateSelectEpisodeBar(allEpisodes); //create dropdown for episodes
  makePageForEpisodes(allEpisodes); //runs make Pages
}

window.onload = setup;
