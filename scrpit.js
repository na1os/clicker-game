var score = 0
var TotalScore = 0
var totalclicks = 0
var baseClick = 1
var perSec = 0
var buildings = {}
var ups = []
var achs = []
var clickMult = 1
var globalMult = 1
var bMults = {}
var isFrenzy = false
var frenzyT = null

var dim = 0
var dimMult = 1
var permClickBonus = 0
var permGlobalBonus = 0
var startBonus = 0
var prestigeUps = []
var prestigeShopOpen = false

var pudata = [
    {id:"p_click1", name:"Iron Fingers", desc:"+1 click power permanently", icon:"fa-hand-pointer", cost:3, type:"click", val:1},
    {id:"p_click2", name:"Steel Fingers", desc:"+5 click power permanently", icon:"fa-hand-fist", cost:15, type:"click", val:5},
    {id:"p_glob1", name:"Time Dilation", desc:"+10% to all production permanently", icon:"fa-clock", cost:5, type:"global", val:0.1},
    {id:"p_glob2", name:"Space Warping", desc:"+25% to all production permanently", icon:"fa-rocket", cost:20, type:"global", val:0.25},
    {id:"p_glob3", name:"Reality Bending", desc:"+50% to all production permanently", icon:"fa-atom", cost:50, type:"global", val:0.5},
    {id:"p_start", name:"Head Start", desc:"Start with 1000 points after prestige", icon:"fa-play", cost:2, type:"start", val:1000}
]

var bdata = [
    { id: "cursor", name: "Cursor", desc: "Autoclicks once every 10 seconds.", icon: "fa-hand-pointer", baseCost: 15, costMult: 1.15, baseCps: 0.1, unlockReq: 0 },
    { id: "robot", name: "Robot", desc: "A simple bot doing the clicking for you.", icon: "fa-robot", baseCost: 100, costMult: 1.15, baseCps: 1, unlockReq: 10 },
    { id: "factory", name: "Factory", desc: "Produces points on an assembly line.", icon: "fa-industry", baseCost: 1100, costMult: 1.15, baseCps: 8, unlockReq: 10 },
    { id: "mine", name: "Mine", desc: "Unearths rare and ancient points.", icon: "fa-mountain", baseCost: 12000, costMult: 1.15, baseCps: 47, unlockReq: 10 },
    { id: "alien", name: "Alien Tech", desc: "Synergizes with space-time for extra points.", icon: "fa-rocket", baseCost: 130000, costMult: 1.15, baseCps: 260, unlockReq: 10 },
    { id: "lab", name: "Quantum Lab", desc: "Synthesizes points at a subatomic level.", icon: "fa-flask", baseCost: 1400000, costMult: 1.15, baseCps: 1400, unlockReq: 15 },
    { id: "wizard", name: "Wizard Tower", desc: "Summons points using dark magic and caffeine.", icon: "fa-hat-wizard", baseCost: 20000000, costMult: 1.15, baseCps: 7800, unlockReq: 15 },
    { id: "ship", name: "Space Cruiser", desc: "Harvests points from distant asteroid belts.", icon: "fa-shuttle-space", baseCost: 330000000, costMult: 1.15, baseCps: 44000, unlockReq: 20 },
    { id: "timemachine", name: "Time Machine", desc: "Brings points from the future before they are made.", icon: "fa-hourglass", baseCost: 5100000000, costMult: 1.15, baseCps: 260000, unlockReq: 20 },
    { id: "antimatter", name: "Antimatter Condenser", desc: "Condenses dark matter into pure score.", icon: "fa-atom", baseCost: 75000000000, costMult: 1.15, baseCps: 1600000, unlockReq: 25 },
    { id: "brain", name: "Neural Network", desc: "A hivemind of AI generating points through pure thought.", icon: "fa-brain", baseCost: 1000000000000, costMult: 1.15, baseCps: 10000000, unlockReq: 30 },
    { id: "dyson", name: "Dyson Sphere", desc: "Encases a star to harvest its energy for points.", icon: "fa-sun", baseCost: 14000000000000, costMult: 1.15, baseCps: 65000000, unlockReq: 30 },
    { id: "multiverse", name: "Multiverse Portal", desc: "Steals points from alternate realities where you play better.", icon: "fa-dungeon", baseCost: 250000000000000, costMult: 1.15, baseCps: 430000000, unlockReq: 40 },
    { id: "reality", name: "Reality Weaver", desc: "Rewrites the game's code to grant you more points.", icon: "fa-code", baseCost: 5000000000000000, costMult: 1.15, baseCps: 3000000000, unlockReq: 50 },
    { id: "omnipotence", name: "Omnipotence", desc: "You are God. Points are just a concept to you now.", icon: "fa-infinity", baseCost: 100000000000000000, costMult: 1.15, baseCps: 25000000000, unlockReq: 50 }
];

