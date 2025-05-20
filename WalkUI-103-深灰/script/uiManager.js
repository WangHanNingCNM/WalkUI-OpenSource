/*
* 动态UI生成器 1.1
* By Craft Q 1831545438
* PS 方便各大跑路JS作者 制作动态UI脚本
* 2025.2.26
* 本生成器也是JS工具箱用的
* 支持跑路全部UI组件
* 增加自动保存读取配置和修复表单问题
*
* PS: 忘记说明,所有值都可以从全局变量读取,无需另外在onChange事件赋值
* */
const rndStr = (len = 8) => Array.from({length: len}, () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 52)]).join("");
const FUNC_ID = rndStr(8), FUNC_NAME = rndStr(8);
const DEF_CLICK_SND = "http://getw.net/require/sound/DEFAULT_CLICK_SOUND.mp3", SW_ON_SND = DEF_CLICK_SND,
    SW_OFF_SND = "http://getw.net/require/sound/SWITCH_OFF_SOUND.mp3";
const dispMsg = msg => (plyrId = getLocalPlayerUniqueID()) === -1 ? showToast(msg) : clientMessage(`§l§e『JS』 §r->§b ${msg}`);

function saveSetting(settingName, value) {
    try {
        const filePath = getResource() + "/config.json";
        let settings = {};
        try {
            const fileContent = read_file(filePath);
            if (fileContent && fileContent.trim()) {
                settings = JSON.parse(fileContent);
            }
        } catch (error) {
            clientMessage(`读取配置文件错误: ${error.message}, 将创建新配置`);
        }
        settings[settingName] = value;
        write_file(filePath, JSON.stringify(settings, null, 2));
    } catch (error) {
        clientMessage(`保存设置错误: ${error.message}`);
    }
}

/**
 * 加载设置值
 * @param {string} settingName - 设置名称
 * @returns {*} - 设置值
 */
function loadSetting(settingName) {
    try {
        const filePath = getResource() + "/config.json";
        const fileContent = read_file(filePath);
        if (!fileContent || !fileContent.trim()) {
            return undefined;
        }
        const settings = JSON.parse(fileContent);
        return settings[settingName] || "";
    } catch (error) {
        clientMessage(`加载设置错误: ${error.message}`);
        return undefined;
    }
}

export class UIManager {
    constructor() {
        this.funcId = FUNC_ID;
        this.funcName = FUNC_NAME;
        this.itmObjs = {};
        this.oUis = [];
        this.glbKeysDef = new Set();
        this.lastUpdTs = {};
        this.useLclUi = true;
        this.mainUiJs = null;
        this.frmData = {};
        this.menuNmMap = {};
        this.formSubmitLock = {};  // 新增: 表单提交锁定状态
        this.menuOpenTimestamps = {};
        regFun(this.funcId);
    }

    decToHexClr = decml => `#${((decml < 0 ? 0xFFFFFFFF + decml + 1 : decml).toString(16).padStart(8, "0")).slice(2, 8)}`;

