let cookieString = document.cookie
let videoId = cookieString.split("=")[1];

const apiKey = "AIzaSyC0Q59jz2z406SBfNEBNCGrT1d2vwFu0-c"


let firstScript = document.getElementsByTagName("script")[0];

firstScript.addEventListener("load" , onLoadScript)

function onLoadScript(){
    if(YT){ 
        new YT.Player("container" , {
            height : "400",
            width : "850", 
            videoId,

            events:{
                onReady : (event)=>{
                    document.title = event.target.videoTitle;
                    extractVideoDetails(videoId);
                    fetchStats(videoId)
                }
            }
        });
    }
}

const statsContainer = document.getElementsByClassName("video-details")[0]
async function extractVideoDetails(videoId){
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&id=${videoId}&key=${apiKey}`

    try{
        let response = await fetch(endpoint);
        let result = await response.json();
        renderComments(result.items)
        console.log(result)
    }catch(error){
        console.log(`Error occured` , error )
    }
}


async function fetchStats(videoId){

    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apiKey}&id=${videoId}`

    try{
        const response = await fetch(endpoint)
        const result = await response.json()
        const item = result.items[0];
        const title = document.getElementById("title")
        title.innerText = item.snippet.title;
        console.log(item)
        statsContainer.innerHTML = `
        <div class="profile">
        <img src="./download.jpeg" class="channel-logo" alt="">
        <div class="owner-details">
            <span style="color: black;">${item.snippet.channelTitle}</span>
            <span>20 Subscribers</span>
        </div>
    </div>
    <div class="stats">
       <div class="like-container">
        <div class="like">
            <span class="material-symbols-outlined">
                thumb_up
                </span>
            <span>${item.statistics.likeCount}</span>
        </div>
        <div class="like">
            <span class="material-symbols-outlined">
                thumb_down
                </span>
        </div>
       </div>
       <div class="comments-container">
        <span class="material-symbols-outlined">
            comment
            </span>
            <span>${item.statistics.commentCount}</span>
       </div>
       </div>`

    }catch(error){
        console.log(`Error Occured` , error)
    }
}

function renderComments(commentsList){

    const commentsContainer = document.getElementById("comments-container")

    for(let i = 0 ; i < commentsList.length; i++){
        let comment = commentsList[i];
        const topLevelComment = comment.snippet.topLevelComment;

        let commentElement = document.createElement("div")

        commentElement.className = "comment"
        commentElement.innerHTML= `
                <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="">
                <div class="comment-right-half">
                    <b>${topLevelComment.snippet.authorDisplayName}</b>
                    <p style="color: rgb(194, 192, 192);">${topLevelComment.snippet.textOriginal}</p>
                <div class="like">
                    <div>
                        <span class="material-symbols-outlined">thumb_up</span>
                        <span>${topLevelComment.snippet.likeCount}</span>
                    </div> 
                    <div>
                        <span class="material-symbols-outlined">thumb_down</span>
                    </div>  
                </div>
                </div> `;

                commentsContainer.append(commentElement);
    
    }
}