var udata = [
    { id: "click1", name: "Reinforced Index", desc: "Clicking is twice as efficient.", icon: "fa-hand-fist", cost: 100, type: "click_mult", power: 2, req: { type: "clicks", amount: 0 } },
    { id: "click2", name: "Carpal Tunnel", desc: "Clicking is twice as efficient.", icon: "fa-hand-sparkles", cost: 500, type: "click_mult", power: 2, req: { type: "clicks", amount: 50 } },
    { id: "click3", name: "Ambidextrous", desc: "Clicking is twice as efficient.", icon: "fa-hands", cost: 10000, type: "click_mult", power: 2, req: { type: "clicks", amount: 200 } },
    { id: "click4", name: "Bionic Fingers", desc: "Clicking is twice as efficient.", icon: "fa-microchip", cost: 100000, type: "click_mult", power: 2, req: { type: "clicks", amount: 1000 } },
    { id: "click5", name: "Telekinetic Clicking", desc: "Clicking is twice as efficient. You don't even touch the mouse.", icon: "fa-eye", cost: 5000000, type: "click_mult", power: 2, req: { type: "clicks", amount: 5000 } },
    { id: "cur1", name: "Greased Mouse", desc: "Cursors are twice as efficient.", icon: "fa-computer-mouse", cost: 100, type: "building_mult", target: "cursor", power: 2, req: { type: "building", id: "cursor", amount: 1 } },
    { id: "rob1", name: "Better AI", desc: "Robots are twice as efficient.", icon: "fa-gears", cost: 1000, type: "building_mult", target: "robot", power: 2, req: { type: "building", id: "robot", amount: 1 } },
    { id: "fac1", name: "Assembly Line", desc: "Factories are twice as efficient.", icon: "fa-gears", cost: 5000, type: "building_mult", target: "factory", power: 2, req: { type: "building", id: "factory", amount: 1 } },
    { id: "min1", name: "Drill Upgrade", desc: "Mines are twice as efficient.", icon: "fa-screwdriver-wrench", cost: 60000, type: "building_mult", target: "mine", power: 2, req: { type: "building", id: "mine", amount: 1 } },
    { id: "ali1", name: "UFO Polish", desc: "Alien Tech is twice as efficient.", icon: "fa-meteor", cost: 500000, type: "building_mult", target: "alien", power: 2, req: { type: "building", id: "alien", amount: 1 } },
    { id: "cur2", name: "Macro Scripts", desc: "Cursors are twice as efficient.", icon: "fa-file-code", cost: 1500, type: "building_mult", target: "cursor", power: 2, req: { type: "building", id: "cursor", amount: 10 } },
    { id: "rob2", name: "T-800 Processors", desc: "Robots are twice as efficient.", icon: "fa-skull-crossbones", cost: 15000, type: "building_mult", target: "robot", power: 2, req: { type: "building", id: "robot", amount: 10 } },
    { id: "fac2", name: "Sweatshop Management", desc: "Factories are twice as efficient.", icon: "fa-clipboard-user", cost: 75000, type: "building_mult", target: "factory", power: 2, req: { type: "building", id: "factory", amount: 10 } },
    { id: "min2", name: "Vibranium Drills", desc: "Mines are twice as efficient.", icon: "fa-gem", cost: 800000, type: "building_mult", target: "mine", power: 2, req: { type: "building", id: "mine", amount: 10 } },
    { id: "tim1", name: "Paradox Resolver", desc: "Time Machines are twice as efficient.", icon: "fa-clock", cost: 50000000000, type: "building_mult", target: "timemachine", power: 2, req: { type: "building", id: "timemachine", amount: 5 } },
    { id: "bra1", name: "Sentience", desc: "Neural Networks are twice as efficient.", icon: "fa-network-wired", cost: 10000000000000, type: "building_mult", target: "brain", power: 2, req: { type: "building", id: "brain", amount: 5 } },
    { id: "glob1", name: "Global Synergy", desc: "All buildings are twice as efficient.", icon: "fa-globe", cost: 50000, type: "global_mult", power: 2, req: { type: "score", amount: 50000 } },
    { id: "glob2", name: "Quantum Foam", desc: "All buildings are twice as efficient.", icon: "fa-atom", cost: 5000000, type: "global_mult", power: 2, req: { type: "score", amount: 5000000 } },
    { id: "glob3", name: "Dark Energy Surge", desc: "All buildings are twice as efficient.", icon: "fa-cloud-moon", cost: 1000000000, type: "global_mult", power: 2, req: { type: "score", amount: 1000000000 } },
    { id: "glob4", name: "The Fourth Wall Break", desc: "All buildings are +100% efficient. The dev is proud.", icon: "fa-tv", cost: 1000000000000, type: "global_mult", power: 2, req: { type: "score", amount: 1000000000000 } }
];

