var 玩家坐标 = []
var 玩家属性 = [];
var 玩家血量 = 20;
var x = 0;
var y = 0;
var z = 0;

function onTickEvent() {
    if (玩家血量 === 0) {
        executePluginCommand(`/ww tp ${x} ${y} ${z}`);
        showTipMessage(`§a已传送到死亡地点`);
    }
    玩家坐标 = getEntityPos(getLocalPlayerUniqueID());
    玩家属性 = getEntityAttribute(getLocalPlayerUniqueID(), "minecraft:health");
    玩家血量 = 玩家属性.current;
    x = 玩家坐标.x;
    y = 玩家坐标.y - 3.55;
    z = 玩家坐标.z;
}

function onSendChatMessageEvent(message) {
    if (message === 'tc') {
        exit();
        showTipMessage('§c已退出脚本');
        return true;
    }
}

showTipMessage(`§e已加载原地复活`);
clientMessage(`Dev：科技鼠鼠`)