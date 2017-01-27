'use strict';

;(function(){

    var SS_URL = "./assets/spritesheet.png";
    var ATLAS_URL = "./assets/atlas.json";
    // var SRC_LETTER_WIDTH = 168;
    // var SRC_LETTER_HEIGHT = 197;
    // var userLetterWidth = 168/2;
    // var userLetterHeight = 197/2 | 0;
    var spritesheet;
    var map;
    // 空白プロパティ
    var SPACE_PROP = {
        x: -1000,
        y: -1000,
        w: 84,
        h: 197
    };

    //  App initialize
    window.addEventListener('DOMContentLoaded', function(){

        spritesheet = new Image();
        spritesheet.src = SS_URL;
        spritesheet.onload = xhrGet(ATLAS_URL, function(res){
            // document.body.appendChild(spritesheet);
            var counter = 0;
            var checkLoad = function (){
                if (spritesheet.complete){
                    init();
                } else {
                    counter++;
                    if (counter < 8){
                        setTimeout(checkLoad,100);
                    }
                }
            }
            // map load
            map = (JSON.parse(res))['frames'];
            // console.log(map);
            checkLoad();
        });

        spritesheet.onerror = function(err){
            console.log(err);
            alert('画像のロードに失敗しました');
        }

    },false);

    function init(){
        var input = document.getElementById('input');
        var canvas = document.getElementById('out-canvas');
        var letterMag = null;
        var letterMargin = null;
        var isVertical = true;
        var output = document.getElementById('out'); //DEBUG

        var render = function(){
            var ctx = canvas.getContext('2d');
            var text = (input.value != "") ? input.value : " ";
            var l, currentPos;
            var letters = [];
            var charCode = ""; //debug

            if (letterMag < 0) letterMag =  0.05;

            // 前処理
            for (var i = 0; i < text.length; i++){
                l = map[text.charAt(i)] || SPACE_PROP;
                // l = map[text.charCodeAt(i)] || SPACE_PROP;
                // 濁点付きの「あ」など
                if (text.charAt(i+1) === "゛"){
                    ["あ","い","う","え","お","ア","イ","エ","オ"].forEach(function(a){
                        if (text.charAt(i) === a){
                            l = map[text.charAt(i)+"2"];
                            text = text.replace(text.charAt(i+1),"");
                        }
                    });
                }
                letters.push(l);
            }

            //  canvasサイズ再計算
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = 0;
            canvas.height = 0;
            letters.forEach(function(l,i){
                if (isVertical){
                    canvas.height += l.h*letterMag;
                    canvas.width = Math.max(l.w*letterMag, canvas.width);
                    if (i > 0) canvas.height += letterMargin;
                } else {
                    canvas.width += l.w*letterMag;
                    canvas.height = Math.max(l.h*letterMag, canvas.height);
                    if (i > 0) canvas.width += letterMargin;
                }
            });

            //  描画
            currentPos = 0;
            letters.forEach(function(l,i){
                if (isVertical){
                    ctx.drawImage(spritesheet, l.x, l.y, l.w, l.h, 0, currentPos+letterMargin*i, l.w*letterMag, l.h*letterMag);
                    currentPos += l.h * letterMag;
                } else {
                    ctx.drawImage(spritesheet, l.x, l.y, l.w, l.h, currentPos+letterMargin*i, 0, l.w*letterMag, l.h*letterMag);
                    currentPos += l.w * letterMag;
                }

                charCode += text.charCodeAt(i)+", "; //debug
            });
            // output.innerHTML = charCode; //debug

            //  描画
            // currentPos = 0;
            // for (var i =0; i < text.length; i++){
                // l = map[text.charAt(i)] || SPACE_PROP;
                // // var l = map[text.charCodeAt(i)] || SPACE_PROP;

                // console.log(text.charAt(i));
                // index = LETTER_MAP[text.charAt(i)] || 0;
                // ctx.drawImage(spritesheet, SRC_LETTER_WIDTH*index, 0, SRC_LETTER_WIDTH, SRC_LETTER_HEIGHT, userLetterWidth*i+margin*i, 0, userLetterWidth, userLetterHeight);

                // ctx.drawImage(spritesheet, l.x, l.y, l.w, l.h, currentPos+letterMargin*i, 0, l.w*letterMag, l.h*letterMag);
                // currentPos += l.w * letterMag;

                // charCode += text.charCodeAt(i)+", "; //debug
            // }

        };

        var changeStatus = function(e){
            letterMag =  Number(document.getElementById('letter-mag').value);
            letterMargin = Number(document.getElementById('letter-margin').value);
            isVertical = document.getElementById('letter-vertical').checked;
            // console.log(letterMag, letterMargin);
            render();
        }

        var config_items = document.getElementById('config').getElementsByTagName("input");
        for (var i = config_items.length - 1; i >= 0; i--) {
            config_items[i].addEventListener('change', changeStatus, false);
        }
        input.addEventListener('input', render, false);

        changeStatus();

    } //--init

})();