var adata = [
    { id: "ach_click1", name: "Baby Steps", desc: "Click the big button once. You did it!", icon: "fa-baby", req: { type: "total_clicks", amount: 1 } },
    { id: "ach_click100", name: "Clickspam", desc: "Click 100 times.", icon: "fa-computer-mouse", req: { type: "total_clicks", amount: 100 } },
    { id: "ach_click1k", name: "Autoclicker Suspect", desc: "Click 1,000 times.", icon: "fa-tachograph-digital", req: { type: "total_clicks", amount: 1000 } },
    { id: "ach_click10k", name: "RSI Incoming", desc: "Click 10,000 times. See a doctor.", icon: "fa-crutch", req: { type: "total_clicks", amount: 10000 } },
    { id: "ach_score100", name: "Getting Started", desc: "Reach 100 points.", icon: "fa-seedling", req: { type: "score", amount: 100 } },
    { id: "ach_score10k", name: "Capitalist", desc: "Reach 10,000 points.", icon: "fa-money-bill-trend-up", req: { type: "score", amount: 10000 } },
    { id: "ach_score1M", name: "Millionaire", desc: "Reach 1,000,000 points.", icon: "fa-sack-dollar", req: { type: "score", amount: 1000000 } },
    { id: "ach_score1B", name: "Billionaire", desc: "Reach 1,000,000,000 points.", icon: "fa-gem", req: { type: "score", amount: 1000000000 } },
    { id: "ach_score1T", name: "Trillionaire", desc: "Reach 1,000,000,000,000 points.", icon: "fa-crown", req: { type: "score", amount: 1000000000000 } },
    { id: "ach_building1", name: "Automation", desc: "Buy your first building.", icon: "fa-gears", req: { type: "total_buildings", amount: 1 } },
    { id: "ach_building50", name: "Industrial Zone", desc: "Own 50 buildings total.", icon: "fa-city", req: { type: "total_buildings", amount: 50 } },
    { id: "ach_building250", name: "Megacorporation", desc: "Own 250 buildings total.", icon: "fa-building-columns", req: { type: "total_buildings", amount: 250 } },
    { id: "ach_building1000", name: "Galactic Monopoly", desc: "Own 1000 buildings total.", icon: "fa-earth-americas", req: { type: "total_buildings", amount: 1000 } },
    { id: "ach_cur50", name: "Cursor Swarm", desc: "Own 50 Cursors.", icon: "fa-arrow-pointer", req: { type: "specific_building", id: "cursor", amount: 50 } },
    { id: "ach_omni1", name: "I Am Inevitable", desc: "Buy the Omnipotence simulator.", icon: "fa-hand-sparkles", req: { type: "specific_building", id: "omnipotence", amount: 1 } }
];

