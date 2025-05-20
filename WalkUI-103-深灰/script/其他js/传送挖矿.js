function onSendChatMessageEvent(_0x2bb558) {
  if (_0x2bb558 == 'tc') return clientMessage('§3自动挖矿 §e脚本已关闭'), exit(), true;
  if (_0x2bb558 == '寻矿') return 获取矿物坐标(), t = 0, true;
}
let id = getLocalPlayerUniqueID();
function 判断周围方块(_0x139f7a, _0xba0a2a, _0x19118f, _0x593ba7) {
  let _0x469ae3 = 0;
  for (let _0x4c4915 = _0x139f7a - 1; _0x4c4915 <= _0x139f7a + 1; _0x4c4915++) {
    for (let _0xdeb4eb = _0x19118f - 1; _0xdeb4eb <= _0x19118f + 1; _0xdeb4eb++) {
      for (let _0x584455 = _0xba0a2a - 1; _0x584455 <= _0xba0a2a + 1; _0x584455++) {
        let _0x28dabc = getBlock(_0x4c4915, _0x584455, _0xdeb4eb)['namespace'];
        _0x28dabc === 'minecraft:lava' && (_0x469ae3 = 1);
      }
    }
  }
  if (!_0x469ae3) {
    setEntityPos(id, _0x139f7a, _0xba0a2a + 0.5, _0x19118f);
    return;
  } else {
    let _0x491901 = 0;
    _0x5871df: for (let _0x2a8c11 = _0x139f7a - 1; _0x2a8c11 <= _0x139f7a + 1; _0x2a8c11++) {
      for (let _0x421548 = _0x19118f - 1; _0x421548 <= _0x19118f + 1; _0x421548++) {
        for (let _0x3779c7 = _0xba0a2a - 1; _0x3779c7 <= _0xba0a2a + 1; _0x3779c7++) {
          let _0x2c741e = getBlock(_0x2a8c11, _0x3779c7, _0x421548)['namespace'];
          if (_0x2c741e !== 'minecraft:lava') {
            for (let _0x41d4b2 = _0x2a8c11 - 1; _0x41d4b2 <= _0x2a8c11 + 1; _0x41d4b2++) {
              for (let _0x2ad2b5 = _0x421548 - 1; _0x2ad2b5 <= _0x421548 + 1; _0x2ad2b5++) {
                for (let _0x15818e = _0x3779c7 - 1; _0x15818e <= _0x3779c7 + 1; _0x15818e++) {
                  let _0x3a9c4a = getBlock(_0x41d4b2, _0x15818e, _0x2ad2b5)['namespace'];
                  if (_0x3a9c4a === 'minecraft:lava') continue _0x5871df;
                }
              }
            }
            setEntityPos(id, _0x2a8c11, _0x3779c7 + 0.5, _0x421548);
            return;
          }
        }
      }
    }
    !_0x491901 && removeEntity(_0x593ba7);
  }
}
function 传送矿石() {
  if (矿物坐标X['length'] != 0) {
    let _0x859465 = 0;
    for (let _0x4c96f1 = 矿物坐标Y[0] - 2; _0x4c96f1 < 矿物坐标Y[0] + 2; _0x4c96f1++) {
      let _0x1ef424 = getBlock(矿物坐标X[0], _0x4c96f1, 矿物坐标Z[0])['namespace'];
      if (_0x1ef424 == 'minecraft:lava') {
        _0x859465 = 1;
        break;
      }
    }
    if (!_0x859465) {
      let _0x43bceb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let _0x2f13ba of _0x43bceb) {
        let _0x4fb78f = getBlock(矿物坐标X[0] + _0x2f13ba[0], 矿物坐标Y[0], 矿物坐标Z[0] + _0x2f13ba[1])['namespace'];
        if (_0x4fb78f == 'minecraft:lava') {
          _0x859465 = 1;
          break;
        }
      }
    }
    if (!_0x859465) {
      setEntityPos(id, 矿物坐标X[0] + 0.5, 矿物坐标Y[0] + 0.7, 矿物坐标Z[0] + 0.5), s = 0;
      return;
    } else {
      let _0x2940e0 = 0;
      for (let _0x36d65c = 矿物坐标X[0] - 4; _0x36d65c <= 矿物坐标X[0] + 4; _0x36d65c++) {
        for (let _0x19b4db = 矿物坐标Z[0] - 4; _0x19b4db <= 矿物坐标Z[0] + 4; _0x19b4db++) {
          for (let _0x3d8ee4 = 矿物坐标Y[0] - 4; _0x3d8ee4 < 矿物坐标Y[0] + 4; _0x3d8ee4++) {
            if (getBlock(_0x36d65c, _0x3d8ee4, _0x19b4db)['namespace'] != 'minecraft:bedrock') {
              for (let _0x13724c = _0x3d8ee4 - 2; _0x13724c <= _0x3d8ee4 + 1; _0x13724c++) {
                let _0x1a7f0a = getBlock(_0x36d65c, _0x13724c, _0x19b4db)['namespace'];
                if (_0x1a7f0a == 'minecraft:lava') {
                  _0x2940e0 = 1;
                  break;
                }
              }
              if (!_0x2940e0) {
                setEntityPos(id, _0x36d65c + 0.5, _0x3d8ee4 + 0.7, _0x19b4db + 0.5), s = 0;
                return;
              } else {
                t = 0;
                let _0x318b79 = 0;
                矿物坐标X['splice'](_0x318b79, 1), 矿物坐标Y['splice'](_0x318b79, 1), 矿物坐标Z['splice'](_0x318b79, 1);
                return;
              }
            }
          }
        }
      }
    }
  }
}
function 额外挖掘() {
  for (let _0x48c0c8 = 0; _0x48c0c8 < 开始; _0x48c0c8++) {
    let _0x2889f6 = getEntityPos(id);
    for (let _0x5dcf1b = -5; _0x5dcf1b <= 5; _0x5dcf1b++) {
      for (let _0x24ca1b = -5; _0x24ca1b < 5; _0x24ca1b++) {
        for (let _0x2e46cd = -5; _0x2e46cd <= 5; _0x2e46cd++) {
          let _0x2ebe1f = getBlock(_0x2889f6['x'] + _0x5dcf1b, _0x2889f6['y'] + _0x24ca1b, _0x2889f6['z'] + _0x2e46cd)['namespace'];
          (_0x2ebe1f['indexOf'](矿石namespace) !== -1 || _0x2ebe1f['indexOf'](矿石namespace2) !== -1) && destroyBlock(id, _0x2889f6['x'] + _0x5dcf1b, _0x2889f6['y'] + _0x24ca1b, _0x2889f6['z'] + _0x2e46cd, 0);
        }
      }
    }
  }
}
function 自动选择稿子() {
  const _0x2d9bc8 = getPlayerSelectItemSlot(id),
    _0x1b60a9 = getPlayerInventoryItem(id, _0x2d9bc8);
  if (_0x1b60a9['indexOf']('pickaxe') == -1) for (let _0x517a01 = 0; _0x517a01 < 36; _0x517a01++) {
    let _0x10b60b = getPlayerInventoryItem(id, _0x517a01);
    if (_0x10b60b['indexOf']('pickaxe') !== -1) {
      if (_0x517a01 >= 9) {
        openInventory(), moveInventoryItem(_0x517a01, _0x2d9bc8);
        return;
      } else {
        selectPlayerInventorySlot(id, _0x517a01);
        return;
      }
    }
  }
}
function 挖掘矿石() {
  let _0x48f2dd = getEntityPos(id);
  destroyBlock(id, _0x48f2dd['x'], _0x48f2dd['y'], _0x48f2dd['z'], 0);
  let _0x2fba98 = [];
  for (let _0x4656f1 = 0; _0x4656f1 < 矿物坐标X['length']; _0x4656f1++) {
    let _0x20536f = 矿物坐标X[_0x4656f1] - _0x48f2dd['x'],
      _0x181770 = 矿物坐标Y[_0x4656f1] - _0x48f2dd['y'],
      _0x55e280 = 矿物坐标Z[_0x4656f1] - _0x48f2dd['z'],
      _0x1e325 = Math['sqrt'](_0x20536f * _0x20536f + _0x181770 * _0x181770 + _0x55e280 * _0x55e280);
    _0x1e325 <= 6 && (destroyBlock(id, 矿物坐标X[_0x4656f1], 矿物坐标Y[_0x4656f1], 矿物坐标Z[_0x4656f1], 0), _0x2fba98['push'](_0x4656f1));
  }
  t = 0, _0x2fba98['sort']((_0x2eba73, _0x5d3ea2) => _0x5d3ea2 - _0x2eba73), _0x2fba98['forEach'](_0x472aba => {
    矿物坐标X['splice'](_0x472aba, 1), 矿物坐标Y['splice'](_0x472aba, 1), 矿物坐标Z['splice'](_0x472aba, 1);
  });
}
let 矿物坐标X = [],
  矿物坐标Y = [],
  矿物坐标Z = [],
  t = 0,
  s = 100,
  item = [],
  x0 = 0,
  z0 = 0;
