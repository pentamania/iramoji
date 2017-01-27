/*
* Use to format the Texture Packer-output file to letter-frame map.
*
* @example
"capital_a.png": {
    "frame": {"x":185,"y":0,"w":168,"h":197},
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {"x":0,"y":0,"w":168,"h":197},
    "sourceSize": {"w":168,"h":197},
    "pivot": {"x":0.5,"y":0.5}
}

 |
 v

"A": {
    "x": 185,
    "y": 0,
    "w": 168,
    "h": 197
}

* How to run : 'node format.js [srcFilePath] [outputPath]'
*/
'use strict';

const fs = require('fs');
const hepburn = require('hepburn');
// const japanese = require('japanese');
const minimist = require('minimist');
const args = process.argv.slice(2);

const srcPath = args[0];
if (!srcPath) {
    console.error("Set src path!");
    return;
}
const outputPath = args[1] || "atlas.json";
const compress = args[2] || false;
// let filePath = './asset/raw-map.json';
const SYMBOLS_MAP = {
    'atmark': "@",
    'period': "\.",
    'colon': "\:",
    'comma': "\,",
    'semicolon': "\;",
    'slash': "\/",
    'hyphen': "\-",
    'underbar': "_",
    'quot_right': "\'",
    'quot_left': "\’",
    'doublequot_right': "\“",
    'doublequot_left': "\”",
    'kakko_right': "\(",
    'kakko_left': "\)",
    'alphabet_and': "\&",
    'exclamation': "\!",
    'question': "\?",
    'kuten': "。",
    'touten': "\、",
    'nakaguro': "\・",
    'yokobou': "\ー",
    'tatebou': "\|",
    'dakuten': "\゛",
    'handakuten': "\゜"
}