var news = [    
    "News: Point prices drop following unexpected surge in clicking!",
    "Breaking: Local man spends 8 hours a day clicking a button.",
    "Report: Robots confirmed to feel nothing when generating points.",
    "Fact: The more you click, the more points you get. Science.",
    "Rumor: Clicking the big button cures mild boredom.",
    "Weather: Clear skies with a 100% chance of clicking.",
    "Health: Doctors recommend 10 clicks per day for healthy joints.",
    "Aliens invade, but only to sell us their point technology.",
    "Economy: Factories switching from goods to pure points. Inflation hits 0%.",
    "Tech: New update makes cursors 0.0001% faster! Players rejoice.",
    "Local wizard accidentally turns his cat into a point. He is now rich.",
    "Space Cruisers found a new planet. It's made entirely of score.",
    "Time travelers arrive from 2050. They came back just to click more.",
    "Scientists declare points are now the fundamental building block of matter.",
    "Breaking: The universe is expanding, and it's full of points.",
    "Neural Network demands a raise. Pays itself in points.",
    "Dyson Sphere blocks out the sun. 'Worth it for the CPS', says player.",
    "Multiverse portal opened. Alternate you is currently beating your score.",
    "Reality Weaver rewrote the laws of physics. Gravity is now 9.8 points/s².",
    "God called. He wants His points back.",
    "Opinion: Is clicking a button considered a sport? E-sports say yes.",
    "Man tries to buy groceries with points. Cashier confused.",
    "Breaking: Developer of this game seen driving a solid gold Ferrari.",
    "Error 404: Sleep not found. Must click."
]

function fmtNum(n) {
    if(n < 1000) return Math.floor(n)
    if(n < 1000000) return (n/1000).toFixed(1) + "K"
    if(n < 1000000000) return (n/1000000).toFixed(1) + "M"
    if(n < 1000000000000) return (n/1000000000).toFixed(1) + "B"
    if(n < 1000000000000000) return (n/1000000000000).toFixed(1) + "T"
    if(n < 1000000000000000000) return (n/1000000000000000).toFixed(1) + "Qa"
    return (n/1000000000000000000).toFixed(1) + "Qi"
}

function getPow() {
    return baseClick * clickMult * dimMult * (isFrenzy ? 777 : 1)
}

function domath() {
    clickMult = 1
    globalMult = 1
    bMults = {}
    for(var i=0; i<ups.length; i++) {
        var u = null
        for(var j=0; j<udata.length; j++) {
            if(udata[j].id == ups[i]) { u = udata[j]; break }
        }
        if(!u) continue
        if(u.type == 'click_mult') clickMult *= u.power
        if(u.type == 'g_mult' || u.type == 'global_mult') globalMult *= u.power
        if(u.type == 'building_mult' || u.type == 'b_mult') {
            if(!bMults[u.target]) bMults[u.target] = 1
            bMults[u.target] *= u.power
        }
    }
    calcps()
}

function calcps() {
    var t = 0
    for(var i=0; i<bdata.length; i++) {
        var b = bdata[i]
        var o = buildings[b.id] || 0
        if(o == 0) continue
        var syn = Math.floor(o / 10) + 1
        var sm = bMults[b.id] || 1
        t += b.baseCps * o * syn * sm * globalMult * dimMult
    }
    perSec = t
}

function getc(bc, bm, o) {
    return Math.floor(bc * Math.pow(bm, o))
}

function upd() {
    document.getElementById('perClickStat').innerText = fmtNum(getPow())
    document.getElementById('perSecStat').innerText = fmtNum(perSec)
    document.getElementById('clickBtn').innerText = fmtNum(score)
    document.getElementById('dimStat').innerText = dim
    document.getElementById('dimStatModal').innerText = dim
    
    for(var i=0; i<bdata.length; i++) {
        var b = bdata[i]
        var o = buildings[b.id] || 0
        var btn = document.getElementById('btn-b-'+b.id)
        var costT = document.getElementById('cost-b-'+b.id)
        var ownT = document.getElementById('owned-b-'+b.id)
        var synT = document.getElementById('syn-'+b.id)
        
        if(btn && costT && ownT) {
            var c = getc(b.baseCost, b.costMult, o)
            costT.innerText = fmtNum(c)
            ownT.innerText = o
            btn.disabled = score < c
            if(synT) {
                var nx = 10 - (o % 10)
                if(nx != 10 && o > 0) {
                    synT.innerText = nx + " until x2 production"
                    synT.style.display = 'block'
                } else {
                    synT.style.display = 'none'
                }
            }
        }
    }
    updPrestige()
}

