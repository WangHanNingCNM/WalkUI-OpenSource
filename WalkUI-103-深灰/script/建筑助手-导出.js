class OctreeNode {
    constructor(b) {
        this.bounds = b;
        this.children = null;
        this.isAir = null;
        this.airEq = 0b11;
    }

    intersects(p) {
        const {minX, minY, minZ, maxX, maxY, maxZ} = this.bounds;
        return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY && p.z >= minZ && p.z <= maxZ;
    }

    containsPoint(p) {
        return this.intersects(p) && (this.isAir === true || (!!this.children && this.children.some(c => c?.containsPoint(p))));
    }

    containsPointFast(p) {
        if (!this.intersects(p)) return 0;
        return this.isAir === true ? this.airEq : (!this.children ? 0 : (this.children.find(c => c && c.containsPointFast(p) !== 0)?.containsPointFast(p) || 0));
    }

    insert(p, blockNs) {
        if (!this.intersects(p) || this.isAir === true) return !!this.isAir;
        let airBit = (blockNs === "minecraft:air") ? 0b1 : (blockNs === "minecraft:stone") ? 0b10 : 0;
        if (airBit & this.airEq) {
            if (this.isLeaf()) {
                this.isAir = true;
                return true;
            }
            return this.subdivide(), true;
        }
        if (!this.children) {
            if (this.isLeaf()) return false;
            this.subdivide();
        }
        return this.children.some(c => c.insert(p, blockNs));
    }

    isLeaf() {
        const {minX, minY, minZ, maxX, maxY, maxZ} = this.bounds;
        return (maxX - minX <= 1) || (maxY - minY <= 1) || (maxZ - minZ <= 1);
    }

    subdivide() {
        if (this.children) return;
        const {minX: a, minY: b, minZ: c, maxX: d, maxY: e, maxZ: f} = this.bounds,
            g = (a + d) * 0.5, h = (b + e) * 0.5, i = (c + f) * 0.5;
        this.children = [
            new OctreeNode({minX: a, maxX: g, minY: b, maxY: h, minZ: c, maxZ: i}),
            new OctreeNode({minX: a, maxX: g, minY: b, maxY: h, minZ: i, maxZ: f}),
            new OctreeNode({minX: a, maxX: g, minY: h, maxY: e, minZ: c, maxZ: i}),
            new OctreeNode({minX: a, maxX: g, minY: h, maxY: e, minZ: i, maxZ: f}),
            new OctreeNode({minX: g, maxX: d, minY: b, maxY: h, minZ: c, maxZ: i}),
            new OctreeNode({minX: g, maxX: d, minY: b, maxY: h, minZ: i, maxZ: f}),
            new OctreeNode({minX: g, maxX: d, minY: h, maxY: e, minZ: c, maxZ: i}),
            new OctreeNode({minX: g, maxX: d, minY: h, maxY: e, minZ: i, maxZ: f})
        ];
        this.children.forEach(child => child.airEq = this.airEq);
    }

    setAirEq(blockMap) {
        this.airEq = blockMap;
        this.children?.forEach(c => c?.setAirEq(blockMap));
    }
}

let dEnd = 0, sData = {}, posData = [], id = getLocalPlayerUniqueID(), isAdm = !1,
    exBlks = {"minecraft:air": !0, "minecraft:sand": !0, "minecraft:gravel": !0},
    nsCnt = new Map(),
    proc = {
        cq: [], cc: null, cbi: 0, cb: [], ns: [], nsMap: {}, sx: 0, sy: 0, sz: 0, ex: 0, ey: 0, ez: 0,
        cbk: null, totB: 0, procB: 0, totC: 0, procC: 0, pendC: 0, done: !1, p: !0, airOctree: null
    };
