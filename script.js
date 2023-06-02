

const searchInput = document.getElementById("search-input")
// const apiKey = "AIzaSyBprXFgJkoIn4TkCL0CXd9HL0ujKmt9evk"
const apiKey = "AIzaSyC0Q59jz2z406SBfNEBNCGrT1d2vwFu0-c"

let container = document.getElementsByClassName("container")[0]

function searchVideos(){
    const searchValue = searchInput.value;
    fetchVideos(searchValue)
    
}

async function fetchVideos(searchValue){

    let endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchValue}&key=${apiKey}`

    try{
        
    let response = await fetch(endpoint);

    let result = await response.json();

    for(let i = 0 ; i < result.items.length; i++){
        let video = result.items[i];
        let videoStats = await fetchStats(video.id.videoId);
        if(videoStats.items.length > 0){
            result.items[i].videoStats = videoStats.items[0].statistics
        }
    }
       console.log(result)
       showThumbnails(result.items);
    }catch(error){
        console.log("SOmething Went Wrong" , error)
    }

}

function getViews(n){
    if(n < 1000){
        return n;
    }else if(n >= 1000 && n <= 999999){
        n /= 1000;
        n = parseInt(n);
        return n+"K"
    }
    return parseInt(n / 100000)+"M"
}

function showThumbnails(items){
    for(let i = 0; i < items.length; i++){
        let videoItem = items[i];
        let imageUrl = videoItem.snippet.thumbnails.high.url;
        let videoElement = document.createElement("div")
        
        videoElement.addEventListener("click" , () =>{
            navigateToVideo(videoItem.id.videoId);
        })
        const videoChildren = `<img src = "${imageUrl}" id = "${videoItem.id.videoId}"/>
        <p class ="title">${videoItem.snippet.title}</p>
        <p class ="channel-name">${videoItem.snippet.channelTitle}</p>
        <p class ="view-count">${videoItem.videoStats ? getViews(videoItem.videoStats.viewCount) + " Views":"NA"}</p>`

        videoElement.innerHTML =videoChildren
        container.append(videoElement);
    }
}

async function fetchStats(videoId){
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics&id=${videoId}`

    let response = await fetch(endpoint)
    let result =await response.json();

    return result;
}

function navigateToVideo(videoId){

    let path = `/Youtube-Clone/video.html`;
    if(videoId){
        document.cookie = `videoId=${videoId}; path = ${path}`
        let linkItem = document.createElement("a")
        linkItem.target = "_blank"
        linkItem.href =  `http://127.0.0.1:5500/Youtube-Clone/video.html`;
        linkItem.click();
    }else{
        alert("go and watch in Youtube")
    }
}
