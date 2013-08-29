// ログインをするときに使うフラグ
var loggingIn = false;

var setImages = function(urls){
  // URLをランダムにする
  var len = urls.length;
  for (var i = 0; i < len; i++){
    var rnd = Math.floor(Math.random()*len);

    var s1 = urls[0];
    var s2 = urls[rnd];

    urls[rnd] = s1;
    urls[0] = s2;
  }
  console.log("set" , urls);
  $(urls).each(function() {
    $("<img>").attr("src", this).appendTo("#images");
  });
};

var slideImage = function(){
  console.log("kiteru");
  console.log($("img").attr("src"));
  console.log($("#images img").attr("src"));
  $("img").hide();
  $('#images img').maxImage({
    isBackground: true,
    slideShow: true,
    slideShowTitle: false,
    slideDelay: 3,
    overflow: 'auto',
    verticalAlign:'top'
  });
};

// 画像を表示
var showImages = function(urls){
  console.log(urls);
  // 画像をimgタグに突っ込む
  setImages(urls);
  // 画像をスライドさせる
  slideImage();
};


var getIllust = function(type){
  chrome.runtime.sendMessage({type: type}, function(response) {
    if (response.urls === "0"){
      $("#no_bookmark_urls").show();
      type = "getDailyRanking";
      getIllust(type);
    }
    else if (response.urls.length){
      loop = false;
      console.log(response.urls);
      showImages(response.urls);
    }
    else {
      console.log(typeof response.urls);
      console.log("reload前");
      location.reload();
    }
    return;
  });
};

jQuery(function($) {
  // ログインがクリックされたら
  $(".login_link a").click(function(event) {
    // ログイン処理中にする
    loggingIn = true;
  });
  // ログインが終了し、ページの表示が変わったら
  document.addEventListener("webkitvisibilitychange", function() {
    // ページが開かれている かつ ログイン処理中
    if (!document.webkitHidden && loggingIn)
      // 画面をリロードする
      location.reload();
  });

  // ログイン状態(phpsessidがあるか)を確かめる -> background
  chrome.runtime.sendMessage({type: "getLoginStatus"}, function(loggedIn) {
    // ログイン状態だと
    if (loggedIn) 
      // .login_link は見えなくなる
      $("body").addClass('logged_in');

    // ログイン->ユーザーのブックマーク / 非ログイン->デイリーランキング    
    var loop = true;
    var type = loggedIn ? "getFavoritedIllusts" : "getDailyRanking";
    getIllust(type);
  });
});