const serOct = (n) => n ? {bounds: n.bounds, isAir: n.isAir, children: n.children?.map(serOct)} : null;
const desOct = (d) => d ? Object.assign(new OctreeNode(d.bounds), {isAir: d.isAir, children: d.children?.map(desOct)}) : null;
const bDir = getResource() + "/data/SAVE_TMP", progFile = bDir + "/progress.json", chunksDir = bDir + "/chunks",
    sDelay = ms => dEnd = Date.now() + ms,
    chkD = () => Date.now() < dEnd,
    dCalc = (x1, y1, z1, x2, y2, z2) => Math.hypot(x1 - x2, z1 - z2),
    fmtT = s => `${Math.floor(s / 3600)}h ${Math.floor(s % 3600 / 60)}m ${Math.floor(s % 60)}s`,
    cProg = (p, l) => {
        p = Math.max(0, Math.min(p, 100));
        let f = Math.round(p / 100 * l);
        return "§o§l§a" + "|".repeat(f) + "§o§l§7" + "|".repeat(l - f) + "§r";
    },
    getNS = ns => proc.nsMap.has(ns) ? proc.nsMap.get(ns) : (proc.nsMap.set(ns, proc.ns.length), proc.ns.push(ns), proc.nsMap.get(ns));
fChunk = (sx, sz) => proc.cb.find(c => c.startX === sx && c.startZ === sz);

globalThis.handleClickEventZ = (i, k) => ({
    selPos: sPosF,
    selSt: () => { sData.start = getEntityPos(id); showToast("选择了起点"); },
    selEd: () => { sData.end = getEntityPos(id); sPosF(); },
    resProg, sOneExp, up: () => executeCommand(`tp ~ ~20 ~`),
    modifyExBlocks, qt: () => thread(() => { removeMenu("导出建筑 1.1"); setTimeout(exit, 300); }, 300)
})[k]?.();

globalThis.handleValueChangeZ = (i, k) => k == "isAdmin" && (callModule(9, `{"depart":${!i.checked},"fun":"fun_aimbot","name":"autoaim","value":false}`), displayMessage(`无权限模式调整=>${!i.checked}`));

const sMain = () => uiManager.genMenu([
    { name: "选择起点", key: "selSt", type: "TextView" },
    { name: "选择终点", key: "selEd", type: "TextView" },
    { name: "坐标导出", key: "selPos", type: "TextView" },
    { name: "一键导出", key: "sOneExp", type: "TextView" },
    { name: "导出速度", key: "exportSpeed", min: 100, max: 5000, value: 300, type: "SeekBar" },
    { name: "超过范围传送", key: "exportRange", min: 0, max: 512, value: 512, type: "SeekBar" },
    { name: "管理员模式", key: "isAdmin", type: "Switch", checked: !0 },
    { name: "展示扫描统计", key: "showNS", type: "Switch", checked: !1 },
    { name: "恢复上次进度", key: "resProg", type: "TextView" },
    { name: "建筑商店", key: "shop", type: "TextView", url: "http://build-store.rb9.top/" },
    { name: "Y移动20格", key: "up", type: "TextView" },
    { name: "修改排除方块", key: "modifyExBlocks", type: "TextView" },
    { name: "将石头视为空气", key: "treatStoneAsAir", type: "Switch", checked: !1 },
    { name: "退出", key: "qt" }
], "导出建筑 1.1", !1);

const modifyExBlocks = () => addForm(JSON.stringify({
    type: "custom_form", title: "修改排除方块", content: [{ type: "input", text: "排除方块", placeholder: "例如：sand", default: Object.keys(exBlks).map(b => b.replace("minecraft:", "")).join(" ") }]
}), r => r != -1 ? (exBlks = Object.fromEntries(r.trim().split(" ").map(b => [`minecraft:${b.trim()}`, true])), clientMessage(`排除方块列表已更新：\n${Object.keys(exBlks).join("\n")}`)) : clientMessage("没有进行修改。"));

const expEnt = (sx, sy, sz, ex, ey, ez) => {
    let [minX, maxX] = [Math.min(sx, ex), Math.max(sx, ex)], [minY, maxY] = [Math.min(sy, ey), Math.max(sy, ey)], [minZ, maxZ] = [Math.min(sz, ez), Math.max(sz, ez)];
    return getEntityList().filter(i => {
        let { x, y, z } = getEntityPos(i);
        return x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ;
    }).map(i => {
        let { x, y, z } = getEntityPos(i);
        return [Math.floor(x) - minX, Math.floor(y) - minY, Math.floor(z) - minZ, getEntityName(i), getEntityNamespace(i).split(":")[1]];
    });
};

