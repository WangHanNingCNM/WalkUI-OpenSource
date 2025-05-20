var 玩家坐标 = getEntityPos(getLocalPlayerUniqueID());
var 开始传送 = false;
var 坐标X = Math.round(+玩家坐标.x);
var 坐标Y = Math.round(+玩家坐标.y);
var 坐标Z = Math.round(+玩家坐标.z);

var 目标X = 0;
var 目标Y = 0;
var 目标Z = 0;

var 传送距离 = 0;
var 传送延迟 = 0;

var X距离 = 0;
var Y距离 = 0;
var Z距离 = 0;

var X坐标步数 = 0;
var Y坐标步数 = 0;
var Z坐标步数 = 0;

var X最终传送距离 = 0;
var Y最终传送距离 = 0;
var Z最终传送距离 = 0;

var X传送坐标 = 坐标X;
var Y传送坐标 = 坐标Y;
var Z传送坐标 = 坐标Z;

var TICK = 0;
var 耗时 = 0;
var 时间 = 0;
var 已到达 = false;

function Main() {
    const 表单 = `
    {
        "type": "custom_form",
        "title": "§d滴滴打车",
        "content": [
            {
                "type": "input",
                "text": "§a坐标X",
                "default": "",
                "placeholder": "目的地坐标X"
            },
            {
                "type": "input",
                "text": "§a坐标Y",
                "default": "~",
                "placeholder": "目的地坐标Y"
            },
            {
                "type": "input",
                "text": "§a坐标Z",
                "default": "",
                "placeholder": "目的地坐标Z"
            },
            {
                "type": "slider",
                "text": "传送距离",
                "min": 1,
                "max": 50,
                "step": 5,
                "default": 5
            },
            {
                "type": "slider",
                "text": "传送延迟",
                "min": 1,
                "max": 40,
                "step": 1,
                "default": 1
            }
        ]
    }
    `;

    addForm(表单, function (...args) {
        目标X = +args[0];
        目标Y = +args[1];
        目标Z = +args[2];
        传送距离 = +args[3];
        传送延迟 = +args[4];

        if (args[0] === "") {
            clientMessage("未输入X坐标");
            showTipMessage("§c已退出脚本");
            exit();
        } else if (args == -1) {
            clientMessage('你关闭了表单');
            showTipMessage("§c已退出脚本");
            exit();
        } else if (isNaN(args[0])) {
            clientMessage("x坐标不是数字");
            showTipMessage("§c已退出脚本");
            exit();
        } else if (目标X > 30000000) {
            clientMessage('你输入的X坐标太大了');
            clientMessage('X坐标最高为30000000');
            showTipMessage('§c已退出脚本');
            exit();
        } else {
            if (args[1] === "") {
                clientMessage("未输入Y坐标");
                showTipMessage("§c已退出脚本");
                exit();
            } else if (isNaN(args[1])) {
                if (args[1] === "~") {
                    if (args[2] === "") {
                        clientMessage("未输入Z坐标");
                        showTipMessage("§c已退出脚本");
                        exit();
                    } else if (isNaN(args[2])) {
                        clientMessage("你输入的z不是数字");
                        showTipMessage("§c已退出脚本");
                        exit();
                    } else if (目标Z > 30000000) {
                        clientMessage('你输入的Z坐标太大了');
                        clientMessage('Z坐标最高只能为30000000');
                        showTipMessage('§c已退出脚本');
                        exit();
                    } else {
                        X距离 = 目标X - 坐标X;
                        Z距离 = 目标Z - 坐标Z;
                        X坐标步数 = Math.floor(Math.abs(X距离) / 传送距离);
                        Z坐标步数 = Math.floor(Math.abs(Z距离) / 传送距离);
                        X最终传送距离 = Math.abs(X距离) % 传送距离;
                        Z最终传送距离 = Math.abs(Z距离) % 传送距离;
                        Y最终传送距离 = 0;
                        Y坐标步数 = 0;
                        Y距离 = 0;
                    }
                } else {
                    clientMessage("你输入的y不是数字");
                    showTipMessage('§c已退出脚本');
                    exit();
                }
            } else if (目标Y > 30000000) {
                clientMessage('你输入的Y坐标太大了');
                clientMessage('Y坐标最高只能为30000000');
                showTipMessage("§c已退出脚本");
                exit();
            } else {
                if (args[2] === "") {
                    clientMessage("未输入Z坐标");
                    showTipMessage("§c已退出脚本");
                    exit();
                } else if (isNaN(args[2])) {
                    clientMessage("你输入的z不是数字");
                    showTipMessage("§c已退出脚本");
                    exit();
                } else if (目标Z > 30000000) {
                    clientMessage('你输入的Z坐标太大了');
                    clientMessage('Z坐标最高只能为30000000');
                    showTipMessage("§c已退出脚本");
                    exit();
                } else {
                    X距离 = 目标X - 坐标X; // 修改这里
                    Y距离 = 目标Y - 坐标Y; // 修改这里
                    Z距离 = 目标Z - 坐标Z; // 修改这里
                    X坐标步数 = Math.floor(Math.abs(X距离) / 传送距离);
                    Y坐标步数 = Math.floor(Math.abs(Y距离) / 传送距离);
                    Z坐标步数 = Math.floor(Math.abs(Z距离) / 传送距离);
                    X最终传送距离 = Math.abs(X距离) % 传送距离;
                    Y最终传送距离 = Math.abs(Y距离) % 传送距离;
                    Z最终传送距离 = Math.abs(Z距离) % 传送距离;
                }
            }
        }
        开始传送 = true;
    });
}


