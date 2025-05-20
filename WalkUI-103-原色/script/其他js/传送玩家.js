function SendFindCommand(x,y,z,dx,dy,dz) {
    if (!mode.findmode) {
        executeCommand(`/w @s @e[x=${x},y=${y},z=${z},dx=${dx},dy=${dy},dz=${dz}]`);
    }else if (mode.findmode === 4) {
        executeCommand(`/w @s @e[type=${family[mode.findmode]},x=${x},y=${y},z=${z},dx=${dx},dy=${dy},dz=${dz}]`);
    }else {
        executeCommand(`/w @s @e[family=${family[mode.findmode]},x=${x},y=${y},z=${z},dx=${dx},dy=${dy},dz=${dz}]`);
    }
}

function GetDistance(max,min) {
    if (max - min <= 1) {
    max = 300;
    min = 100;
    }
    return Math.floor(Math.abs(max - min) * -1);
}

function Binary(isplayer,axis) {
    if (axis === 'x') {
        if (isplayer) {
            if (player.midX < 0 && !player.Xfirstsend) {
                player.maxX = player.midX;
            }else if (player.midX >= 0 && !player.Xfirstsend) {
                player.maxX = player.midX;
            }
            if (player.Xfirstsend) player.Xfirstsend = false;
            player.isplayer = true;
            player.midX = player.minX + Math.floor(((player.maxX - player.minX) / 2 ));
            SendFindCommand(player.midX,player.maxY,player.maxZ,GetDistance(player.midX,player.minX),GetDistance(player.maxY,player.minY),GetDistance(player.maxZ,player.minZ));
        }else {
            if (player.midX < 0 && !player.Xfirstsend) {
                player.minX = player.midX;
            }else if (player.midX >= 0 && !player.Xfirstsend) {
                player.minX = player.midX;
            }
            player.isplayer = false;
            player.midX = player.midX + Math.floor(((player.maxX - player.midX) / 2 ));
            SendFindCommand(player.midX,player.maxY,player.maxZ,GetDistance(player.midX,player.minX),GetDistance(player.maxY,player.minY),GetDistance(player.maxZ,player.minZ));
        }
    }else if (axis === 'y') {
        if (isplayer) {
            if (player.midY < 0 && !player.Yfirstsend) {
                player.maxY = player.midY;
            }else if (player.midY >= 0 && !player.Yfirstsend) {
                player.maxY = player.midY;
            }
            if (player.Yfirstsend) player.Yfirstsend = false;
            player.isplayer = true;
            player.midY = player.minY + Math.floor(((player.maxY - player.minY) / 2 ));
            SendFindCommand(player.maxX + 100 ,player.midY,player.maxZ,GetDistance(player.maxX,player.minX),GetDistance(player.midY,player.minY),GetDistance(player.maxZ,player.minZ));
        }else {
            if (player.midY < 0 && !player.Yfirstsend) {
                player.minY = player.midY;
            }else if (player.midY >= 0 && !player.Yfirstsend) {
                player.minY = player.midY;
            }
            player.isplayer = false;
            player.midY = player.midY + Math.floor(((player.maxY - player.midY) / 2 ));
            SendFindCommand(player.maxX + 100 ,player.midY,player.maxZ,GetDistance(player.maxX,player.minX),GetDistance(player.midY,player.minY),GetDistance(player.maxZ,player.minZ));
        }
    }else if (axis === 'z') {
        if (isplayer) {
            if (player.midZ < 0 && !player.Zfirstsend) {
                player.maxZ = player.midZ;
            }else if (player.midZ >= 0 && !player.Zfirstsend) {
                player.maxZ = player.midZ;
            }
            if (player.Zfirstsend) player.Zfirstsend = false;
            player.isplayer = true;
            player.midZ = player.minZ + Math.floor(((player.maxZ - player.minZ) / 2 ));
            SendFindCommand(player.maxX + 100 ,player.maxY + 100 ,player.midZ,GetDistance(player.maxX,player.minX),GetDistance(player.maxY,player.minY),GetDistance(player.midZ,player.minZ));
        }else {
            if (player.midZ < 0 && !player.Zfirstsend) {
                player.minZ = player.midZ;
            }else if (player.midZ >= 0 && !player.Zfirstsend) {
                player.minZ = player.midZ;
            }
            player.isplayer = false;
            player.midZ = player.midZ + Math.floor(((player.maxZ - player.midZ) / 2 ));
            SendFindCommand(player.maxX + 100 ,player.maxY + 100 ,player.midZ,GetDistance(player.maxX,player.minX),GetDistance(player.maxY,player.minY),GetDistance(player.midZ,player.minZ));
        }
    }
}