const sOneExp = () => addForm(JSON.stringify({
    type: "custom_form", title: "一键导出", content: [
        { type: "input", text: "半径（格数）", placeholder: "请输入半径（例如：40）", default: "40" },
        { type: "input", text: "向下格数", placeholder: "请输入向下格数（例如：20）", default: "20" },
        { type: "input", text: "向上格数", placeholder: "请输入向上格数（例如：20）", default: "20" }
    ]
}), (r, d, u) => {
    if (r == null || d == null || u == null) return;
    let [rad, dn, up] = [+r, +d, +u];
    if ([rad, dn, up].some(isNaN)) return clientMessage("输入错误，请输入数字。");
    const pos = getEntityPos(id), [x, y, z] = [pos.x, pos.y, pos.z].map(Math.floor),
        [x1, x2, z1, z2, y1, y2] = [x - rad, x + rad, z - rad, z + rad, y - dn, y + up],
        bc = Math.abs((x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1)),
        fmt = new Date().toISOString().split(".")[0].replace("T", " ");
    clientMessage(`开始任务：${fmt}，扫描方块数：${bc}`);
    initProc(x1, y1, z1, x2, y2, z2, () => { });
});

const updSelTip = () => {
    if (!sData.start) return;
    const s = sData.start, e = getEntityPos(id),
        [dx, dy, dz] = [e.x - s.x, e.y - s.y, e.z - s.z].map(Math.abs).map(Math.ceil),
        d = Math.ceil(Math.sqrt(dx * dx + dy * dy + dz * dz)),
        [w, h, dep] = [dx + 1, dy + 1, dz + 1],
        tc = Math.ceil(w / 16) * Math.ceil(dep / 16),
        tb = (w * h * dep / 10000).toFixed(2);
    showTipMessage(`§6§l起点到终点信息:§r
§2距离: §a${d} 格§r
§2区块数: §a${tc}§r
§2方块总数: §a${tb} 万§r
§2X差: §a${dx} 格  §2Y差: §a${dy} 格  §2Z差: §a${dz} 格`);
};

const initProc = (x1, y1, z1, x2, y2, z2, cbk) => {
    try {
        nsCnt = new Map();
        file_exist(progFile) && file_delete(progFile);
        (file_exist(chunksDir) ? file_list(chunksDir) : []).forEach(f => file_delete(`${chunksDir}/${f}`));
        file_exist(chunksDir) || file_create_dir(chunksDir);
        proc = {
            cq: [], cc: null, cbi: 0, ns: [], nsMap: new Map(),
            sx: Math.min(x1, x2), sy: Math.min(y1, y2), sz: Math.min(z1, z2),
            ex: Math.max(x1, x2), ey: Math.max(y1, y2), ez: Math.max(z1, z2),
            cbk, totB: (Math.max(x1, x2) - Math.min(x1, x2) + 1) * (Math.max(y1, y2) - Math.min(y1, y2) + 1) * (Math.max(z1, z2) - Math.min(z1, z2) + 1),
            procB: 0, procC: 0, pendC: 0, totC: 0, done: !1, p: !1, startTime: Date.now(), x1, y1, z1, x2, y2, z2,
            airOctree: new OctreeNode({ minX: Math.min(x1, x2), minY: Math.min(y1, y2), minZ: Math.min(z1, z2), maxX: Math.max(x1, x2), maxY: Math.max(y1, y2), maxZ: Math.max(z1, z2) }),
            cbMap: new Map()
        };
        for (let sx = proc.sx; sx <= proc.ex; sx += 16) for (let sz = proc.sz; sz <= proc.ez; sz += 16) proc.cq.push({ chunkStartX: sx, chunkStartZ: sz });
        proc.totC = proc.pendC = proc.cq.length;
        clientMessage(`初始化完成：区块 ${proc.totC}，方块 ${proc.totB}`);
    } catch (e) { clientMessage("initProc error: " + e.message); }
};

