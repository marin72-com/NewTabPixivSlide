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
  var f = true;
  $(urls).each(function() {
    /*
    $("<img>").attr("width", this.width).appendTo("#images");
    $("<img>").attr("height", this.height).appendTo("#images");
    console.log("w:", $("#images img").attr("src"), " h:",$("#images img").attr("height"));
    var tmp = new Image();
    tmp.src = 
    console.log(tmp.src);
    console.log("w:", tmp.src.width, " h:", tmp.src.height);
    */
    if(f){
      $('<li>').appendTo('#myslider ul').html($('<img>').attr('src', this));
      f = false;
    }
    else {
      $('<li>').appendTo('#myslider ul').html($('<img>').attr('src', this)).css('display', 'none');
    }
  //  console.log($("#images img").attr("src"), " w:", $("#images img").attr("width"), " h:",$("#images img").attr("height"));
   });
};

/*
var viewImages = function(){
  var images = $("img");
  images.each(function() {
    console.log(this);
    var orig_width = this.naturalWidth;
    var orig_height = this.naturalHeight;
    console.log($(window).width() );
  });
};
*/

var slideImage = function(){
  console.log("kiteru");
  //$("#images").hide();

};

// 画像を表示
var showImages = function(urls){
  console.log(urls);
  // 画像をimgタグに突っ込む
  setImages(urls);

 // viewImages();
  // 画像をスライドさせる
 // slideImage();
 $('#myslider').juicyslider({
    mask: 'strip',
    autoplay: 4000,
    show: {effect: 'scale', duration: 400},
    hide: {effect: 'drop', duration: 400},
    width: null,
    height: null,
  });
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
    if (loggedIn) {
      // .login_link は見えなくなる
     // $("body").addClass('logged_in');
      $(".login_link").hide();
    }
    // ログイン->ユーザーのブックマーク / 非ログイン->デイリーランキング    
    var loop = true;
    var type = loggedIn ? "getFavoritedIllusts" : "getDailyRanking";
    getIllust(type);
  });
});

