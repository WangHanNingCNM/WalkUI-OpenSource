//板娘的JS
var i = 0
var Chat = false
var Message = ""

var set = "[渐变消息]"

sendChatMessage()
clientMessage("§e钢板为你加喵")
clientMessage("§e聊天框输入-§5tc§e→关闭脚本")
clientMessage("§e设置=打开设置界面")

function getTime(mode) {
    if (mode == 0) {
        var d = new Date()
        return d.getFullYear() + "年 " + d.getMonth() + "月 " + d.getDate() + "日 " + d.getHours() + "时 " + d.getMinutes() + "分 " + d.getSeconds() + "秒"
    } else if (mode == 1) {
        var date = new Date()
        return date
    }
}

function getText(string, strA, strB) {
    let start = string.indexOf(strA) + strA.length
    let finish = string.indexOf(strB)
    return string.substring(start, finish)
}

function randomColor(mode) {
    function random(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
    if (mode == "深色") {
        let color = random(1, 10)
        if (color == 1) {
            return "1"
        }
        if (color == 2) {
            return "2"
        }
        if (color == 3) {
            return "3"
        }
        if (color == 4) {
            return "4"
        }
        if (color == 5) {
            return "5"
        }
        if (color == 6) {
            return "6"
        }
        if (color == 7) {
            return "7"
        }
        if (color == 8) {
            return "8"
        }
        if (color == 9) {
            return "9"
        }
        if (color == 10) {
            return "0"
        }
    }
    if (mode == "浅色") {
        let color = random(1, 6)
        if (color == 1) {
            return "a"
        }
        if (color == 2) {
            return "b"
        }
        if (color == 3) {
            return "c"
        }
        if (color == 4) {
            return "d"
        }
        if (color == 5) {
            return "e"
        }
        if (color == 6) {
            return "f"
        }
    }
    if (mode == "all") {
        let color = random(1, 16)
        if (color == 1) {
            return "1"
        }
        if (color == 2) {
            return "2"
        }
        if (color == 3) {
            return "3"
        }
        if (color == 4) {
            return "4"
        }
        if (color == 5) {
            return "5"
        }
        if (color == 6) {
            return "6"
        }
        if (color == 7) {
            return "7"
        }
        if (color == 8) {
            return "8"
        }
        if (color == 9) {
            return "9"
        }
        if (color == 10) {
            return "0"
        }
        if (color == 11) {
            return "a"
        }
        if (color == 12) {
            return "b"
        }
        if (color == 13) {
            return "c"
        }
        if (color == 14) {
            return "d"
        }
        if (color == 15) {
            return "e"
        }
        if (color == 16) {
            return "f"
        }
    }
}

function RainbowMessage(mes, mode) {
    let a = mes.split("")
    let result = ""
    let color = "4c6e2a3b195d".split("")
    if (mode == "按序") {
        let n = 0
        for (sb in a) {
            result = result + "§" + color[n] + a[sb]
            n++;
            if (n >= 12) {
                n = 0
            }
        }
        return result
    } else {
        for (sb in a) {
            result = result + "§" + randomColor(mode) + a[sb]
        }
        return result
    }
}

function getPos() {
    let p = getEntityPos(getLocalPlayerUniqueID())
    return "[" + Math.round(p.x) + "," + Math.round(p.y) + "," + Math.round(p.z) + "]"
}

function settings() {
    addForm('{"type":"custom_form","title":"设置小尾巴","content":[{"type":"input","text":"你好","placeholder":"","default":"' + set + '"},{"type":"toggle","text":"聊天室模式","default":false}]}', function(ab, chat) {
        set = ab
        Chat = chat
    })
}

settings()

function onSendChatMessageEvent(mes) {
    if (mes == "tc") {
        exit()
        clientMessage("§e已退出")
        return true
    }
    if (mes == "设置") {
        settings()
        return true
    }
    if (Chat) {
        let item = getEntityCarriedItem(getLocalPlayerUniqueID())
        let aset = set.replace(/\[消息\]/g, mes)
        aset = aset.replace(/\[时间A\]/g, getTime(0))
        aset = aset.replace(/\[时间B\]/g, getTime(1))
        aset = aset.replace(/\[坐标\]/g, getPos())
        aset = aset.replace(/\[昵称\]/g, getEntityName(getLocalPlayerUniqueID()))
        aset = aset.replace(/\[回车\]/g, "\n")
        aset = aset.replace(/\[手持\]/g, item.name)
        aset = aset.replace(/\[深色消息\]/g, RainbowMessage(mes, "深色"))
        aset = aset.replace(/\[浅色消息\]/g, RainbowMessage(mes, "浅色"))
        aset = aset.replace(/\[彩虹消息\]/g, RainbowMessage(mes, "all"))
        aset = aset.replace(/\[渐变消息\]/g, RainbowMessage(mes, "按序"))
        aset = aset.replace(/\[浅色\]/g, "§" + randomColor("浅色"))
        aset = aset.replace(/\[深色\]/g, "§" + randomColor("深色"))
        aset = aset.replace(/\[全部\]/g, "§" + randomColor("all"))
        sendChatMessage("." + aset)
        aset = ""
        return true
    } else {
        if (i == 0) {
            i = 1
            Message = mes
            return true
        } else if (i == 1) {
            i = 0
        }
    }
}

function onTickEvent() {
    if (Chat == false) {
        if (i == 1) {
            let item = getEntityCarriedItem(getLocalPlayerUniqueID())
            let aset = set.replace(/\[消息\]/g, Message)
            aset = aset.replace(/\[时间A\]/g, getTime(0))
            aset = aset.replace(/\[时间B\]/g, getTime(1))
            aset = aset.replace(/\[坐标\]/g, getPos())
            aset = aset.replace(/\[昵称\]/g, getEntityName(getLocalPlayerUniqueID()))
            aset = aset.replace(/\[回车\]/g, "\n")
            aset = aset.replace(/\[手持\]/g, item.name)
            aset = aset.replace(/\[深色消息\]/g, RainbowMessage(Message, "深色"))
            aset = aset.replace(/\[浅色消息\]/g, RainbowMessage(Message, "浅色"))
            aset = aset.replace(/\[彩虹消息\]/g, RainbowMessage(Message, "all"))
            aset = aset.replace(/\[渐变消息\]/g, RainbowMessage(Message, "按序"))
            aset = aset.replace(/\[浅色\]/g, "§" + randomColor("浅色"))
            aset = aset.replace(/\[深色\]/g, "§" + randomColor("深色"))
            aset = aset.replace(/\[全部\]/g, "§" + randomColor("all"))
            sendChatMessage(aset)
            Message = ""
            aset = ""
        }
    }
}