const saveChunk = ch => { try { write_file(chunksDir + "/chunk_" + ch.startX + "_" + ch.startZ + ".json", JSON.stringify(ch)); } catch (e) { clientMessage("saveChunk error: " + e.message); } };
const updMeta = () => {
    try {
        write_file(progFile, JSON.stringify({
            cq: proc.cq, cc: proc.cc, cbi: proc.cbi,
            chunkFiles: proc.cbMap ? [...proc.cbMap.keys()].map(k => "chunk_" + k.split(',')[0] + "_" + k.split(',')[1] + ".json") : [],
            ns: proc.ns, nsMap: Object.fromEntries(proc.nsMap),
            sx: proc.sx, sy: proc.sy, sz:proc.sz, ex: proc.ex, ey: proc.ey, ez: proc.ez,
            procB: proc.procB, procC: proc.procC, pendC: proc.pendC, startTime: proc.startTime, totC: proc.totC, airOctree: serOct(proc.airOctree)
        }));
    } catch (e) { clientMessage("updMeta error: " + e.message); }
};

const resProg = () => {
    try {
        if (!file_exist(progFile)) return clientMessage("No saved progress found.");
        const m = JSON.parse(read_file(progFile));
        Object.assign(proc, {
            cq: m.cq, cc: m.cc, cbi: m.cbi, ns: m.ns, nsMap: new Map(Object.entries(m.nsMap)),
            sx: m.sx, sy: m.sy, sz: m.sz, ex: m.ex, ey: m.ey, ez: m.ez,
            procB: m.procB, procC: m.procC, pendC: m.pendC, startTime: m.startTime,
            totC: m.totC || (m.cq ? m.cq.length + m.procC : 0),
            airOctree: desOct(m.airOctree), cbMap: new Map()
        });
        m.chunkFiles?.forEach(f => {
            let fp = chunksDir + "/" + f;
            if (file_exist(fp)) {
                let [relX, relZ] = f.replace('chunk_', '').replace('.json', '').split('_').map(Number);
                proc.cbMap.set(relX + "," + relZ, JSON.parse(read_file(fp)));
            }
        });
        proc.done = !1; proc.p = !1;
        clientMessage("恢复上次保存数据");
    } catch (e) { clientMessage("resProg error: " + e.message); }
};

const saveBlks = d => {
    const m = new Map, {chunkedBlocks: c, namespaces: n} = d;
    let t = 0;
    c.forEach(k => k.blocks.forEach(b => {
        const s = n[b[0]];
        m.set(s, (m.get(s) || 0) + 1);
        t++;
    }));
    const s = [...m.entries()].sort((a, b) => b[1] - a[1]), M = 50;
    const p = (v) => (v / t * 100).toFixed(2);
    const l = (v) => Math.ceil(M * v / t);
    const f = (v) => v >= 1e6 ? `${(v / 1e6).toFixed(2)} 百万` : v >= 1e3 ? `${(v / 1e3).toFixed(1)} 千` : v.toString();
    const a = s.map(([N, C], i) => {
        const P = p(C), L = l(C), S = nsList[N.replace("minecraft:", "")] || N.replace("minecraft:", "");
        const o = P > 50 ? "§c" : P > 25 ? "§6" : P > 10 ? "§e" : "§b";
        return `${o}${String(i + 1).padStart(2)}. ${S.padEnd(20)} §a${"|".repeat(L)}§7${"|".repeat(M - L)} §f${f(C)} (${P}%)`;
    }).join("\n");
    addForm(JSON.stringify({
        type: "custom_form",
        title: "保存建筑数据",
        content: [{type: "label", text: `§l§6方块统计 (总数: ${t.toLocaleString()})§r\n${a}`},
            {type: "input", text: "要移除的命名空间索引 (用空格分隔，如: 1 2 3):", placeholder: "例如: 1 2 3"},
            {
                type: "input",
                text: "保存名称:",
                default: (getWorldData() ? getWorldData().levelName : new Date().toISOString().slice(0, 19).replace("T", " ")) + " - " + (d.totB / 1e4).toFixed(2) + " 万 blocks"
            }]
    }), ($, r, F) => {
        $ === -1 && clientMessage("§c未保存");
        r?.trim() && (() => {
            try {
                const R = new Set(r.trim().split(/\s+/).map(n => parseInt(n) - 1).filter(n => !isNaN(n) && n >= 0 && n < s.length).map(i => s[i][0]));
                d.chunkedBlocks = c.map(h => ({...h, blocks: h.blocks.filter(b => !R.has(n[b[0]]))}));
                d.totB = c.reduce((u, h) => u + h.blocks.length, 0);
                clientMessage(`§e已移除以下命名空间的方块: ${[...R].map(n => n.replace("minecraft:", "")).join(", ")}`);
            } catch (e) {
                clientMessage(`§c处理移除命名空间时出错: ${e.message}`);
            }
        })();
        F?.trim() ? (write_file(getResource() + `/data/${F}.json`, JSON.stringify(d)), clientMessage("§e保存成功.")) : clientMessage("§c未保存");
    });
};

