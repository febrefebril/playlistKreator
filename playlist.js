console.log(getOpenTabs());
let openTabs = getOpenTabs();
let youtubeVideos = youtubeLinksFilter(openTabs);
let playList = createPlayList(youtubeVideos);
console.log(playList);

function getOpenTabs(){
    // TODO: usar funcao do browser que retorna todas as abas abertas
    return [
        'https://web.whatsapp.com/',
        'https://shopee.com.br/search?keyword=mp3%20a%20prova%20d%27%C3%A1gua',
        'https://www.youtube.com/',
        'https://www.youtube.com/watch?v=2ypb2H-Sjj8',
        'https://www.youtube.com/watch?v=SLSJBv3__Nw',
        'https://www.youtube.com/watch?v=3pHVv7ivl6M',
        'https://www.youtube.com/watch?v=5dvwcHJF3YE',
        'https://www.youtube.com/watch?v=PSo2FDHkrKw'
    ];

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