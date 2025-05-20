var 迪迦 = "/ww effect 16 99999999 255 false"
var 欧布 = "/ww effect 16 0 0 false"
var 盖亚 = "/ww hide false"
var 贝利亚 = 40
var 赛罗 = "§g§l你已拥有§a无限夜视\n§g输入tc退出变身"

function onTickEvent() {
    贝利亚++
    if (贝利亚 >= 40) {
        executeCommand(迪迦)
        贝利亚 = 0
    }
}
executeCommand(盖亚)

function onSendChatMessageEvent(message) {
    if (message == 'tc') {
        clientMessage('§e无限夜视已停止')
        executeCommand(欧布)
        exit()
        return true;
    }
}