let cnt2 = 0;

const procNext = () => {
    try {
        cnt2++;
        const sp = globalThis.fun_exportSpeed || 100, rg = globalThis.fun_exportRange || 40, bpc = sp * 10, cs = 16,
            airRad = globalThis.fun_airCheckRadius || 0, airStr = Math.max(1, Math.floor(airRad / Math.sqrt(3))), snglBlkStr = Math.max(1, Math.floor(airRad / 2));
        if (proc.airOctree && !proc.airEqSet) {
            let airEq = 0b1;
            if (globalThis.fun_treatStoneAsAir) airEq |= 0b10;
            proc.airOctree.setAirEq(airEq);
            proc.airEqSet = true;
        }
        if (!proc.cc && proc.cq.length) {
            proc.cc = getNChunk();
            proc.cbi = 0;
            let { x, y, z } = getEntityPos(id), dx = x - proc.cc.chunkStartX, dy = y - posData.y, dz = z - proc.cc.chunkStartZ, d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d >= rg) {
                proc.p = true;
                const tpCmd = "tp " + proc.cc.chunkStartX + " ~ " + proc.cc.chunkStartZ, tpPlugCmd = "/ww tp " + Math.floor(proc.cc.chunkStartX) + " " + Math.floor(y) + " " + Math.floor(proc.cc.chunkStartZ);
                typeof fun_isAdmin !== "undefined" && fun_isAdmin ? (executeCommand(tpCmd), thread(() => { proc.p = false; procNext(); }, 700 + (bpc / 5 | 0))) : (executePluginCommand(tpPlugCmd), chkD());
                return sDelay(1000);
            }
        }
        if (proc.cc) {
            const sX = proc.cc.chunkStartX, sZ = proc.cc.chunkStartZ, sy = proc.sy, h = proc.ey - sy + 1;
            const ew = Math.min(cs, proc.ex - sX + 1), ed = Math.min(cs, proc.ez - sZ + 1), tot = ew * ed * h, stride = ed * h;
            if (!proc.cbi) {
                const placeH = "minecraft:client_request_placeholder_block";
                if ([getBlock(sX, sy, sZ).namespace, getBlock(sX + ew - 1, sy, sZ).namespace, getBlock(sX, sy, sZ + ed - 1).namespace, getBlock(sX + ew - 1, sy, sZ + ed - 1).namespace, getBlock(sX + (ew / 2 | 0), sy, sZ + (ed / 2 | 0)).namespace].some(ns => ns === placeH)) {
                    const tpCmd = "tp " + sX + " ~ " + sZ;
                    typeof fun_isAdmin !== "undefined" && fun_isAdmin ? (clientMessage("检测到区块在 (" + sX + "," + sy + "," + sZ + ") 或关键点未加载，正在传送..."), executeCommand(tpCmd)) : chkD();
                    return sDelay(1000);
                }
            }
            let isAllAir = proc.airOctree && airRad > 0;
            if (isAllAir) {
                const corners = [{ x: sX, y: sy, z: sZ }, { x: sX + ew - 1, y: sy, z: sZ }, { x: sX, y: sy, z: sZ + ed - 1 }, { x: sX + ew - 1, y: sy, z: sZ + ed - 1 }, { x: sX + (ew / 2 | 0), y: sy + (h / 2 | 0), z: sZ + (ed / 2 | 0) }];
                isAllAir = corners.every(p => proc.airOctree.containsPoint(p));
                if (isAllAir) {
                    for (let x = 0; x < ew; x += airStr) for (let y = 0; y < h; y += airStr) for (let z = 0; z < ed; z += airStr) {
                        const hx = sX + x, hy = sy + y, hz = sZ + z;
                        if (!proc.airOctree.containsPoint({ x: hx, y: hy, z: hz })) { isAllAir = false; break; }
                    }
                    if (!isAllAir) isAllAir = false;
                }
            }
            if (isAllAir) { proc.cbi = tot; proc.procB += tot; }
            else {
                let blks = [];
                const cmdMask = 0b100 | 0b10 | 0b1;
                for (let i = 0; i < bpc && proc.cbi < tot; i++) {
                    const idx = proc.cbi, xOff = idx / stride | 0, rem = idx % stride, yOff = rem / ed | 0, zOff = rem - yOff * ed;
                    const hx = sX + xOff, hy = sy + yOff, hz = sZ + zOff;
                    let skip = false;
                    if (proc.airOctree && airRad > 0) {
                        const airCheckResult = proc.airOctree.containsPointFast({ x: hx, y: hy, z: hz });
                        if (airCheckResult !== 0) { proc.cbi += snglBlkStr; proc.procB += snglBlkStr; skip = true; }
                    }
                    if (!skip) {
                        const b = getBlock(hx, hy, hz), ns = b.namespace;
                        if (!exBlks[ns]) {
                            let blksIdx = blks.length;
                            blks[blksIdx] = [getNS(ns), b.aux, hx - sX, hy - sy, hz - sZ];
                            let nsIndex = -1;
                            if (ns === "minecraft:command_block") nsIndex = 0;
                            else if (ns === "minecraft:chain_command_block") nsIndex = 1;
                            else if (ns === "minecraft:repeating_command_block") nsIndex = 2;
                            if (nsIndex !== -1 && (cmdMask & (1 << nsIndex))) {
                                blks[blksIdx].push(JSON.stringify({ blockNBT: encodeURIComponent(getBlockNBT(hx, hy, hz)), blockCompleteNBT: encodeURIComponent(getBlockEntityNBT(hx, hy, hz)) }));
                            }
                            nsCnt.set(ns, (nsCnt.get(ns) || 0) + 1);
                        }
                        proc.airOctree.insert({ x: hx, y: hy, z: hz }, ns);
                        proc.cbi++;
                        proc.procB++;
                    }
                }
                const relX = sX - proc.sx, relZ = sZ - proc.sz;
                let chunk = proc.cbMap.get(relX + "," + relZ);
                chunk ? chunk.blocks = chunk.blocks.concat(blks) : proc.cbMap.set(relX + "," + relZ, { startX: relX, startZ: relZ, blocks: blks });
            }
            if (proc.cbi >= tot) {
                const relX = sX - proc.sx, relZ = sZ - proc.sz;
                let chunk = proc.cbMap.get(relX + "," + relZ) || { startX: relX, startZ: relZ, blocks: [] };
                saveChunk(chunk);
                updMeta();
                proc.cc = null;
                proc.cbi = 0;
                proc.procC++;
                proc.pendC = proc.cq.length;
            }
            const now = Date.now(), sw = 3000;
            if (!proc.lastSampleTime) { proc.lastSampleTime = now; proc.lastProcB = proc.procB; proc.currentBlockSpeed = 0; }
            if (now - proc.lastSampleTime >= sw) {
                const dt = (now - proc.lastSampleTime) / 1000, db = proc.procB - proc.lastProcB;
                proc.currentBlockSpeed = db / dt;
                proc.lastSampleTime = now;
                proc.lastProcB = proc.procB;
            }
            const remBlks = proc.totB - proc.procB, remT = remBlks / (proc.currentBlockSpeed || 1);
            const perc = (proc.procC / proc.totC) * 100, pBar = cProg(perc, 50), procStr = (proc.procB / 10000).toFixed(2);
            const totStr = (proc.totB / 10000).toFixed(2), spdStr = (proc.currentBlockSpeed / 10000).toFixed(2);
            if (cnt2 % 20 === 0) {
                showTipMessage("§a正在保存...\n" + pBar + " §e" + Math.min(perc.toFixed(2), 100) + "%\n§b区块扫描进度: §f" + proc.procC + " §b/ §f" + proc.totC + "\n§b已处理区块: §f" + procStr + " 万 §b/ §f" + totStr + " 万\n§b导出速度: §f" + spdStr + " 万区块/秒 \n§b剩余时间: §f" + fmtT(remT) + (fun_showNS ? "\n§e命名空间统计:\n" + showNsStats(nsCnt) : ""));
            }
        }
        if (!proc.cq.length && !proc.cc && !proc.done) {
            proc.done = true;
            const chunks = [...proc.cbMap.values()];
            const calcTotB = chunks.reduce((s, c) => s + c.blocks.length, 0);
            const res = { chunkedBlocks: chunks, namespaces: proc.ns, totB: calcTotB, entities: expEnt(proc.x1, proc.y1, proc.z1, proc.x2, proc.y2, proc.z2) };
            saveBlks(res);
            updMeta();
        }
    } catch (e) { clientMessage("procNextBatch error: " + e.message); }
};