globalThis.onCommandOutputEvent = function (type, args, value) {
    if (args[1].list[3] === undefined) args[1].list[3] = '';
    if (mode.time >= 100) {
        clientMessage('§4[§4Warning§4] §e发生未知错误\n§4[§4Warning§4] §e脚本自动退出');
        exit();
    }else {
        mode.time ++;
    }
    if (player.maxX - player.minX <= 1 && player.maxZ - player.minZ <= 1 && player.maxZ - player.minZ <= 1 && player.inworld) {
        clientMessage(`§a[§6Success§a] §eName : §b${player.name} §eX : §b${player.maxX} §eY : §b${player.maxY} §eZ : §b${player.maxZ}`);
        if (mode.teleport === 1) {
            thread(function () {
                executeCommand(`/teleport ${player.maxX} ${player.maxY} ${player.maxZ}`);
                exit();
            }, mode.teleporttime);
        }else if (mode.teleport === 2) {
            thread(function () {
                executePluginCommand(`/ww tp ${player.maxX} ${player.maxY} ${player.maxZ}`);
                exit();
            }, mode.teleporttime);
        }else {
            exit();
        }
    }else if (player.inworld) {
        if (player.maxX - player.minX > 1) {
            Binary(args[1].list[3].includes(player.name),'x');
        }else if (player.maxY - player.minY > 1) {
            Binary(args[1].list[3].includes(player.name),'y');
        }else if (player.maxZ - player.minZ > 1) {
            Binary(args[1].list[3].includes(player.name),'z');
        }
    }
    if (args[1].list[3].includes(player.name) && !player.inworld) {
        player.inworld = true;
        Binary(true,'x')
    }else if (!player.inworld) {
        if (args[1].key === 'commands.generic.permission.selector') {
            clientMessage('§4[§4Warning§4] §e当前服务器无权限使用命令\n§4[§4Warning§4] §e脚本自动退出');
            exit();
        }else {
            clientMessage('§4[§4Warning§4] §e当前查找目标不在此维度\n§4[§4Warning§4] §e脚本自动退出');
            exit();
        }
    }
    return true;
}

globalThis.onSendChatMessageEvent = function (text) {
    if (text === "tc") {
        clientMessage('§e脚本已退出');
        exit();
        return true;
    }
}

function Main() {
    const playerlist = getWorldPlayerList();
    let playercustom_form = `"${playerlist[0].name}"`;
    for (let i = 1;i < playerlist.length;i++) {
        playercustom_form = playercustom_form + `,"${playerlist[i].name}"`;
    }
    const listcustom_form = `{"type": "custom_form","title": "查找玩家坐标","content": [{"type": "dropdown","text": "选择玩家","options": [${playercustom_form}]},{"type": "dropdown","text": "查找模式","options": ["实体","玩家","生物","非生物","掉落物"]},{"type": "input","text": "目标名称","default": "","placeholder": "留空则会使用选择的玩家名称"},{"type": "step_slider","text": "传送方式","steps": ["不传送", "原版命令", "插件命令"],"default": 0},{"type": "slider","text": "n秒后传送","min": 0,"max": 10,"step": 1,"default": 0}]}`;
    addForm(listcustom_form, function (...args) {
        mode.findmode = args[1];
        mode.teleport = args[3];
        mode.teleporttime = args[4] * 1000;
        player.name = args[2];
        if (args[2] === '') player.name = playerlist[args[0]].name;
        if (!mode.findmode) {
            executeCommand('/w @s @e[rm=0]');
        }else if (mode.findmode === 4) {
            executeCommand(`/w @s @e[rm=0,type=${family[mode.findmode]}]`);
        }else{
            executeCommand(`/w @s @e[rm=0,family=${family[mode.findmode]}]`);
        }
    })
}

const player = {
  name: '',
  maxX: 30000000,
  midX: 0,
  minX: -30000000,
  maxY: 320,
  midY: 0,
  minY: -64,
  maxZ: 30000000,
  midZ: 0,
  minZ: -30000000,
  isplayer: true,
  Xfirstsend: true,
  Yfirstsend: true,
  Zfirstsend: true,
  inworld: false
};

const mode = {
  findmode: 0,
  time: 0,
  teleport: 0,
  teleporttime: 0
};

const family = ['','player','mob','inanimate','item'];
Main();