function 获取矿物坐标() {
  x0 == 0 && z0 == 0 && (x0 = Math['floor'](getEntityPos(id)['x']), z0 = Math['floor'](getEntityPos(id)['z']));
  for (let _0x302ec4 = x0 - 16; _0x302ec4 <= x0 + 16; _0x302ec4++) {
    for (let _0x487352 = 矿石y; _0x487352 <= 矿石y2; _0x487352++) {
      for (let _0x403bc2 = z0 - 16; _0x403bc2 <= z0 + 16; _0x403bc2++) {
        let _0x5510ea = getBlock(_0x302ec4, _0x487352, _0x403bc2);
        if (_0x5510ea['namespace'] == 'minecraft:' + 矿石namespace || _0x5510ea['namespace'] == 'minecraft:' + 矿石namespace2) 矿物坐标X['push'](_0x302ec4), 矿物坐标Y['push'](_0x487352), 矿物坐标Z['push'](_0x403bc2);else continue;
      }
    }
  }
}
function onTickEvent() {
  try {
    s == 5 && 挖掘矿石(), t++, s++, 矿物坐标X['length'] == 0 && s == 25 && (x0 = x0 + 32, 获取矿物坐标()), tick % 1 == 0 && 额外挖掘(), tick++, 开始 && (拾取矿物(), showTipMessage('找到矿石剩余数量:' + 矿物坐标X['length'] + '\n'));
  } catch (_0x584f49) {
    clientMessage(_0x584f49['message']);
  }
}
let kg = 1,
  tick = 0;
