var effect_box = document.getElementsByClassName('text_effect');
var effect_box2 = document.getElementsByClassName('text_effect2');


effect_box.click(effect(effect_box, effect_box2, 300, 700));

// 효과 함수
function effect(object, object2, speed, speed2) {

    // 해당 객체안에 들어가있는 모든 텍스트갯수를 불러옵니다.
    var object_len = object.item(0).innerText.length;
    var object2_len = object2.item(0).innerText.length;

    // 해당 객체안에 들어가있는 모든 텍스트를 변수에 할당합니다.
    var object_text = object.item(0).innerText;
    var object2_text = object2.item(0).innerText;

    var object3_len = '1';

    // 기존에 있는 text모두 제거
    object.item(0).innerHTML = '';
    object2.item(0).innerHTML = '';


    for (var i = 0; i <= object_len; i++) {
        // 텍스트를 감싸줄 'p' 태그를 생성합니다.
        n_tag = document.createElement("p");
        // 해당 div에 감싸줄 'p' 태그를 추가합니다.
        object.item(0).append(n_tag);
        // 넣은 'p' 태그 안에 텍스트를 추가합니다.
        n_tag.append(object_text.charAt(i))

        if (i >= object_len) {
            var anima = true;
        }
    }

    if (anima === true) {
        var turn = 0;
        var opacity_txt = setInterval(function () {
            document.querySelectorAll('p').item(turn).style.opacity = '1';
            turn++;

            // object_len 갯수와 turn 갯수가 동일해지면 작동 중지
            if (object_len === turn) {
                clearInterval(opacity_txt);
            }
        }, speed);
    }

    setTimeout(function () {
        for (var ii = 0; ii <= object2_len; ii++) {
            // 텍스트를 감싸줄 'p' 태그를 생성합니다.
            n_tag2 = document.createElement("p");
            // 해당 div에 감싸줄 'p' 태그를 추가합니다.
            object2.item(0).append(n_tag2);
            // 넣은 'p' 태그 안에 텍스트를 추가합니다.
            n_tag2.append(object2_text.charAt(ii))

            if (ii >= object2_len) {
                var anima2 = true;
            }
        }

        if (anima2 == true) {
            var turn2 = 0;
            var opacity2_txt = setInterval(function () {
                document.querySelectorAll('div.text_effect2 > p').item(turn2).style.opacity = '1';
                turn2++;

                // object2_len 갯수와 turn2 갯수가 동일해지면 작동 중지
                if (object2_len === turn2) {
                    clearInterval(opacity2_txt);
                }
            }, speed);
        }
    }, 3300);

    setTimeout(function () {
        for (var iii = 0; iii <= object3_len; iii++) {
            if (iii >= object3_len) {
                var anima3 = true;
            }
        }

        if (anima3 == true) {
            var turn3 = 0;
            var opacity3_txt = setInterval(function () {
                document.querySelectorAll('button').item(turn3).style.opacity = '1';
                turn3++;

                // object2_len 갯수와 turn2 갯수가 동일해지면 작동 중지
                if (object3_len === turn3) {
                    clearInterval(opacity3_txt);
                }
            }, speed2);
        }
    }, 8000);
}