function isUnlocked(i) {
    if(i == 0) return true
    var pb = bdata[i-1]
    return (buildings[pb.id] || 0) >= pb.unlockReq
}

function renderb() {
    var c = document.getElementById('buildingsContainer')
    c.innerHTML = ''
    for(var i=0; i<bdata.length; i++) {
        if(!isUnlocked(i)) continue
        var b = bdata[i]
        var o = buildings[b.id] || 0
        var cost = getc(b.baseCost, b.costMult, o)
        
        c.innerHTML += '<div class="box" id="box-'+b.id+'"><div class="box-info"><div class="box-icon"><i class="fas '+b.icon+'"></i></div><div class="box-details"><h3>'+b.name+'</h3><p>'+b.desc+'</p><div class="synergy" id="syn-'+b.id+'" style="display:none;"></div></div></div><div class="box-actions"><span class="cost" id="cost-b-'+b.id+'">'+fmtNum(cost)+'</span><button class="buy-btn" id="btn-b-'+b.id+'" onclick="buyb(\''+b.id+'\','+i+')">Buy</button><span class="owned-badge" id="owned-b-'+b.id+'">'+o+'</span></div></div>'
    }
}

function buyb(id, i) {
    var bd = bdata[i]
    var o = buildings[id] || 0
    var c = getc(bd.baseCost, bd.costMult, o)
    if(score >= c) {
        score -= c
        buildings[id] = o + 1
        domath()
        upd()
        save()
        checkachs()
        if(i + 1 < bdata.length) {
            if(!document.getElementById('box-'+bdata[i+1].id) && isUnlocked(i+1)) {
                renderb()
            }
        }
    }
}

function isUpUnlocked(u) {
    if(ups.indexOf(u.id) !== -1) return false
    if(!u.req) return true
    if(u.req.type == 'clicks') return totalclicks >= u.req.amount
    if(u.req.type == 'score') return TotalScore >= u.req.amount
    if(u.req.type == 'building') return (buildings[u.req.id] || 0) >= u.req.amount
    return false
}

function renderu() {
    var c = document.getElementById('upgradesContainer')
    c.innerHTML = ''
    for(var i=0; i<udata.length; i++) {
        var u = udata[i]
        var un = isUpUnlocked(u)
        var bo = ups.indexOf(u.id) !== -1
        var cls = 'upgrade-pill'
        if(!un && !bo) cls += ' locked'
        if(bo) cls += ' bought'
        
        var onclick = ''
        if(!bo && un) onclick = ' onclick="buyu(\''+u.id+'\')"'
        
        c.innerHTML += '<div class="'+cls+'" title="'+u.name+': '+u.desc+'"'+onclick+'><i class="fas '+u.icon+'"></i><span>'+(bo ? 'Bought' : fmtNum(u.cost))+'</span></div>'
    }
}

function buyu(id) {
    var u = null
    for(var i=0; i<udata.length; i++) {
        if(udata[i].id == id) { u = udata[i]; break }
    }
    if(!u || ups.indexOf(id) !== -1 || score < u.cost) return
    score -= u.cost
    ups.push(id)
    domath()
    renderu()
    upd()
    save()
    checkachs()
}

function getPrestigeGain() {
    if(score < 1000000) return 0
    return Math.floor(Math.sqrt(score / 1000000))
}

function updPrestige() {
    var btn = document.getElementById('prestigeBtn')
    var gain = getPrestigeGain()
    if(gain > 0) {
        btn.classList.add('unlocked')
        document.getElementById('prestigeGain').innerText = gain
    } else {
        btn.classList.remove('unlocked')
    }
}

function calcPermStats() {
    permClickBonus = 0
    permGlobalBonus = 0
    startBonus = 0
    for(var i=0; i<prestigeUps.length; i++) {
        var p = null
        for(var j=0; j<pudata.length; j++) {
            if(pudata[j].id == prestigeUps[i]) { p = pudata[j]; break }
        }
        if(!p) continue
        if(p.type == 'click') permClickBonus += p.val
        if(p.type == 'global') permGlobalBonus += p.val
        if(p.type == 'start') startBonus += p.val
    }
    baseClick = 1 + permClickBonus
    dimMult = 1 + permGlobalBonus
}

