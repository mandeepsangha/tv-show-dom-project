//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes(); // this gives an array
  makePageForEpisodes(allEpisodes);

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

function makePageForEpisodes(episodeList) {
  const episode_count = document.getElementById("episode-count");
  const rootElem = document.getElementById("root");

  // empty rootElem content to clear the page.
  rootElem.textContent = "";
  episode_count.textContent = `Got ${episodeList.length} episode(s)`;

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

window.onload = setup;