function 坐标判断(_0x54d942, _0x1fb58a, _0x17f589) {
  return _0x54d942 = _0x54d942 < 0 ? _0x54d942 - 1 : _0x54d942, _0x1fb58a = _0x1fb58a < 0 ? _0x1fb58a - 1 : _0x1fb58a, _0x17f589 = _0x17f589 < 0 ? _0x17f589 - 1 : _0x17f589, {
    'x': _0x54d942,
    'y': _0x1fb58a,
    'z': _0x17f589
  };
}
function 拾取矿物() {
  let _0xaff3f8 = getEntityList(),
    _0x439740 = getEntityPos(id),
    _0x3dea15 = 坐标判断(_0x439740['x'], _0x439740['y'], _0x439740['z']);
  destroyBlock(id, _0x3dea15['x'], _0x3dea15['y'], _0x3dea15['z'], 0);
  for (i = 0; i < _0xaff3f8['length']; i++) {
    let _0x4e88e4 = getEntityTypeId(_0xaff3f8[i]);
    if (_0x4e88e4 == 64 || _0x4e88e4 == 69) {
      let _0x1289b0 = getEntityPos(_0xaff3f8[i]),
        _0x1ba876 = getEntityName(_0xaff3f8[i]);
      if (_0x1ba876 == 矿石item || _0x1ba876 == 矿石item2 || _0x1ba876 == 矿石item3) {
        t = 0;
        let _0x58eb81 = getBlock(Math['floor'](_0x1289b0['x']), Math['floor'](_0x1289b0['y']), Math['floor'](_0x1289b0['z'])),
          _0x323c5c = getBlock(Math['floor'](_0x1289b0['x']), Math['floor'](_0x1289b0['y']) - 1, Math['floor'](_0x1289b0['z']));
        (_0x58eb81['namespace'] == 'minecraft:lava' || _0x323c5c['namespace'] == 'minecraft:soul_sand' || _0x323c5c['namespace'] == 'minecraft:gravel' || _0x323c5c['namespace'] == 'minecraft:soul_soil') && removeEntity(_0xaff3f8[i]), _0x58eb81['namespace'] == 'minecraft:water' && setEntityPos(id, _0x1289b0['x'], _0x1289b0['y'], _0x1289b0['z']);
        if (getEntityIsGround(_0xaff3f8[i])) {
          判断周围方块(_0x1289b0['x'], _0x1289b0['y'], _0x1289b0['z'], _0xaff3f8[i]);
          return;
        }
      } else {
        const _0x334178 = Math['sqrt']((_0x1289b0['x'] - _0x439740['x']) ** 2 + (_0x1289b0['y'] - _0x439740['y']) ** 2 + (_0x1289b0['z'] - _0x439740['z']) ** 2);
        if (_0x334178 < 4 && _0x4e88e4 == 64) for (let _0x2b96f6 = 0; _0x2b96f6 < 3; _0x2b96f6++) {
          attackEntity(_0xaff3f8[i], false);
        }
      }
    }
  }
  t == 20 && 传送矿石();
}
let 矿石 = ['§6铁矿', '§0煤矿', '§e金矿', '§b钻石矿', '§1青金石矿', '§c红石矿', '§4远古残骸', '§f石英矿§0(§a经验球§0)', '§f石英矿§0(§f掉落物§0)'];
function 选择矿石() {
  const _0x2d1b0e = {};
  _0x2d1b0e['text'] = '暂无';
  const _0x363dc1 = {
    'type': 'form',
    'title': '矿石列表',
    'content': '点击选择矿石',
    'buttons': [_0x2d1b0e]
  };
  for (let _0x2ae7ff = 0; _0x2ae7ff < 矿石['length']; _0x2ae7ff++) {
    _0x363dc1['buttons'][_0x2ae7ff] = {
      'text': 矿石[_0x2ae7ff]
    };
  }
  addForm(JSON['stringify'](_0x363dc1), function (_0x48ddcc) {
    switch (_0x48ddcc) {
      case 0:
        矿石namespace = 'iron_ore', 矿石namespace2 = 'deepslate_iron_ore', 矿石y = -16, 矿石y2 = 48, 矿石item = '粗铁', 矿石item2 = '铁矿石', 矿石item3 = '深层铁矿石';
        break;
      case 1:
        矿石namespace = 'coal_ore', 矿石namespace2 = 'deepslate_coal_ore', 矿石y = 0, 矿石y2 = 64, 矿石item = '煤炭', 矿石item2 = '煤矿石', 矿石item3 = '深层煤矿石';
        break;
      case 2:
        矿石namespace = 'gold_ore', 矿石namespace2 = 'deepslate_gold_ore', 矿石y = -48, 矿石y2 = 16, 矿石item = '粗金', 矿石item2 = '金矿石', 矿石item3 = '深层金矿石';
        break;
      case 3:
        矿石namespace = 'diamond_ore', 矿石namespace2 = 'deepslate_diamond_ore', 矿石y = -63, 矿石y2 = 16, 矿石item = '钻石', 矿石item2 = '钻石矿石', 矿石item3 = '深层钻石矿石';
        break;
      case 4:
        矿石namespace = 'lapis_ore', 矿石namespace2 = 'deepslate_lapis_ore', 矿石y = -32, 矿石y2 = 32, 矿石item = '青金石', 矿石item2 = '青金石矿石', 矿石item3 = '深层青金石矿石';
        break;
      case 5:
        矿石namespace = 'redstone_ore', 矿石namespace2 = 'deepslate_redstone_ore', 矿石y = -63, 矿石y2 = 16, 矿石item = '红石粉', 矿石item2 = '红石矿石', 矿石item3 = '深层红石矿石';
        break;
      case 6:
        矿石namespace = 'ancient_debris', 矿石namespace2 = 'ancient_debris', 矿石y = 8, 矿石y2 = 22, 矿石item = '远古残骸', 矿石item2 = '远古残骸', 矿石item3 = '远古残骸';
        break;
      case 7:
        矿石namespace = 'quartz_ore', 矿石namespace2 = 'quartz_ore', 矿石y = 10, 矿石y2 = 117, 矿石item = '经验球', 矿石item2 = '经验球', 矿石item3 = '经验球';
        break;
      default:
        矿石namespace = 'quartz_ore', 矿石namespace2 = 'quartz_ore', 矿石y = 10, 矿石y2 = 117, 矿石item = '下界石英', 矿石item2 = '下界石英矿石', 矿石item3 = '下界石英矿石';
        break;
    }
    _0x48ddcc !== -1 ? (获取矿物坐标(), t = 0, 开始 = 1) : exit();
  });
}
选择矿石();
let 矿石namespace = '',
  矿石namespace2 = '',
  矿石y = -16,
  矿石y2 = 48,
  矿石item = '下界石英',
  矿石item2 = '',
  矿石item3 = '',
  开始 = 0;