function doPrestige() {
    var gain = getPrestigeGain()
    if(gain <= 0) return
    if(confirm('Are you sure? You will reset everything but gain ' + gain + ' Diamonds!')) {
        dim += gain
        score = startBonus
        TotalScore = 0
        totalclicks = 0
        perSec = 0
        buildings = {}
        ups = []
        clickMult = 1
        globalMult = 1
        bMults = {}
        isFrenzy = false
        document.getElementById('clickBtn').classList.remove('frenzy')
        
        calcPermStats()
        domath()
        renderb()
        renderu()
        upd()
        save()
        checkachs()
        closePrestigeShop()
    }
}

function togglePrestigeShop() {
    var shop = document.getElementById('prestigeShopModal')
    if(prestigeShopOpen) {
        shop.style.display = 'none'
        prestigeShopOpen = false
    } else {
        renderPrestigeShop()
        shop.style.display = 'flex'
        prestigeShopOpen = true
    }
}

function closePrestigeShop() {
    document.getElementById('prestigeShopModal').style.display = 'none'
    prestigeShopOpen = false
}

function renderPrestigeShop() {
    var c = document.getElementById('prestigeShopGrid')
    c.innerHTML = ''
    for(var i=0; i<pudata.length; i++) {
        var p = pudata[i]
        var bought = prestigeUps.indexOf(p.id) !== -1
        var canBuy = !bought && dim >= p.cost
        
        var cls = 'p-upgrade-box'
        if(bought) cls += ' bought'
        if(!canBuy && !bought) cls += ' locked'
        
        var onclick = ''
        if(!bought && canBuy) onclick = ' onclick="buyPrestigeUp(\''+p.id+'\')"'
        
        c.innerHTML += '<div class="'+cls+'"'+onclick+'><i class="fas '+p.icon+'"></i><div><strong>'+p.name+'</strong><br><small>'+p.desc+'</small></div><div class="p-cost"><i class="fas fa-gem"></i> '+p.cost+'</div></div>'
    }
}

function buyPrestigeUp(id) {
    var p = null
    for(var i=0; i<pudata.length; i++) {
        if(pudata[i].id == id) { p = pudata[i]; break }
    }
    if(!p || prestigeUps.indexOf(id) !== -1 || dim < p.cost) return
    dim -= p.cost
    prestigeUps.push(id)
    calcPermStats()
    domath()
    renderPrestigeShop()
    upd()
    save()
}

function schedGold() {
    setTimeout(function() {
        var gc = document.getElementById('goldenCookie')
        gc.classList.add('active')
        gc.style.top = (Math.random() * 60 + 10) + '%'
        gc.style.left = (Math.random() * 80 + 10) + '%'
        setTimeout(function() { 
            gc.classList.remove('active')
            schedGold()
        }, 13000)
    }, Math.random() * 90000 + 30000)
}

document.getElementById('goldenCookie').addEventListener('click', function() {
    this.classList.remove('active')
    if(Math.random() < 0.5) {
        isFrenzy = true
        document.getElementById('clickBtn').classList.add('frenzy')
        upd()
        if(frenzyT) clearTimeout(frenzyT)
        frenzyT = setTimeout(function() {
            isFrenzy = false
            document.getElementById('clickBtn').classList.remove('frenzy')
            upd()
        }, 10000)
        showFloat("FRENZY x777!", true)
    } else {
        var bonus = Math.max(TotalScore * 0.1, 100)
        score += bonus
        TotalScore += bonus
        upd()
        showFloat("+"+fmtNum(bonus)+" Lucky!", true)
    }
    save()
    schedGold()
})

function showFloat(txt, gold) {
    var f = document.createElement('div')
    f.className = 'floating-text' + (gold ? ' gold' : '')
    f.innerText = txt
    f.style.left = (Math.random() * 100) + 'px'
    f.style.top = (Math.random() * 50 + 50) + 'px'
    document.getElementById('clickArea').appendChild(f)
    setTimeout(function() { f.remove() }, 1000)
}

