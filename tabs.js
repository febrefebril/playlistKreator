function getOpenTabs(tabs){
    // TODO: usar funcao do browser que retorna todas as abas abertas
    let openTabs = [];
    for (let tab of tabs){
        console.log(tab.url);
        openTabs.push(tab.url);
    }
    return openTabs;

};


function youtubeLinksFilter(links){
    let urlYoutube = [];
    for(let link in links){
        console.log(`analizando link ${links[link]}`);
        if (links[link].includes('www.youtube.com/watch?')){            
            urlYoutube.push(links[link]);   
            console.log('achado')
        }
    }
    return urlYoutube;
}


function createPlayList(videosLinkList){
    // TODO: refatorar e criar uma funcao para retornar ids do video
    let playListUrlBase = 'https://www.youtube.com/watch_videos?video_ids=';
    let videosIds = '';
    for(let link in videosLinkList){
        videosIds += getVideoKey(videosLinkList[link]) + ',';
    }
    
    function getVideoKey(videoLink){
        return videoLink.slice(-11);
    }

    return (playListUrlBase + videosIds.slice(0, -1));
}

// Zoom constants. Define Max, Min, increment and default values
const ZOOM_INCREMENT = 0.2;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.3;
const DEFAULT_ZOOM = 1;

function firstUnpinnedTab(tabs) {
  for (let tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

/**
 * listTabs to switch to
 */

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();
    let limit = 10;
    let counter = 0;

    tabsList.textContent = '';

    for (let tab of tabs) {
      if (!tab.active && counter <= limit) {
        let tabLink = document.createElement('a');

        tabLink.textContent = tab.title || tab.id;
        tabLink.setAttribute('href', tab.id);
        tabLink.classList.add('switch-tabs');
        currentTabs.appendChild(tabLink);

      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", (e) => {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (let tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
}
// aki comeca o codio Playlist Kreator
if (e.target.id === "get-youtube-tabs") {
    callOnActiveTab((tab, tabs) => {
        console.log("Inicio do log...");
        let openTabs = getOpenTabs(tabs);
        let youtubeVideos = youtubeLinksFilter(openTabs);
        let playList = createPlayList(youtubeVideos);
        console.log(playList);
        browser.tabs.create({url: playList});
        console.log('Fim do log!')
    });
} 

  if (e.target.id === "tabs-move-beginning") {
    callOnActiveTab((tab, tabs) => {
      let index = 0;
      if (!tab.pinned) {
        index = firstUnpinnedTab(tabs);
      }
      console.log(`moving ${tab.id} to ${index}`)
      browser.tabs.move([tab.id], {index});
    });
  }

  
  if (e.target.id === "tabs-move-end") {
    callOnActiveTab((tab, tabs) => {
      let index = -1;
      if (tab.pinned) {
        let lastPinnedTab = Math.max(0, firstUnpinnedTab(tabs) - 1);
        index = lastPinnedTab;
      }
      browser.tabs.move([tab.id], {index});
    });
  }

  else if (e.target.id === "tabs-duplicate") {
    callOnActiveTab((tab) => {
      browser.tabs.duplicate(tab.id);
    });
  }

  else if (e.target.id === "tabs-reload") {
    callOnActiveTab((tab) => {
      browser.tabs.reload(tab.id);
    });
  }

  else if (e.target.id === "tabs-remove") {
    callOnActiveTab((tab) => {
      browser.tabs.remove(tab.id);
    });
  }

  else if (e.target.id === "tabs-create") {
    browser.tabs.create({url: "https://developer.mozilla.org/en-US/Add-ons/WebExtensions"});
  }

  else if (e.target.id === "tabs-create-reader") {
    browser.tabs.create({url: "https://developer.mozilla.org/en-US/Add-ons/WebExtensions", openInReaderMode: true});
  }

  else if (e.target.id === "tabs-alertinfo") {
    callOnActiveTab((tab) => {
      let props = "";
      for (let item in tab) {
        props += `${ item } = ${ tab[item] } \n`;
      }
      alert(props);
    });
  }

  else if (e.target.id === "tabs-add-zoom") {
    callOnActiveTab((tab) => {
      let gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        //the maximum zoomFactor is 5, it can't go higher
        if (zoomFactor >= MAX_ZOOM) {
          alert("Tab zoom factor is already at max!");
        } else {
          let newZoomFactor = zoomFactor + ZOOM_INCREMENT;
          //if the newZoomFactor is set to higher than the max accepted
          //it won't change, and will never alert that it's at maximum
          newZoomFactor = newZoomFactor > MAX_ZOOM ? MAX_ZOOM : newZoomFactor;
          browser.tabs.setZoom(tab.id, newZoomFactor);
        }
      });
    });
  }

  else if (e.target.id === "tabs-decrease-zoom") {
    callOnActiveTab((tab) => {
      let gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        //the minimum zoomFactor is 0.3, it can't go lower
        if (zoomFactor <= MIN_ZOOM) {
          alert("Tab zoom factor is already at minimum!");
        } else {
          let newZoomFactor = zoomFactor - ZOOM_INCREMENT;
          //if the newZoomFactor is set to lower than the min accepted
          //it won't change, and will never alert that it's at minimum
          newZoomFactor = newZoomFactor < MIN_ZOOM ? MIN_ZOOM : newZoomFactor;
          browser.tabs.setZoom(tab.id, newZoomFactor);
        }
      });
    });
  }

  else if (e.target.id === "tabs-default-zoom") {
    callOnActiveTab((tab) => {
      let gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        if (zoomFactor == DEFAULT_ZOOM) {
          alert("Tab zoom is already at the default zoom factor");
        } else {
          browser.tabs.setZoom(tab.id, DEFAULT_ZOOM);
        }
      });
    });
  }

  else if (e.target.classList.contains('switch-tabs')) {
    let tabId = +e.target.getAttribute('href');

    browser.tabs.query({
      currentWindow: true
    }).then((tabs) => {
      for (let tab of tabs) {
        if (tab.id === tabId) {
          browser.tabs.update(tabId, {
              active: true
          });
        }
      }
    });
  }

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  let startIndex = moveInfo.fromIndex;
  let endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});