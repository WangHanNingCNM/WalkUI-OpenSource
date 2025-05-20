var target = ""; // 目标
var random_string = false; // 随机字符串
var speed = 6; // 速度
var anti_crasher = true; // 拦截命令提示

var mode_1 = true; // 加粗
var mode_2 = false; // 斜体
var mode_3 = false; // 混乱

// 新增变量用于存储自定义范围
var customRange = 6; 

const msg = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";

const menu = `{
    "type": "custom_form",
    "title": "自定义设置",
    "content": [
        {
            "type": "toggle",
            "text": "随机字符串",
            "default": ${random_string? "true" : "false"}
        },
        {
            "type": "toggle",
            "text": "加粗",
            "default": ${mode_1? "true" : "false"}
        },
        {
            "type": "toggle",
            "text": "斜体",
            "default": ${mode_2? "true" : "false"}
        },
        {
            "type": "toggle",
            "text": "混乱",
            "default": ${mode_3? "true" : "false"}
        },
        {
            "type": "slider",
            "text": "刷屏速度",
            "min": 1,
            "max": 50,
            "step": 1,
            "default": ${speed}
        },
        {
            "type": "toggle",
            "text": "反崩溃",
            "default": ${anti_crasher? "true" : "false"}
        },
        {
            "type": "slider",
            "text": "作用范围",
            "min": 1,
            "max": 50,
            "step": 1,
            "default": ${customRange}
        }
    ]
}`;

addForm(menu, function (r, m1, m2, m3, s, a, range) {
    random_string = Boolean(r);
    mode_1 = Boolean(m1);
    mode_2 = Boolean(m2);
    mode_3 = Boolean(m3);
    speed = parseInt(s, 10);
    anti_crasher = Boolean(a);
    customRange = parseInt(range, 10);
    // 使用自定义范围设置目标
    target = "@a[rm=0.1,r=" + customRange + "]"; 
});

function get_mode(mode_1, mode_2, mode_3) {
    var msg = "";
    if (mode_1) {
        msg += "§l";
    } else if (mode_2) {
        msg += "§o";
    } else if (mode_3) {
        msg += "§k";
    }
    return msg;
}

function spawn_string(bool, length) {
    if (bool) {
        var output = "";
        for (let i = 0; i < length; i++) {
            switch (Math.round(Math.random())) {
                case 0:
                    output += "O";
                    break;
                case 1:
                    output += "o";
                    break;
            }
        }
        return output;
    } else {
        return "";
    }
}

function onTickEvent() {
    if (target!== "") {
        for (let i = 0; i < speed; i++) {
            executeCommand("/w " + target + " " + msg + spawn_string(random_string, 6));
        }
    }
}

function onSendChatMessageEvent(message) {
    if (message === '退出光环模式') {
        clientMessage('§b[坠落] §r卡人已关闭.');
        exit();
        return true;
    }
}

function onCommandOutputEvent(type, args, value) {
    if (anti_crasher) {
        return true;
    }
}

clientMessage("§b[坠落] §r外传倒卖本JS司全加,输入退出踢人可关闭JS.");