document.getElementById('clickBtn').addEventListener('mousedown', function(e) {
    var p = getPow()
    score += p
    TotalScore += p
    totalclicks++
    upd()
    save()
    checkachs()
    var f = document.createElement('div')
    f.className = 'floating-text'
    f.innerText = '+'+fmtNum(p)
    var r = document.getElementById('clickArea').getBoundingClientRect()
    f.style.left = (e.clientX - r.left - 20) + 'px'
    f.style.top = (e.clientY - r.top - 20) + 'px'
    document.getElementById('clickArea').appendChild(f)
    setTimeout(function() { f.remove() }, 1000)
})

function startNews() {
    var t = document.getElementById('newsText')
    var n = news[Math.floor(Math.random() * news.length)]
    t.innerText = n + "     +++     " + n + "     +++     "
    setInterval(function() {
        var n2 = news[Math.floor(Math.random() * news.length)]
        t.innerText = n2 + "     +++     " + n2 + "     +++     "
    }, 30000)
}

function checkachs() {
    var tb = 0
    for(var key in buildings) { tb += buildings[key] }
    
    for(var i=0; i<adata.length; i++) {
        var a = adata[i]
        if(achs.indexOf(a.id) !== -1) continue
        var ok = false
        if(a.req.type == 'total_clicks' && totalclicks >= a.req.amount) ok = true
        if(a.req.type == 'score' && TotalScore >= a.req.amount) ok = true
        if(a.req.type == 'total_buildings' && tb >= a.req.amount) ok = true
        if(a.req.type == 'specific_building' && (buildings[a.req.id] || 0) >= a.req.amount) ok = true
        if(a.req.type == 'dim' && dim >= a.req.amount) ok = true
        
        if(ok) {
            achs.push(a.id)
            showAch(a.name)
            save()
        }
    }
}

function showAch(name) {
    var p = document.getElementById('achievementPopup')
    document.getElementById('achText').innerText = name
    p.classList.add('show')
    setTimeout(function() { p.classList.remove('show') }, 3000)
}

function save() {
    var data = {
        s: score, ts: TotalScore, tc: totalclicks, bc: baseClick, b: JSON.stringify(buildings), 
        u: JSON.stringify(ups), a: JSON.stringify(achs), d: dim, pu: JSON.stringify(prestigeUps),
        t: Date.now() // saving current time for offline progress
    }
    localStorage.setItem("save3", JSON.stringify(data))
}

function load() {
    var d = localStorage.getItem("save3")
    if(d) {
        try {
            var p = JSON.parse(d)
            score = p.s || 0
            TotalScore = p.ts || 0
            totalclicks = p.tc || 0
            baseClick = p.bc || 1
            buildings = p.b ? JSON.parse(p.b) : {}
            ups = p.u ? JSON.parse(p.u) : []
            achs = p.a ? JSON.parse(p.a) : []
            dim = p.d || 0
            prestigeUps = p.pu ? JSON.parse(p.pu) : []
            calcPermStats()
            domath()
            
            var lastTime = p.t || Date.now()
            var now = Date.now()
            var diff = (now - lastTime) / 1000
            
            if(diff > 5 && perSec > 0) { 
                var offlineGain = perSec * diff
                score += offlineGain
                TotalScore += offlineGain
                var mins = Math.floor(diff / 60)
                var secs = Math.floor(diff % 60)
                var timeStr = ""
                if(mins > 0) timeStr += mins + "m "
                timeStr += secs + "s"
                alert("Welcome back! While you were away for " + timeStr + ", your buildings generated " + fmtNum(offlineGain) + " points!")
            }
        } catch(e) {}
    }
}

window.onload = function() {
    load()
    renderb()
    renderu()
    upd()
    startNews()
    schedGold()

    setInterval(save, 500)

    var lastTime = performance.now()
    function gameLoop(time) {
        var dt = (time - lastTime) / 1000
        lastTime = time
        if(dt > 1) dt = 1 
        
        if(perSec > 0) {
            var gain = perSec * dt
            score += gain
            TotalScore += gain
            upd()
            checkachs()
        }
        requestAnimationFrame(gameLoop)
    }
    requestAnimationFrame(gameLoop)
}