const showNsStats = (nsCount) => {
    const nsSorted = [...nsCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
        .map(([ns, count]) => ({ ns: ns.replace("minecraft:", ""), count: count >= 1e6 ? (count / 1e6).toFixed(2) + " 万" : count >= 1e3 ? (count / 1e3).toFixed(2) + " 千" : count }));
    return nsSorted.reduce((acc, { ns, count }, i) => {
        let row = acc[acc.length - 1];
        row.length < 5 ? row.push("§6" + ns + "§f x " + count) : acc.push(["§6" + ns + "§f x " + count]);
        return acc;
    }, [[]]).map(row => row.join(" ")).join("§r\n");
};

const getNChunk = () => {
    try {
        let p = getEntityPos(id);
        return proc.cq.splice(proc.cq.reduce((acc, c, i) => (dCalc(p.x, p.y, p.z, c.chunkStartX, posData.y, c.chunkStartZ) < acc.d ? { i, d: dCalc(p.x, p.y, p.z, c.chunkStartX, posData.y, c.chunkStartZ) } : acc), { i: 0, d: Infinity }).i, 1)[0];
    } catch (e) { clientMessage("getNChunk error: " + e.message); }
};

const chkDist = () => {
    try {
        let p = getEntityPos(id), d = Math.round(dCalc(p.x, p.y, p.z, proc.cc.chunkStartX, p.y, proc.cc.chunkStartZ));
        showTipMessage("请前往目标，距离：" + d + "米\n玩家：(" + p.x.toFixed(2) + ", " + p.y.toFixed(2) + ", " + p.z.toFixed(2) + ")\n目标：(" + proc.cc.chunkStartX + ", " + p.y + ", " + proc.cc.chunkStartZ + ")");
        d < 20 ? proc.p = !1 : thread(chkDist, 1050);
    } catch (e) { clientMessage("chkDist error: " + e.message); }
};

let cnt = 0;

const tick = () => {
    posData = getEntityPos(id);
    cnt++;
    try {
        if (chkD()) return;
        !proc.p && !proc.done ? procNext() : cnt % 20 === 0 && updSelTip();
    } catch (e) { clientMessage("tick error: " + e.message); }
};

const sPosF = () => {
    const fmtC = p => p ? [p.x, p.y, p.z].map(Math.floor).join(" ") : "";
    addForm(JSON.stringify({
        type: "custom_form", title: "§c创建导出任务", content: [
            { type: "input", placeholder: "例如 100 10 100", text: "开始坐标", default: fmtC(sData?.start) },
            { type: "input", placeholder: "例如 100 10 100", text: "结束坐标", default: fmtC(sData?.end) }
        ]
    }), (sPos, ePos) => {
        if (!sPos || !ePos) return;
        const parseC = s => s.trim().split(/\s+/).map(Number);
        const [sArr, eArr] = [parseC(sPos), parseC(ePos)];
        sArr.length !== 3 || eArr.length !== 3 ? clientMessage("输入错误，请确保坐标格式正确。") :
            (([x1, y1, z1], [x2, y2, z2]) => {
                const bc = Math.abs((x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1));
                clientMessage("开始任务：" + new Date().toISOString().split(".")[0].replace("T", " ") + "，扫描方块数：" + bc);
                initProc(x1, y1, z1, x2, y2, z2, () => { });
            })(sArr, eArr);
        sData.start = null;
    });
};

curl_get("http://webform.rb9.top/require-menu-2.js", {}, (r, d) => {
    globalThis.functionId = "build-Tools-V5";
    globalThis.functionName = "建筑助手-导出";
    eval(d);
    sMain();
    setTimeout(() => {
        globalThis.onTickEvent = tick;
        clientMessage("§d§l§o[" + functionId + "] §e此版本为建筑助手分割出来的一小部分导出代码. \n作者:By Craft");
    }, 300);
});