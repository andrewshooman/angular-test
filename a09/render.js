let tweets = [];
let replies = [];

export const main = function() {
    createTweet();
    showTweets();
}

export async function createTweet() {
  $("body").append(`
  <div class="tweet">
  <div class="field">
  <label class="label">Tweet Something!</label>
  <div class="control">
    <input class="input" type="text" placeholder="Text goes here" id="tweettext">
    <button class="button is-info is-rounded" id="tweetbutton">Tweet</button>

  </div>

</div>
</div>
</div>`)
$("body").on("click", "#tweetbutton", function(event){
  tweetSomething(event);
  }); 
}

export async function showTweets() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        params:{
          type: ['tweet', 'retweet', 'reply']
        }
      });

      tweets = result.data;

    for (let i=0; i<50; i++){
 makeTweet(i, result)
//  if (tweets[i].replyCount >= 1) {makeReply(tweets[i].parent, i)} 
//  if (tweets[i].replyCount >= 1) {console.log(tweets[i])} 


      if (tweets[i].isLiked){
        $("#tag" + i).css({"background-color":"lightblue"});
      }



      if (tweets[i].isMine){
        $(".card-footer" + i).append(`
        <button class="button is-danger is-rounded is-small" id="delete${i}">Delete</button>
        <input class="input" id="text-input${i}" type="text" placeholder="Make Changes to Existing Tweet">
        <button class="button is-info is-rounded is-small" id="submit${i}">Submit Changes</button>`);
      }

      $("body").on("click", "#reply" + i, function(event){
        reply(event);
        });  

    $("body").on("click", "#like" + i, function(event){
        likeTweet(event);
        });  

      $("body").on("click", "#retweet" + i, function(event){
        retweetTweet(event);        
      });  

        $("body").on("click", "#submit" + i, function(event){
          editTweet(event);
          });  

          $("body").on("click", "#delete" + i, function(event){
            deleteTweet(event);
            });  

            $("body").on("click", "#showreplies" + i, function(event){
              showReplies(event);
              });  


    }

   

  };

  export async function likeTweet (event) {

    let a = event.target.id.slice(4,7)
    let b = tweets[a].id

    if (tweets[a].isLiked){
      tweets[a].isLiked
    }

    const result = await axios({
      method: 'put',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + b + '/like',
      withCredentials: true,
    });

    

    document.location.reload(true);
  }

  export async function showReplies (event) {

    let a = event.target.id.slice(11,14)
    let b = tweets[a].id

    const result = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + b,
    withCredentials: true,
    });

    if (result.data.replies != undefined) {
    replies = result.data.replies
    makeReply(result.data.replies.length, a)
    }
  }


  export async function reply (event) {

    let a = event.target.id.slice(5,8)
    let b = tweets[a].id
    let c = document.getElementById("replytext" + a).value
    
    console.log(b)
    
    const result = await axios({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
      data: {
        "type": "reply",
        "parent": b,
        "body": c
      },
    });

    location.reload();


  }

  export async function retweetTweet (event) {

    let a = event.target.id.slice(7,10)
    let b = tweets[a].id
    let c = tweets[a].body
    let d = document.getElementById("replytext" + a).value


   const result = await axios({
    method: 'post',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
    withCredentials: true,
    data: {
      "type": "retweet",
      "parent": b,
      "body": c + d
    },
  });

    location.reload();
  }

  export async function tweetSomething (event) {
    
    let a = document.getElementById("tweettext").value;

    const result = await axios({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
      data: {
        body: a
      },
    });
    location.reload();


  }

  export async function editTweet (event) {

    let a = event.target.id.slice(6,8)
    let b = document.getElementById("text-input" + a).value;
    let c = tweets[a].id

    const result = await axios({
      method: 'put',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + c,
      withCredentials: true,
      data: {
        body: b
      },
    });
    location.reload();

  }

  export async function deleteTweet (event) {
    let a = event.target.id.slice(6,8)
    let b = tweets[a].id

    const result = await axios({
      method: 'delete',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + b,
      withCredentials: true,
    });
    location.reload(true);
  }

  export  function makeTweet (i, tweets){
    $("body").append(`<div class="body" id="body${i}">
    <div class="card">
    <header class="card-header">
      <div class="card-content">
        ${tweets.data[i].body}
        <br>
        <time>-${tweets.data[i].author}</time>
        <button class="button is-rounded is-small" id="showreplies${i}" style="position: absolute; right: 0;">Show Replies</button>

      </div>
    </header>
    
    </div>
    <footer class="card-footer${i}">
      <button class="button is-info is-rounded is-small" id="like${i}">Like</button>
      <span class="tag" id="tag${i}">${tweets.data[i].likeCount}</span>
      <button class="button is-info is-rounded is-small" id="reply${i}">Reply</button>
      <span class="tag">${tweets.data[i].replyCount}</span>
      <button class="button is-info is-rounded is-small" id="retweet${i}">Retweet</button>
      <span class="tag">${tweets.data[i].retweetCount}</span>

    </footer>

    <input class="input" id="replytext${i}" type="text" placeholder="Reply or Add to Retweet!">

  </div>
  </div>
  `)
  } 
  
  export  function makeReply (num, a){
    for (let i=0; i<num; i++){
      $("#body" + a).append(`<div class="body" id="replies">
    <div class="card">
    <header class="card-header">
      <div class="card-content">
        ${replies[i].body}
        <br>
        <time>-${replies[i].author}</time>
        <button class="button is-rounded is-small" id="showreplies" style="position: absolute; right: 0;">Show Replies</button>

      </div>
    </header>
    
    </div>
    <footer class="card-footer">
      <button class="button is-info is-rounded is-small" id="like">Like</button>
      <span class="tag" id="tag">${replies[i].likeCount}</span>
      <button class="button is-info is-rounded is-small" id="reply">Reply</button>
      <span class="tag">${replies[i].replyCount}</span>
      <button class="button is-info is-rounded is-small" id="retweet">Retweet</button>
      <span class="tag">${replies[i].retweetCount}</span>

    </footer>

    <input class="input" id="replytext${i}" type="text" placeholder="Reply or Add to Retweet!">

  </div>
  </div>`
  )
    }
   
  
  }
  $(function() {
    main();
});