    genRndKey = (len = 8) => Array.from({length: len + 3}, () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 62))).join("");

    genRndMenuName = (origName) => {
        const rndName = rndStr(9);
        return this.menuNmMap[origName] = rndName;
    };

    getFrstNnNullClr = jsCtnt => {
        if (!this.useLclUi) return "#ff0000";
        try {
            const {items = []} = JSON.parse(jsCtnt);
            return items.find(item => item.color)?.color || "#0000FF";
        } catch (e) {
            clientMessage(`解析主 UI JSON 出错: ${e.message}`);
            return "#0000FF";
        }
    };

    genMenu = (items, menuName) => {
        // 预处理items
        items.forEach(item => {
            !item.key && (item.key = this.genRndKey());
            !item.type && (item.type = "TextView");
            if (item.type === "RadioGroup" && !item.items) {
                item.items = [];
            }
        });
        const rndMenuNm = this.genRndMenuName(menuName);
        if (this.oUis.includes(rndMenuNm)) {
            removeMenu(rndMenuNm);
            delete this.itmObjs[rndMenuNm];
            this.oUis = this.oUis.filter(name => name !== rndMenuNm);
        }
        let uiDef;
        try {
            uiDef = JSON.parse(read_file(getResource() + "/ui/ui_definition.json"));
        } catch (e) {
            clientMessage(`解析 ui_definition.json 错误: ${e.message}`);
            uiDef = {ui: ["main"]};
        }
        let mainUiCnt = this.useLclUi ? read_file(getResource() + "/ui/" + ((uiDef.ui || ["main"])[0]) + ".json") : this.mainUiJs;
        if (!mainUiCnt && !this.useLclUi) {
            clientMessage("Main UI content not available. Falling back to local UI.");
            mainUiCnt = read_file(getResource() + "/ui/" + ((uiDef.ui || ["main"])[0]) + ".json");
            this.useLclUi = true;
        }
        this.itmObjs[rndMenuNm] = {};
        items.forEach(item => {
            this.itmObjs[rndMenuNm][item.key] = {...item};
            const glbKey = item.type === "SeekBar" ? item.key : "fun_" + item.key;
            if (!this.glbKeysDef.has(glbKey)) {
                Object.defineProperty(globalThis, glbKey, {
                    get: () => {
                        const typMap = {
                            "SeekBar": () => parseFloat(item.value),
                            "Switch": () => Boolean(item.checked),
                            "CheckBox": () => Boolean(item.checked),
                            "EditText": () => item.text || "",
                            "RadioGroup": () => item.items?.find(ri => ri.checked)?.key || null,
                            "TextView": () => item.text || item.default_color || "",
                            "ColorPicker": () => item.text || item.default_color || ""
                        };
                        return (typMap[item.type] || (() => item.text || ""))();
                    },
                    set: newVal => {
                        try {
                            const typMap = {
                                "SeekBar": () => item.value = parseFloat(newVal).toFixed(1),
                                "Switch": () => item.checked = Boolean(newVal),
                                "CheckBox": () => item.checked = Boolean(newVal),
                                "EditText": () => item.text = newVal,
                                "TextView": () => item.text = newVal,
                                "RadioGroup": () => item.items?.forEach(radioItem => (radioItem.checked = radioItem.key === newVal)),
                                "ColorPicker": () => item.default_color = newVal
                            };
                            (typMap[item.type] || (() => {
                            }))();
                            if (menuName && item.key && !item.key.startsWith("form_")) {
                                const savedKey = `${menuName}_${item.key}`;
                                const valueToSave = (() => {
                                    switch (item.type) {
                                        case "SeekBar":
                                            return parseFloat(item.value);
                                        case "Switch":
                                        case "CheckBox":
                                            return Boolean(item.checked);
                                        case "EditText":
                                        case "TextView":
                                            return item.text || "";
                                        case "RadioGroup":
                                            return item.items?.find(ri => ri.checked)?.key || null;
                                        case "ColorPicker":
                                            return item.default_color || "#FFFFFF";
                                        default:
                                            return null;
                                    }
                                })();
                            }
                        } catch (e) {
                            clientMessage(`Error setting value for ${item.key}: ${e.message}`);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                this.glbKeysDef.add(glbKey);
            }
            const typInitMap = {
                "Switch": () => globalThis["fun_" + item.key] = Boolean(item.checked),
                "CheckBox": () => globalThis["fun_" + item.key] = Boolean(item.checked),
                "EditText": () => globalThis["fun_" + item.key] = item.text || "",
                "SeekBar": () => globalThis[item.key] = parseFloat(item.value) || 0,
                "RadioGroup": () => {
                    const defSelItm = item.items?.find(radioItem => radioItem.checked);
                    globalThis["fun_" + item.key] = defSelItm ? defSelItm.key : null;
                },
                "ColorPicker": () => globalThis["fun_" + item.key] = item.default_color || "#FFFFFF",
                "TextView": () => globalThis["fun_" + item.key] = item.text || ""
            };
            (typInitMap[item.type] || (() => {
            }))();
        });
        const fmtItem = item => {
            const baseObj = {
                type: item.type,
                name: item.name,
                color: item.color || this.getFrstNnNullClr(mainUiCnt),
                size: item.size || 13,
                padding: item.padding || (item.type === "CheckBox" ? [2, 2, 2, 2] : [5, 5, 5, 5]),
                key: item.key,
                ...(item.values || {})
            };
            const typSpecMap = {
                "ColorPicker": {
                    default_color: item.default_color || "#FFFFFF",
                    ok: item.ok || "确定",
                    cancel: item.cancel || "取消"
                },
                "SeekBar": {
                    format: `${item.name} %.1f`,
                    min: parseFloat(item.min || 0).toFixed(1),
                    max: parseFloat(item.max || 100).toFixed(1),
                    value: parseFloat(item.value || 0).toFixed(1)
                },
                "Switch": {
                    checked: Boolean(item.checked),
                    enabled: item.enabled !== undefined ? item.enabled : true
                },
                "CheckBox": {
                    checked: Boolean(item.checked),
                    enabled: item.enabled !== undefined ? item.enabled : true
                },
                "TextView": {},
                "EditText": {
                    text: item.text || "",
                    max_lines: item.max_lines || 1,
                    hint: item.hint || item.name
                },
                "RadioGroup": {
                    items: (item.items || []).map(radioItem => ({
                        key: radioItem.key,
                        name: radioItem.name,
                        color: radioItem.color || "$menu_item_color",
                        size: radioItem.size || 8,
                        checked: Boolean(radioItem.checked)
                    }))
                }
            };
            return {
                ...baseObj,
                ...(typSpecMap[item.type] || {}),
                onChange: item.onChange || null,
                html: item.html,
                url: item.url,
                tip: item.tip
            };
        };
        let mainUi;
        try {
            mainUi = JSON.parse(mainUiCnt);
        } catch (e) {
            clientMessage(`解析 MainUIJson 错误: ${e.message}`);
            exit();
        }
        mainUi.title.name = menuName || mainUi.title.name;
        mainUi.can_close = true;
        mainUi.items = [
            {
                type: "TextView",
                name: menuName,
                color: "#1abc9c",
                size: 14,
                padding: [5, -16, 5, 0],
                tag: this.funcId,
                items: items.map(fmtItem)
            }
        ];
        const jsonMenu = JSON.stringify(mainUi, null, 2).replace(/"(-?\d+\.\d+)"/g, "$1");
        this.oUis.push(rndMenuNm);
        this.menuOpenTimestamps[rndMenuNm] = Date.now();
        loadMenu(rndMenuNm, jsonMenu);
        return rndMenuNm;
    };

    handleModuleEvent = args => {
        try {
            const argsJson = JSON.stringify(args);
            if (!argsJson.includes(this.funcId)) {
                return;
            }
            const now = Date.now();
            for (const menuName in this.menuOpenTimestamps) {
                if (now - this.menuOpenTimestamps[menuName] < 500) {
                    return;
                }
            }
            for (const menuName in this.menuOpenTimestamps) {
                if (now - this.menuOpenTimestamps[menuName] > 5000) {
                    delete this.menuOpenTimestamps[menuName];
                }
            }
            const keysToProcess = Object.keys(args)
                .filter(k => !["fun", "name", "value", "index", "key"].includes(k))
                .concat(args.key ? [args.key] : []);
            keysToProcess.forEach(argKey => {
                Object.values(this.itmObjs).forEach(menu => {
                    if (!menu[argKey]) {
                        return;
                    }
                    const item = menu[argKey];
                    const now = Date.now();
                    try {
                        thread(() => this.handleItemByType(item, argKey, args, now), 700);
                    } catch (e) {
                        clientMessage(`处理 key ${argKey} 时出错: ${e.message}, ${e.stack}`);
                    }
                });
            });
        } catch (e) {
            clientMessage(`onCallModuleEvent 错误: ${e.message}, ${e.stack}`);
        }
    };

    handleItemByType(item, argKey, args, now) {
        switch (item.type) {
            case "TextView":
                this.handleTextView(item, argKey);
                break;
            case "SeekBar":
                this.handleSeekBar(item, argKey, args, now);
                break;
            case "Switch":
            case "CheckBox":
                this.handleToggle(item, argKey, args);
                break;
            case "EditText":
                this.handleEditText(item, argKey, args);
                break;
            case "RadioGroup":
                this.handleRadioGroup(item, argKey, args);
                break;
            case "ColorPicker":
                this.handleColorPicker(item, argKey, args);
                break;
            default:
                clientMessage(`未处理的类型 ${item.type} for key ${argKey}`);
        }
    }

    handleTextView(item, argKey) {
        if (globalThis.handleClickEvent) {
            globalThis.handleClickEvent(item, argKey);
        }
        if (typeof item.onChange === "function") {
            try {
                item.onChange({type: "click", key: argKey, item});
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    handleSeekBar(item, argKey, args, now) {
        const value = parseFloat(args[argKey]);
        if (this.lastUpdTs[argKey] && now - this.lastUpdTs[argKey] <= 100) {
            return;
        }
        this.lastUpdTs[argKey] = now;
        if (value < parseFloat(item.min) || value > parseFloat(item.max)) {
            clientMessage(`SeekBar ${argKey} 的值超出范围: ${value}`);
            return;
        }
        if (globalThis.handleValueChange) {
            globalThis.handleValueChange(item, argKey);
        }
        globalThis[argKey] = value.toFixed(1);
        item.value = value.toFixed(1);
        if (typeof item.onChange === "function") {
            try {
                item.onChange({
                    type: "seekbar",
                    key: argKey,
                    value: item.value,
                    item
                });
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    handleToggle(item, argKey, args) {
        const checked = Boolean(args[argKey]);
        item.checked = checked;
        if (globalThis.handleValueChange) {
            globalThis.handleValueChange(item, argKey);
        }
        globalThis["fun_" + argKey] = checked;
        if (typeof item.onChange === "function") {
            try {
                item.onChange({type: "toggle", key: argKey, value: checked, item});
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    handleEditText(item, argKey, args) {
        const text = args[argKey];
        item.text = text;
        if (globalThis.handleValueChange) {
            globalThis.handleValueChange(item, argKey);
        }
        globalThis["fun_" + argKey] = text;
        if (typeof item.onChange === "function") {
            try {
                item.onChange({type: "edit", key: argKey, value: text, item});
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    handleRadioGroup(item, argKey, args) {
        const selectedKey = args[argKey];
        if (item.items) {
            item.items.forEach(radioItem => {
                radioItem.checked = radioItem.key === selectedKey;
            });
        }
        if (globalThis.handleValueChange) {
            globalThis.handleValueChange(item, argKey);
        }
        globalThis["fun_" + argKey] = selectedKey;
        if (typeof item.onChange === "function") {
            try {
                const selectedItem = item.items?.find(radioItem => radioItem.key === selectedKey);
                if (selectedItem) {
                    item.onChange({
                        type: "radio",
                        key: argKey,
                        value: selectedItem.key,
                        item
                    });
                } else {
                    clientMessage(`RadioGroup: Key "${selectedKey}" not found.`);
                }
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    handleColorPicker(item, argKey, args) {
        const newColor = this.decToHexClr(args[argKey]);
        item.default_color = newColor;
        if (globalThis.handleValueChange) {
            globalThis.handleValueChange(item, argKey);
        }
        globalThis["fun_" + argKey] = newColor;
        if (typeof item.onChange === "function") {
            try {
                item.onChange({type: "color", key: argKey, value: newColor, item});
            } catch (e) {
                clientMessage(`onChange error for ${argKey}: ${e.message}`);
            }
        }
    }

    closeAllUis = () => {
        try {
            thread(() => {
                this.oUis.forEach(menuName => {
                    removeMenu(menuName);
                    delete this.itmObjs[menuName];
                });
                this.oUis = [];
                clientMessage("退出脚本.");
                thread(exit, 500);
            }, 500);
        } catch (e) {
            clientMessage(e.message);
        }
    };

    uiForm = (name, items, callback) => {
        const KEY = "form_" + this.genRndKey(5), itemKeysOrd = [];
        this.frmData[KEY] = {name};
        items.forEach(item => {
            const ikey = item.key || "for_" + this.genRndKey(5);
            item.key = ikey;
            itemKeysOrd.push(ikey);
            const typInitMap = {
                "EditText": () => item.text || "",
                "SeekBar": () => parseFloat(item.value) || 0,
                "Switch": () => Boolean(item.checked),
                "CheckBox": () => Boolean(item.checked),
                "RadioGroup": () => item.items?.find(ri => ri.checked)?.key || null,
                "ColorPicker": () => item.default_color || "#FFFFFF",
                "TextView": () => item.text || ""
            };
            this.frmData[KEY][ikey] = (typInitMap[item.type] || (() => null))();
        });
        items.push({name: "提交", key: KEY, size: 15, tip: "请勿重复点击提交"});
        globalThis["formCallback_" + KEY] = formVals => {
            try {
                callback(formVals);
            } catch (e) {
                clientMessage(`表单回调错误: ${e.message}`);
            }
            try {
                delete globalThis["formCallback_" + KEY];
                delete globalThis["formItemKeysOrder_" + KEY];
                thread(() => {
                    try {
                        delete this.frmData[KEY];
                        // 解锁表单提交
                        delete this.formSubmitLock[KEY];
                    } catch (e) {
                        clientMessage(`延迟清理表单数据错误: ${e.message}`);
                    }
                }, 1000);
            } catch (e) {
                clientMessage(`清理表单数据错误: ${e.message}`);
            }
        };
        globalThis["formItemKeysOrder_" + KEY] = itemKeysOrd;
        this.genMenu(items, name);
    };

    getRndMenuName = (origName) => this.menuNmMap[origName] || origName;
}