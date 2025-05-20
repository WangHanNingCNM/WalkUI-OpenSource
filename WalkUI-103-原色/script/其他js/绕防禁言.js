//作者:荦荦
clientMessage('§b[绕禁言] §e已切换发送消息为/me模式请使用右边的快捷消息输入，输入"指令"执行原版指令，输入"插件指令"执行插件命令(/ww)')
clientMessage('§b[绕禁言] §e违规名无法使用/me，请输入"tell"呼出表单')
clientMessage('§b[绕禁言] §e输入"退出绕禁言"退出脚本')

var i = 0
var player_name_list = getPlayerNameList()

function getPlayerNameList() {
    const list = getWorldPlayerList()
    var output = ["@a"]
    for (i in list) {
        output.push(list[i].name)
    }
    return output
}

function tell_table(){
const custom_form = `
  {
    "type": "custom_form",
    "title": "tell发送消息",
    "content": [
      {
        "type": "label",
        "text": "tell适合私聊或违规名"
      },
      {
        "type": "toggle",
        "text": "tell",
        "default": true
      },
      {
        "type": "input",
        "text": "点击输入聊天消息",
        "default": "",
        "placeholder": " "
      },
       {
        "type": "dropdown",
        "text": "选择目标",
        "options": ` + JSON.stringify(player_name_list) + `
    }
    ]
  }
`;
addForm(custom_form, function (...args) {
if (args[1] == 1){
var mode = "/tell "
var player = args[3]
executeCommand(mode + player_name_list[player] + " §r " + args[2])
}
})
}

function Command_table(){
const custom_form = `
  {
    "type": "custom_form",
    "title": "原版指令",
    "content": [
      {
        "type": "input",
        "text": "输入指令",
        "default": "",
        "placeholder": " "
      }
    ]
  }
`;
addForm(custom_form, function (...args) {
let message = args[0]
executeCommand(message)
})
}

function PluginCommand_table(){
const custom_form = `
  {
    "type": "custom_form",
    "title": "插件指令(/ww)",
    "content": [
      {
        "type": "input",
        "text": "输入插件指令",
        "default": "",
        "placeholder": " "
      }
    ]
  }
`;
addForm(custom_form, function (...args) {
let message = args[0]
executeCommand(message)
})
}

function onSendChatMessageEvent(mes) {
    if (mes == "tc") {
        exit()
        clientMessage('§b[绕禁言] §e脚本已关闭')
        return true
    }
    if (mes == "tell") {
       tell_table()
        return true
    }
    if (mes == "指令") {
       Command_table()
        return true
    }
    if (mes == "插件指令") {
       PluginCommand_table()
        return true
    }
        if (i == 0) {
        Message = mes
            i = 1
            return true
        } else if (i == 1) {
            i = 0
        }
}

function onTickEvent() {
        if (i == 1) {
            executeCommand("/me " + Message)
            i = 0
      }
}