function onTickEvent() {
    if (开始传送 && TICK % 传送延迟 === 0) {
        传送();
        showTipMessage(`§a当前坐标 §dX：${X传送坐标}，Y：${Y传送坐标}，Z：${Z传送坐标}§a 耗时§b${耗时}§a秒`)
    }
     if (已到达) {
    showTipMessage(`§a已传送到目标坐标，脚本自动退出`);
    exit()
     };
    TICK++;
    时间 = 时间 + 0.05;
    耗时 = Math.round(时间);
}


function 传送() {
    if (X坐标步数 > 0 && Y坐标步数 > 0 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 > 0 && Z坐标步数 == 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == 0 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 > 0 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == 0 && Z坐标步数 == 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == 0 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == 0 && Z坐标步数 == 0) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 > 0 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == 0 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 > 0 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == 0 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        Y坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == -1 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == -1 && Z坐标步数 == 0) {
        X坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == -1 && Z坐标步数 > 0) {
        X坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == -1 && Z坐标步数 == 0) {
        X坐标步数 -= 1;
        Z坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 > 0 && Z坐标步数 > 0) {
        Z坐标步数 -= 1;
        Y坐标步数 -= 1;
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 > 0 && Z坐标步数 == 0) {
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == 0 && Z坐标步数 > 0) {
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == 0 && Z坐标步数 == 0) {
        Y坐标步数 -= 1;
        Z坐标步数 -= 1;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 > 0 && Y坐标步数 == -1 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        X传送坐标 += X距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == 0 && Y坐标步数 == -1 && Z坐标步数 == -1) {
        X坐标步数 -= 1;
        X传送坐标 += X最终传送距离 * (X距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == -1 && Z坐标步数 > 0) {
        Z坐标步数 -= 1;
        Z传送坐标 += Z距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == -1 && Z坐标步数 == 0) {
        Z坐标步数 -= 1;
        Z传送坐标 += Z最终传送距离 * (Z距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 > 0 && Z坐标步数 == -1) {
        Y坐标步数 -= 1;
        Y传送坐标 += Y距离 > 0? 传送距离 : -传送距离;
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == 0 && Z坐标步数 == -1) {
        Y坐标步数 -= 1;
        Y传送坐标 += Y最终传送距离 * (Y距离 > 0? 1 : -1);
        executePluginCommand(`/ww tp ${X传送坐标} ${Y传送坐标} ${Z传送坐标}`);
    } else if (X坐标步数 == -1 && Y坐标步数 == -1 && Z坐标步数 == -1) {
        已到达 = true
        showTipMessage(`§a已传送到目标坐标，脚本自动退出`);
    }
}

function onSendChatMessageEvent(message) {
    if (message === 'tc') {
        exit();
        showTipMessage('§c已退出脚本');
        return true;
    }
}

Main();
clientMessage(`Dev：科技鼠鼠`)