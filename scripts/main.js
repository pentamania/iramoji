'use strict';

(function(){
  var SS_URL = "./assets/spritesheet.png";
  var ATLAS_URL = "./assets/atlas.json";
  var DEBUG_MODE = false;

  // 空白用プロパティ
  var SPACE_PROP = {
    // x: -1000,
    // y: -1000,
    w: 84,
    h: 197
  };

  var preload = function() {
    var ssp = new Promise(function(resolve, reject) {
      var ss = new Image();
      ss.src = SS_URL;
      ss.onload = function() {
        resolve(ss);
      }
      ss.onerror = function(err) {
        reject(err);
      }
    });

    var atlasp = new Promise(function(resolve, reject) {
      xhrGet(ATLAS_URL, function(res) {
        var a = (JSON.parse(res))['frames'];
        resolve(a);
      }, function(err){
        reject(err);
      })
    });

    return Promise.all([ssp, atlasp]);
  }

  var main = function(assets) {
    var spritesheet = assets[0];
    var atlas = assets[1];
    var input = document.getElementById('input');
    var canvas = document.getElementById('out-canvas');
    var output = document.getElementById('out'); //DEBUG
    var letterMag = null;
    var letterMargin = null;
    var isVertical = true;

    var render = function() {
      var ctx = canvas.getContext('2d');
      var text = (input.value != "") ? input.value : " ";
      var l, currentPos;
      var letters = [];
      var charCode = ""; //debug

      if (letterMag < 0) letterMag =  0.05;

      // 前処理
      for (var i = 0; i < text.length; i++) {
        l = atlas[text.charAt(i)] || SPACE_PROP;
        // l = atlas[text.charCodeAt(i)] || SPACE_PROP;

        // 濁点付きの「あ」など特殊な濁点文字
        if (text.charAt(i+1) === "゛"){
          ["あ","い","う","え","お","ア","イ","エ","オ"].forEach(function(a){
            if (text.charAt(i) === a){
              l = atlas[text.charAt(i)+"2"];
              text = text.replace(text.charAt(i+1),"");
            }
          });
        }
        letters.push(l);
      }

      // canvasサイズ再計算
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.height = 0;
      letters.forEach(function(l,i) {
        if (isVertical) {
          // 縦書き
          canvas.height += l.h * letterMag;
          canvas.width = Math.max(l.w * letterMag, canvas.width);
          if (i > 0) canvas.height += letterMargin;
        } else {
          // 横書き
          canvas.width += l.w * letterMag;
          canvas.height = Math.max(l.h * letterMag, canvas.height);
          if (i > 0) canvas.width += letterMargin;
        }
      });

      // 描画
      currentPos = 0;
      letters.forEach(function(l,i) {
        // IndexSizeError 対策： いらない？
        // var destWidth = Math.max(1, l.w*letterMag);
        // var destHeight = Math.max(1, l.h*letterMag);

        var destWidth = l.w * letterMag;
        var destHeight = l.h * letterMag;

        if (isVertical) {
          if (l.x != null) ctx.drawImage(spritesheet, l.x, l.y, l.w, l.h, 0, currentPos+letterMargin*i, destWidth, destHeight);
          currentPos += destHeight;
        } else {
          if (l.x != null) ctx.drawImage(spritesheet, l.x, l.y, l.w, l.h, currentPos+letterMargin*i, 0, destWidth, destHeight);
          currentPos += destWidth;
        }

        charCode += text.charCodeAt(i)+", ";
      });

      // Show char codes for debug
      if (DEBUG_MODE) output.innerHTML = charCode;
    };

    var changeState = function(e) {
      letterMag =  Number(document.getElementById('letter-mag').value);
      letterMargin = Number(document.getElementById('letter-margin').value);
      isVertical = document.getElementById('letter-vertical').checked;
      render();
    }

    // User input reaction
    var config_items = document.getElementById('config').getElementsByTagName("input");
    for (var i = config_items.length - 1; i >= 0; i--) {
      config_items[i].addEventListener('change', changeState, false);
    }
    input.addEventListener('input', render, false);

    // 初期処理
    changeState();
  };

  window.addEventListener('DOMContentLoaded', function(){
    preload()
    .then(main)
    .catch(function(err) {
      console.error(err);
    });
  }, false);

})();