// Start
fs.readFile(srcPath, 'utf8', function (err, text) {
    if (err) throw err;

    let newText = text;

    if (text.match(/\.(png)/)){
        // console.log('match!');

        // 拡張子、hoka_x_...等の接頭辞を削除
        let reg = /(\.png|hoka[0-9]*_[0-9]+_)/g;
       newText = newText.replace(reg, "");

        // 不要な行(プロパティ)を削除・整形
        // newText = newText.replace(/.*(rotated|trimmed|pivot|spriteSourceSize).*\r\n/g, "");
        let temp = JSON.parse(newText);
        let obj = temp.frames;
        Object.keys(obj).forEach(function(key){
            // console.log(key);
            Object.keys(obj[key]).forEach(function(prop){
                if (prop !== 'frame'){
                    delete obj[key][prop];
                }
            });

            obj[key] = obj[key]['frame'];
        });

        if (compress) {
            newText = JSON.stringify(temp);
        } else {
            newText = JSON.stringify(temp, null, 4);
        }

        // アルファベット大文字：capital_a
        if (newText.match(/capital_/)) {
            newText.match(/capital_[a-z]/g).forEach(function(str){
                let newStr = str.substr((str.length-1)).toUpperCase();
                newText = newText.replace(str, newStr);
            });
        }

        // アルファベット小文字：lower_a
        if (newText.match(/lower_/)) {
            newText.match(/lower_[a-z]/g).forEach(function(str){
                let newStr = str.substr((str.length-1));
                newText = newText.replace(str, newStr);
            });
        }

        // ひらがな：hiragana_00_xx(_small) （濁点付きの「あ」は"あ2"とする）
        if (newText.match(/hiragana_/)) {
            newText.match(/hiragana_[0-9]+(_[a-z]+_[a-z]+|_[a-z]+)/g).forEach(function(str){
                let seg = str.split('_');
                let newStr = hepburn.toHiragana(seg[2]); // du, daなどの判定部分を取得

                // 小文字の場合：文字コードを１シフトして変換
                if (seg[3]) {
                    newStr = String.fromCharCode(newStr.charCodeAt(0)-1);
                }

                // 特殊
                switch(seg[2]){
                    case "vu":
                        newStr = "う2";break;
                    case "zi":
                        newStr = "じ";break;
                    case "ti":
                        newStr = "ち";break;
                    case "di":
                        newStr = "ぢ";break;
                    case "du":
                        newStr = "づ";break;
                    default:
                        break;
                }
                newText = newText.replace(str, newStr);
            });
        }

        // カタカナ：katakana_00_xx(_small)
        if (newText.match(/katakana_/)) {
            newText.match(/katakana_[0-9]+(_[a-z]+_[a-z]+|_[a-z]+)/g).forEach(function(str){
                let seg = str.split('_');
                let newStr = hepburn.toKatakana(seg[2]); // 判定部分を取得
                // console.log("string：",str);
                // 小文字の場合：文字コードを１シフトして変換
                if (seg[3]){
                    // console.log(newStr.charCodeAt(0));
                    newStr = String.fromCharCode(newStr.charCodeAt(0)-1);
                }
                // 特殊
                switch(seg[2]){
                    case "vu":
                        newStr = "ヴ";break;
                    case "zi":
                        newStr = "ジ";break;
                    case "ti":
                        newStr = "チ";break;
                    case "di":
                        newStr = "ヂ";break;
                    case "du":
                        newStr = "ヅ";break;
                    default:
                        break;
                }
                newText = newText.replace(str, newStr);
                // console.log("変換後", newStr);
            });
        }

        // numbers：アラビア数字、漢数字、ローマ数字

        // arabian num: number_0
        if (newText.match(/number_[0-9]/)) {
            newText.match(/number_[0-9]/g).forEach(function(str){
                let newStr = str.substr((str.length-1));
                newText = newText.replace(str, newStr);
            })
        }

        // // chinese num: TODO
        // if (newText.match(/number_kanji[0-9]+/)) {
        //     newText.match(/number_kanji[0-9]+/).forEach(function(str){
        //         let _num = Number(str.substr(str.length-1,2));
        //         console.log(_num);
        //         switch (_num){
        //             case 1:
        //                 newText = newText.replace(str, "一");
        //                 break;
        //             case 11:
        //                 newText = newText.replace(str, "百"); //TODO...
        //                 break;
        //         }
        //     });
        // }

        // // roman_num: TODO
        // if (newText.match(/roman_number[0-9]+/)) {
        //     newText.match(/roman_number[0-9]+/).forEach(function(str){
        //         let _num = Number(str.substr(str.length-1,2));
        //         console.log(_num);
        //         switch (_num){
        //             case 1:
        //                 newText = newText.replace(str, "Ⅰ");
        //                 break;
        //             case 2:
        //                 newText = newText.replace(str, "Ⅱ"); //TODO
        //                 break;
        //         }
        //     });
        // }

        // その他記号など：
        for (let key in SYMBOLS_MAP){
            console.log(key)
            newText = newText.replace(key, SYMBOLS_MAP[key]);
        }

        // newText = newText.replace('atmark', "@".charCodeAt(0));
        // newText = newText.replace('period', "\.");
        // newText = newText.replace('colon', "\:");
        // newText = newText.replace('comma', "\,");
        // newText = newText.replace('semicolon', "\;");
        // newText = newText.replace('slash', "\/");
        // newText = newText.replace('hyphen', "\-");
        // newText = newText.replace('underbar', "_");
        // newText = newText.replace('quot_right', "\'");
        // newText = newText.replace('quot_left', "\’");
        // newText = newText.replace('doublequot_right', "\"".charCodeAt(0));
        // newText = newText.replace('doublequot_right', "\“");
        // newText = newText.replace('doublequot_left', "\”");
        // newText = newText.replace('kakko_right', "\(");
        // newText = newText.replace('kakko_left', "\)");
        // newText = newText.replace('alphabet_and', "\&");
        // newText = newText.replace('exclamation', "\!");
        // newText = newText.replace('question', "\?");
    }

    fs.writeFile(outputPath, newText);
});