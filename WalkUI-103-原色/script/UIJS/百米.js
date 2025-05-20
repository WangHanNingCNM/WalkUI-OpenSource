const LOCAL_PLAYER_ID = getLocalPlayerUniqueID(); //自身ID
var POS_Y_MAX = 200; //最高Y坐标
var MAX_RANGE = 500; //最远范围
var ATTACK_COUNT = 3; //攻击和点击次数
var AUTO_INTERVAL = 10; //自动传送间隔

//以下用于控制开关或记录数据(上方用于默认调参)
var AutoMode = true; //自动手动切换,默认为手动
var Team = false; //智能队友开关,默认关闭
var autotp = true; //是否自动tp,默认为不
var backPos = null; //自动返回记录的坐标
var backMotion = null; //自动返回所记录的移动值
var target = null; //攻击目标唯一数字ID
var attackCount = 0; //剩余攻击次数
var mode = 2; //控制传送模式,默认Pos
var tpShow = false; //控制传送信息显示，默认为关
var tick = 0;
var stop = false;

//一些代码的封装
const setPos = p => setEntityPos(LOCAL_PLAYER_ID, p.x, p.y, p.z);
const setMotion = m => setEntityMotion(LOCAL_PLAYER_ID, m.x, m.y, m.z);
const getPos = () => getEntityPos(LOCAL_PLAYER_ID);
const getMotion = () => getEntityMotion(LOCAL_PLAYER_ID);
const getRange = (f, t) => Math.hypot(f.x - t.x, f.y - t.y, f.z - t.z);
const click = p => buildBlock(LOCAL_PLAYER_ID, p.x, p.y, p.z, 0);
const COLLISION_X_MIN = 0.1; //最低X碰撞箱
const COLLISION_Y_MIN = 0.1; //最低Y碰撞箱

//寻找目标
function attack() {
  const localPlayerPos = getPos(); //获取自身坐标,用于和其他玩家的坐标进行对比
  let minRange = MAX_RANGE; //最近一个玩家和自身的距离
  for (const id of getPlayerList()) {
    if (id === LOCAL_PLAYER_ID) continue; //遍历到自身则跳过
    const collision = getEntitySize(id);
    if (Team && collision.x < COLLISION_X_MIN && collision.y < COLLISION_Y_MIN) continue;
    const pos = getEntityPos(id);
    if (pos.y >= POS_Y_MAX) continue; //超过高度上限则跳过
    const range = getRange(localPlayerPos, pos);
    if (range < minRange) {
      minRange = range;
      target = id;
    }
  }
  if (target) { //如果寻找到到目标
    attackCount = ATTACK_COUNT; //设置攻击次数
    backPos = localPlayerPos; //记录坐标
    backMotion = getMotion(); //记录移动值
    teleport(); //传送至目标
  } else showTipMessage('§l§e[WalkUI]§b没有合适攻击的目标');
}

function teleport() { //计算偏移并且通过移动值传送到目标位置
  attackCount--;
  const pos = getEntityPos(target);
  if (mode == 1) {
    setPos({
      x: pos.x,
      y: pos.y,
      z: pos.z
    });
  } else {
    setMotion({
      x: pos.x - backPos.x,
      y: pos.y - backPos.y,
      z: pos.z - backPos.z
    });
  }
}

function onTickEvent() {
  if (!stop) return;

  if (autotp && AutoMode) {
    if (!tick--) {
      attack();
      tick = AUTO_INTERVAL;
    }
  } else tick = 0;
  if (backPos) {
    if (mode == 1) {
      if (tpShow) {
        executeCommand("/ww tp " + backPos.x + " " + backPos.y + " " + backPos.z)
      };
      click(backPos);
      attackEntity(target, true);
    } else {
      setPos(backPos);
      click(backPos);
      attackEntity(target, true);
    }
  }
  if (target) {
    if (attackCount) {
      teleport();
    } else {
      if (mode == 1) {
        backPos = backMotion = target = null;
      } else {
        setMotion(backMotion);
        backPos = backMotion = target = null;
      }
    }
  }
}

 function onCallModuleEvent(data) {
  for (key in data) {
    if (key == "value" || key == "fun" || key == "name" || key == "index" || key == "key" || key == "shortcut") continue;
    if (data.index == undefined) eval(key + '=' + data[key])
    if (data.index != undefined) {
      if (data.index == 1) {
        mode = 1;
      } else mode = 2
    }
  }
}

 function onSendChatMessageEvent(message) { // 执行命令
  if (message == 'iaexit') { // 退出脚本
    exit();
    clientMessage('§l§dInfiniteAura§r§b Exit!');
    return true;
  }
}

clientMessage('§lRunAway > Load InfiniteAura §b✔');