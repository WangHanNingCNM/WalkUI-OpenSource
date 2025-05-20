let x正范围 = '2'
let x负范围 = '2'
let y正范围 = '2'
let y负范围 = '2'
let z正范围 = '2'
let z负范围 = '2'
let 延迟 = '1'
let 开始 = 0
let tick = 0

function 自动破坏() {
    const id = getLocalPlayerUniqueID()
    const pos = getEntityPos(id)
    for (let i = -x负范围; i <= x正范围; i++) {
        for (let j = -y负范围 - 1; j <= y正范围 - 1; j++) {
            for (let k = -z负范围; k <= z正范围; k++) {
                if (getBlock(pos.x + i, pos.y + j, pos.z + k).namespace !== 'minecraft:air') {
                    destroyBlock(id, pos.x + i, pos.y + j, pos.z + k, 0)
                }
            }
        }
    }
}

function onTickEvent() {
    if (开始 && tick % 延迟 === 0) {
        自动破坏()
    }
    tick++
}

function onSendChatMessageEvent(message) {
    if (message == 'tc') {
        clientMessage('§b[自动破坏] §e脚本已关闭')
        exit()
        return true
    }
}

function Main() {
    const form = `{"type": "custom_form","title": "范围破坏参数","content": [{"type": "input","text": "延迟","default": ${JSON.stringify(延迟)},"placeholder": "20为一秒"},{"type": "input","text": "x+","default": ${JSON.stringify(x正范围)},"placeholder": "…"},{"type": "input","text": "x-","default": ${JSON.stringify(x负范围)},"placeholder": "…"},{"type": "input","text": "y+","default": ${JSON.stringify(y正范围)},"placeholder": "…"},{"type": "input","text": "y-","default": ${JSON.stringify(y负范围)},"placeholder": "…"},{"type": "input","text": "z+","default": ${JSON.stringify(z正范围)},"placeholder": "…"},{"type": "input","text": "z-","default": ${JSON.stringify(z负范围)},"placeholder": "…"}]}`;
    addForm(form, function(...args) {
        if (args == -1) {
            exit()
            return
        } else {
            延迟 = +args[0]
            x正范围 = +args[1]
            x负范围 = +args[2]
            y正范围 = +args[3]
            y负范围 = +args[4]
            z正范围 = +args[5]
            z负范围 = +args[6]
            开始 = 1
        }
    })
}
Main()

clientMessage("§l§d§f=>§e*自动破坏*加载成功✔")