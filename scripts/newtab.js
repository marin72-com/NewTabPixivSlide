// ログインをするときに使うフラグ
var loggingIn = false;

// 画像を表示する.
var showImages = function(urls){
  console.log(urls);
  $(urls).each(function() {
    $("<img>").attr("src", this).appendTo("#images");
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
    var type = loggedIn ? "getFavoritedIllusts" : "getDailyRanking";
    chrome.runtime.sendMessage({type: type}, function(response) {
      if (response.urls.length){
        console.log("hyouzi");
        console.log(response.urls);
        showImages(response.urls);
      }
      else {
        console.log("nakamiganai");
        loggedIn = false;
        location.reload();
      }
    });
  });
});

