// scrpit.js - English version with Auto-buyer, export/import, upload, reset, and playtime stats

// State
var score = 0;
var TotalScore = 0;
var totalclicks = 0;
var baseClick = 1;
var perSec = 0;
var buildings = {};
var ups = [];
var achs = [];
var clickMult = 1;
var globalMult = 1;
var bMults = {};
var isFrenzy = false;
var frenzyT = null;

var dim = 0;
var dimMult = 1;
var permClickBonus = 0;
var permGlobalBonus = 0;
var startBonus = 0;
var prestigeUps = [];
var prestigeShopOpen = false;

// Session stats
var sessionStartTs = Date.now();
var playtimeTimer = null;

// Data (same as before)
var pudata = [
  {id:"p_click1", name:"Iron Fingers", desc:"+1 click power permanently", icon:"fa-hand-pointer", cost:3, type:"click", val:1},
  {id:"p_click2", name:"Steel Fingers", desc:"+5 click power permanently", icon:"fa-hand-fist", cost:15, type:"click", val:5},
  {id:"p_glob1", name:"Time Dilation", desc:"+10% to all production permanently", icon:"fa-clock", cost:5, type:"global", val:0.1},
  {id:"p_glob2", name:"Space Warping", desc:"+25% to all production permanently", icon:"fa-rocket", cost:20, type:"global", val:0.25},
  {id:"p_glob3", name:"Reality Bending", desc:"+50% to all production permanently", icon:"fa-atom", cost:50, type:"global", val:0.5},
  {id:"p_start", name:"Head Start", desc:"Start with 1000 points after prestige", icon:"fa-play", cost:2, type:"start", val:1000}
];

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
];

// Utilities
function fmtNum(n) {
  if (n < 1000) return Math.floor(n);
  if (n < 1000000) return (n / 1000).toFixed(1) + "K";
  if (n < 1000000000) return (n / 1000000).toFixed(1) + "M";
  if (n < 1000000000000) return (n / 1000000000).toFixed(1) + "B";
  if (n < 1000000000000000) return (n / 1000000000000000).toFixed(1) + "T";
  if (n < 1000000000000000000) return (n / 1000000000000000000).toFixed(1) + "Qa";
  return (n / 1000000000000000000).toFixed(1) + "Qi";
}

function formatTimeSeconds(s) {
  s = Math.max(0, Math.floor(s));
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function getPow() {
  return baseClick * clickMult * dimMult * (isFrenzy ? 777 : 1);
}

// Calculations
function domath() {
  clickMult = 1;
  globalMult = 1;
  bMults = {};
  for (var i = 0; i < ups.length; i++) {
    var uid = ups[i];
    var u = udata.find(function(x) { return x.id === uid; });
    if (!u) continue;
    if (u.type === 'click_mult') clickMult *= u.power;
    if (u.type === 'g_mult' || u.type === 'global_mult') globalMult *= u.power;
    if (u.type === 'building_mult' || u.type === 'b_mult') {
      if (!bMults[u.target]) bMults[u.target] = 1;
      bMults[u.target] *= u.power;
    }
  }
  calcps();
}

function calcps() {
  var t = 0;
  for (var i = 0; i < bdata.length; i++) {
    var b = bdata[i];
    var o = buildings[b.id] || 0;
    if (o === 0) continue;
    var syn = Math.floor(o / 10) + 1;
    var sm = bMults[b.id] || 1;
    t += b.baseCps * o * syn * sm * globalMult * dimMult;
  }
  perSec = t;
}

function getc(bc, bm, o) {
  return Math.floor(bc * Math.pow(bm, o));
}

// UI update
function upd() {
  var perClickEl = document.getElementById('perClickStat');
  var perSecEl = document.getElementById('perSecStat');
  var clickBtn = document.getElementById('clickBtn');
  var dimEl = document.getElementById('dimStat');
  var dimModal = document.getElementById('dimStatModal');
  var totalBuildingsEl = document.getElementById('totalBuildingsStat');

  if (perClickEl) perClickEl.innerText = fmtNum(getPow());
  if (perSecEl) perSecEl.innerText = fmtNum(perSec);
  if (clickBtn) clickBtn.innerText = fmtNum(score);
  if (dimEl) dimEl.innerText = dim;
  if (dimModal) dimModal.innerText = dim;
  if (totalBuildingsEl) {
    var tb = 0; for (var k in buildings) tb += buildings[k];
    totalBuildingsEl.innerText = tb;
  }

  for (var i = 0; i < bdata.length; i++) {
    var b = bdata[i];
    var o = buildings[b.id] || 0;
    var costEl = document.getElementById('cost-b-' + b.id);
    var ownedEl = document.getElementById('owned-b-' + b.id);
    var btn = document.querySelector('.buy-btn[data-id="' + b.id + '"]');
    if (costEl) costEl.innerText = fmtNum(getc(b.baseCost, b.costMult, o));
    if (ownedEl) ownedEl.innerText = o;
    if (btn) btn.disabled = score < getc(b.baseCost, b.costMult, o);
    var syn = document.getElementById('syn-' + b.id);
    if (syn) {
      var nx = 10 - (o % 10);
      if (nx !== 10 && o > 0) { syn.innerText = nx + " until x2 production"; syn.style.display = 'block'; }
      else syn.style.display = 'none';
    }
  }
  updPrestige();
}

// Unlock check
function isUnlocked(i) {
  if (i === 0) return true;
  var prev = bdata[i - 1];
  return (buildings[prev.id] || 0) >= prev.unlockReq;
}

// Render buildings and attach handlers
function renderb() {
  var c = document.getElementById('buildingsContainer');
  if (!c) return;
  c.innerHTML = '';
  for (var i = 0; i < bdata.length; i++) {
    if (!isUnlocked(i)) continue;
    var b = bdata[i];
    var o = buildings[b.id] || 0;
    var cost = getc(b.baseCost, b.costMult, o);
    var title = b.name + ': ' + b.desc;
    c.innerHTML +=
      '<div class="box" id="box-' + b.id + '" title="' + title + '">' +
        '<div class="box-info">' +
          '<div class="box-icon"><i class="fas ' + b.icon + '"></i></div>' +
          '<div class="box-details"><h3>' + b.name + '</h3><p>' + b.desc + '</p><div class="synergy" id="syn-' + b.id + '" style="display:none;"></div></div>' +
        '</div>' +
        '<div class="box-actions">' +
          '<span class="cost" id="cost-b-' + b.id + '">' + fmtNum(cost) + '</span>' +
          '<button class="buy-btn" data-id="' + b.id + '" data-index="' + i + '">Buy</button>' +
          '<span class="owned-badge" id="owned-b-' + b.id + '">' + o + '</span>' +
        '</div>' +
      '</div>';
  }

  // attach handlers for buy buttons
  var buyBtns = c.querySelectorAll('.buy-btn');
  buyBtns.forEach(function(btn) {
    if (btn._handler) btn.removeEventListener('pointerdown', btn._handler);
    var handler = function(e) {
      e.preventDefault();
      var id = btn.dataset.id;
      var idx = parseInt(btn.dataset.index, 10);
      if (e.shiftKey) {
        buyMax(id, idx);
      } else if (e.ctrlKey || e.metaKey) {
        buyMany(id, idx, 10);
      } else {
        buyb(id, idx, 1);
      }
    };
    btn._handler = handler;
    btn.addEventListener('pointerdown', handler);
  });
}

// Buy functions
function buyb(id, i, count) {
  count = Math.max(1, Math.floor(count || 1));
  var bd = bdata[i];
  var owned = buildings[id] || 0;
  for (var k = 0; k < count; k++) {
    var cost = getc(bd.baseCost, bd.costMult, owned);
    if (score >= cost) {
      score -= cost;
      owned++;
      buildings[id] = owned;
    } else break;
  }
  domath();
  upd();
  save();
  checkachs();
  if (i + 1 < bdata.length) {
    if (!document.getElementById('box-' + bdata[i + 1].id) && isUnlocked(i + 1)) renderb();
  }
}

function buyMany(id, i, count) {
  buyb(id, i, count);
}

function buyMax(id, i) {
  var bd = bdata[i];
  var owned = buildings[id] || 0;
  var bought = 0;
  var safety = 1000000;
  while (safety-- > 0) {
    var cost = getc(bd.baseCost, bd.costMult, owned);
    if (score >= cost) {
      score -= cost;
      owned++;
      bought++;
      buildings[id] = owned;
    } else break;
  }
  if (bought > 0) {
    domath();
    upd();
    save();
    checkachs();
    if (i + 1 < bdata.length) {
      if (!document.getElementById('box-' + bdata[i + 1].id) && isUnlocked(i + 1)) renderb();
    }
  }
}

// Upgrades
function isUpUnlocked(u) {
  if (ups.indexOf(u.id) !== -1) return false;
  if (!u.req) return true;
  if (u.req.type == 'clicks') return totalclicks >= u.req.amount;
  if (u.req.type == 'score') return TotalScore >= u.req.amount;
  if (u.req.type == 'building') return (buildings[u.req.id] || 0) >= u.req.amount;
  return false;
}

function renderu() {
  var c = document.getElementById('upgradesContainer');
  if (!c) return;
  c.innerHTML = '';
  for (var i = 0; i < udata.length; i++) {
    var u = udata[i];
    var un = isUpUnlocked(u);
    var bo = ups.indexOf(u.id) !== -1;
    var cls = 'upgrade-pill';
    if (!un && !bo) cls += ' locked';
    if (bo) cls += ' bought';
    var onclick = (!bo && un) ? ' onclick="buyu(\'' + u.id + '\')"' : '';
    c.innerHTML += '<div class="' + cls + '" title="' + u.name + ': ' + u.desc + '"' + onclick + '><i class="fas ' + u.icon + '"></i><span>' + (bo ? 'Bought' : fmtNum(u.cost)) + '</span></div>';
  }
}

function buyu(id) {
  var u = udata.find(function(x){ return x.id === id; });
  if (!u) return;
  if (ups.indexOf(id) !== -1) return;
  if (score < u.cost) return;
  score -= u.cost;
  ups.push(id);
  domath();
  renderu();
  upd();
  save();
  checkachs();
}

// Prestige
function getPrestigeGain() { if (score < 1000000) return 0; return Math.floor(Math.sqrt(score / 1000000)); }
function updPrestige() {
  var btn = document.getElementById('prestigeBtn');
  var gain = getPrestigeGain();
  if (btn) {
    if (gain > 0) { btn.classList.add('unlocked'); var gEl = document.getElementById('prestigeGain'); if (gEl) gEl.innerText = gain; }
    else btn.classList.remove('unlocked');
  }
}
function calcPermStats() {
  permClickBonus = 0; permGlobalBonus = 0; startBonus = 0;
  for (var i = 0; i < prestigeUps.length; i++) {
    var p = pudata.find(function(x){ return x.id === prestigeUps[i]; });
    if (!p) continue;
    if (p.type == 'click') permClickBonus += p.val;
    if (p.type == 'global') permGlobalBonus += p.val;
    if (p.type == 'start') startBonus += p.val;
  }
  baseClick = 1 + permClickBonus;
  dimMult = 1 + permGlobalBonus;
}
function doPrestige() {
  var gain = getPrestigeGain();
  if (gain <= 0) return;
  if (confirm('Are you sure? You will reset everything but gain ' + gain + ' Diamonds!')) {
    dim += gain;
    score = startBonus;
    TotalScore = 0;
    totalclicks = 0;
    perSec = 0;
    buildings = {};
    ups = [];
    clickMult = 1;
    globalMult = 1;
    bMults = {};
    isFrenzy = false;
    var cb = document.getElementById('clickBtn'); if (cb) cb.classList.remove('frenzy');
    calcPermStats();
    domath();
    renderb();
    renderu();
    upd();
    save();
    checkachs();
    closePrestigeShop();
  }
}

// Prestige modal
function togglePrestigeShop() {
  var shop = document.getElementById('prestigeShopModal'); if (!shop) return;
  if (prestigeShopOpen) { shop.style.display = 'none'; prestigeShopOpen = false; }
  else { renderPrestigeShop(); shop.style.display = 'flex'; prestigeShopOpen = true; }
}
function closePrestigeShop() { var shop = document.getElementById('prestigeShopModal'); if (shop) shop.style.display = 'none'; prestigeShopOpen = false; }
function renderPrestigeShop() {
  var c = document.getElementById('prestigeShopGrid'); if (!c) return;
  c.innerHTML = '';
  for (var i = 0; i < pudata.length; i++) {
    var p = pudata[i];
    var bought = prestigeUps.indexOf(p.id) !== -1;
    var canBuy = !bought && dim >= p.cost;
    var cls = 'p-upgrade-box' + (bought ? ' bought' : (!canBuy ? ' locked' : ''));
    var onclick = (!bought && canBuy) ? ' onclick="buyPrestigeUp(\'' + p.id + '\')"' : '';
    c.innerHTML += '<div class="' + cls + '"' + onclick + '><i class="fas ' + p.icon + '"></i><div><strong>' + p.name + '</strong><br><small>' + p.desc + '</small></div><div class="p-cost"><i class="fas fa-gem"></i> ' + p.cost + '</div></div>';
  }
}
function buyPrestigeUp(id) { var p = pudata.find(function(x){ return x.id === id; }); if (!p) return; if (prestigeUps.indexOf(id) !== -1) return; if (dim < p.cost) return; dim -= p.cost; prestigeUps.push(id); calcPermStats(); domath(); renderPrestigeShop(); upd(); save(); }

// Golden cookie tuned
var goldenMinDelay = 60000;
var goldenMaxDelay = 180000;
var goldenSessionRespawns = 3;
var goldenActiveDuration = 7000;
var goldenRespawnsLeft = 0;
var goldenActiveTimer = null;
var goldenSessionActive = false;
var goldenSchedTimer = null;

function randBetween(min, max) { return Math.random() * (max - min) + min; }
function placeGoldenAtRandom() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  gc.style.right = 'auto';
  gc.style.left = (Math.random() * 78 + 8) + '%';
  gc.style.top = (Math.random() * 68 + 6) + '%';
}
function showGolden() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  placeGoldenAtRandom();
  gc.style.display = 'flex';
  setTimeout(function(){ gc.classList.add('active'); }, 20);
  goldenSessionActive = true;
  if (goldenActiveTimer) clearTimeout(goldenActiveTimer);
  goldenActiveTimer = setTimeout(onGoldenTimeout, goldenActiveDuration);
}
function hideGolden() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  gc.classList.remove('active');
  setTimeout(function(){ gc.style.display = 'none'; }, 160);
  goldenSessionActive = false;
  if (goldenActiveTimer) { clearTimeout(goldenActiveTimer); goldenActiveTimer = null; }
}
function relocateGoldenInstant() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  placeGoldenAtRandom();
  if (goldenActiveTimer) clearTimeout(goldenActiveTimer);
  goldenActiveTimer = setTimeout(onGoldenTimeout, goldenActiveDuration);
}
function onGoldenTimeout() {
  if (goldenRespawnsLeft > 0) { goldenRespawnsLeft--; relocateGoldenInstant(); return; }
  hideGolden();
  schedGold();
}
function startGoldenSession() { goldenRespawnsLeft = goldenSessionRespawns; showGolden(); }
function schedGold() { if (goldenSchedTimer) clearTimeout(goldenSchedTimer); var delay = randBetween(goldenMinDelay, goldenMaxDelay); goldenSchedTimer = setTimeout(startGoldenSession, delay); }

function wireGoldenHandler() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  if (gc._goldenHandlerAttached) return;
  gc._goldenHandlerAttached = true;
  gc.addEventListener('pointerdown', function(e){
    if (!goldenSessionActive) return;
    e.preventDefault();
    if (Math.random() < 0.5) {
      isFrenzy = true;
      var cb = document.getElementById('clickBtn'); if (cb) cb.classList.add('frenzy');
      upd();
      if (frenzyT) clearTimeout(frenzyT);
      frenzyT = setTimeout(function(){ isFrenzy = false; var cb2 = document.getElementById('clickBtn'); if (cb2) cb2.classList.remove('frenzy'); upd(); }, 10000);
      showFloat("FRENZY x777!", true);
    } else {
      var bonus = Math.max(TotalScore * 0.1, 100);
      score += bonus; TotalScore += bonus; upd(); showFloat("+" + fmtNum(bonus) + " Lucky!", true);
    }
    save();
    relocateGoldenInstant();
  });
}

function initGolden() {
  var gc = document.getElementById('goldenCookie'); if (!gc) return;
  gc.style.display = 'none';
  gc.classList.remove('active');
  wireGoldenHandler();
  if (!goldenSchedTimer) schedGold();
}

// Floating text
function showFloat(txt, gold) {
  var f = document.createElement('div'); f.className = 'floating-text' + (gold ? ' gold' : ''); f.innerText = txt;
  var area = document.getElementById('clickArea');
  if (area) {
    f.style.left = (Math.random() * 100 + 20) + 'px';
    f.style.top = (Math.random() * 40 + 40) + 'px';
    area.appendChild(f);
    setTimeout(function(){ f.remove(); }, 1000);
  } else setTimeout(function(){ f.remove(); }, 1000);
}

// Welcome modal
function showWelcomeModal(){ var w = document.getElementById('welcomeModal'); if(!w) return; w.style.display = 'flex'; }
function closeWelcomeModal(setSeen){ var w = document.getElementById('welcomeModal'); if(!w) return; w.style.display = 'none'; if(setSeen){ try{ localStorage.setItem('seenWelcome','1'); }catch(e){} } }
function showWelcomeIfNeeded(){ try{ var seen = localStorage.getItem('seenWelcome'); if(!seen) showWelcomeModal(); }catch(e){} }

// News
function startNews(){
  var t = document.getElementById('newsText');
  var n = news[Math.floor(Math.random()*news.length)];
  if (t) t.innerText = n + "     +++     " + n + "     +++     ";
  setInterval(function(){ var n2 = news[Math.floor(Math.random()*news.length)]; if (t) t.innerText = n2 + "     +++     " + n2 + "     +++     "; }, 30000);
}

// Achievements
function checkachs(){
  var tb = 0; for (var k in buildings) tb += buildings[k];
  for (var i = 0; i < adata.length; i++) {
    var a = adata[i];
    if (achs.indexOf(a.id) !== -1) continue;
    var ok = false;
    if (a.req.type == 'total_clicks' && totalclicks >= a.req.amount) ok = true;
    if (a.req.type == 'score' && TotalScore >= a.req.amount) ok = true;
    if (a.req.type == 'total_buildings' && tb >= a.req.amount) ok = true;
    if (a.req.type == 'specific_building' && (buildings[a.req.id] || 0) >= a.req.amount) ok = true;
    if (a.req.type == 'dim' && dim >= a.req.amount) ok = true;
    if (ok) { achs.push(a.id); showAch(a.name); save(); }
  }
}
function showAch(name){ var p = document.getElementById('achievementPopup'); var t = document.getElementById('achText'); if(!p||!t) return; t.innerText = name; p.classList.add('show'); setTimeout(function(){ p.classList.remove('show'); }, 3000); }

// Save / load / export / import
function save(){
  var data = { s: score, ts: TotalScore, tc: totalclicks, bc: baseClick, b: JSON.stringify(buildings), u: JSON.stringify(ups), a: JSON.stringify(achs), d: dim, pu: JSON.stringify(prestigeUps) };
  try{ localStorage.setItem("save3", JSON.stringify(data)); } catch(e){}
}
function load(){
  var d = null;
  try{ d = localStorage.getItem("save3"); } catch(e){ d = null; }
  if (d) {
    try {
      var p = JSON.parse(d);
      score = p.s || 0;
      TotalScore = p.ts || 0;
      totalclicks = p.tc || 0;
      baseClick = p.bc || 1;
      buildings = p.b ? JSON.parse(p.b) : {};
      ups = p.u ? JSON.parse(p.u) : [];
      achs = p.a ? JSON.parse(p.a) : [];
      dim = p.d || 0;
      prestigeUps = p.pu ? JSON.parse(p.pu) : [];
      calcPermStats();
    } catch(e) {}
  }
}

// Export save to clipboard
function exportSaveToClipboard() {
  try {
    var d = localStorage.getItem("save3");
    if (!d) d = JSON.stringify({});
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(d).then(function(){ alert("Save copied to clipboard."); }, function(){ prompt("Copy this save string:", d); });
    } else {
      prompt("Copy this save string:", d);
    }
  } catch(e) { alert("Export failed: " + e); }
}

// Download save as file
function downloadSaveFile() {
  try {
    var d = localStorage.getItem("save3") || JSON.stringify({});
    var blob = new Blob([d], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'clicker-save.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch(e) { alert("Download failed: " + e); }
}

// Import save from string
function importSaveFromString(str) {
  try {
    var p = typeof str === 'string' ? JSON.parse(str) : str;
    if (!p) throw new Error("Invalid save");
    localStorage.setItem("save3", JSON.stringify(p));
    load();
    domath();
    renderb();
    renderu();
    upd();
    alert("Save imported successfully.");
  } catch(e) {
    alert("Import failed: invalid file or format.");
  }
}

function promptImport() {
  var s = prompt("Paste the save string here and press OK:");
  if (s) importSaveFromString(s);
}

// Upload file input handling
var saveFileInput = document.getElementById('saveFileInput');
if (saveFileInput) {
  saveFileInput.addEventListener('change', function(e) {
    var f = e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var txt = ev.target.result;
      importSaveFromString(txt);
      saveFileInput.value = '';
    };
    reader.readAsText(f);
  });
}

// Reset save
function resetSave() {
  if (!confirm("Reset save? This will clear local progress.")) return;
  try { localStorage.removeItem("save3"); } catch(e){}
  score = 0; TotalScore = 0; totalclicks = 0; buildings = {}; ups = []; achs = []; dim = 0; prestigeUps = [];
  domath(); renderb(); renderu(); upd(); save();
  showFloat("Save reset", false);
}

// Auto-buyer (new): buys the best CPS/cost building automatically
var autoBuyerEnabled = false;
var autoBuyerIntervalMs = 3000;
var autoBuyerTimer = null;

// compute next cost for building index i
function nextCostFor(i) {
  var b = bdata[i];
  var owned = buildings[b.id] || 0;
  return getc(b.baseCost, b.costMult, owned);
}

// compute best-value index (CPS per cost)
function computeBestValueIndex() {
  var bestIdx = null;
  var bestScore = 0;
  for (var i = 0; i < bdata.length; i++) {
    if (!isUnlocked(i)) continue;
    var b = bdata[i];
    var cost = nextCostFor(i);
    if (!isFinite(cost) || cost <= 0) continue;
    var owned = buildings[b.id] || 0;
    var syn = Math.floor((owned + 1) / 10) + 1;
    var sm = bMults[b.id] || 1;
    var effCps = b.baseCps * syn * sm * globalMult * dimMult;
    var value = effCps / cost;
    if (value > bestScore) { bestScore = value; bestIdx = i; }
  }
  return bestIdx;
}

function autoBuyerTick() {
  if (!autoBuyerEnabled) return;
  var idx = computeBestValueIndex();
  if (idx === null || idx === undefined) return;
  var b = bdata[idx];
  buyMax(b.id, idx);
}

function updateAutoBuyerButton() {
  var btn = document.getElementById('autoBuyerBtn');
  if (!btn) return;
  btn.innerText = 'Auto-buyer: ' + (autoBuyerEnabled ? 'ON' : 'OFF');
  btn.style.opacity = autoBuyerEnabled ? '1' : '0.85';
}

function toggleAutoBuyer() {
  autoBuyerEnabled = !autoBuyerEnabled;
  if (autoBuyerEnabled) {
    autoBuyerTimer = setInterval(autoBuyerTick, autoBuyerIntervalMs);
    showFloat("Auto-buyer ON", false);
  } else {
    if (autoBuyerTimer) clearInterval(autoBuyerTimer);
    autoBuyerTimer = null;
    showFloat("Auto-buyer OFF", false);
  }
  try { localStorage.setItem('autoBuyerEnabled', autoBuyerEnabled ? '1' : '0'); } catch(e){}
  updateAutoBuyerButton();
}

// Expose helpers to window
window.exportSaveToClipboard = exportSaveToClipboard;
window.downloadSaveFile = downloadSaveFile;
window.importSaveFromString = importSaveFromString;
window.promptImport = promptImport;
window.toggleAutoBuyer = toggleAutoBuyer;
window.resetSave = resetSave;

// Playtime / stats update
function updateStatsDisplay() {
  var playtimeEl = document.getElementById('playtimeStat');
  if (playtimeEl) {
    var elapsed = Math.floor((Date.now() - sessionStartTs) / 1000);
    playtimeEl.innerText = formatTimeSeconds(elapsed);
  }
  // total buildings already handled in upd()
}

// Main init
window.onload = function() {
  // Welcome modal buttons
  var closeBtn = document.getElementById('welcomeClose');
  var dontShow = document.getElementById('welcomeDontShow');
  if (closeBtn) closeBtn.addEventListener('click', function(){ closeWelcomeModal(true); });
  if (dontShow) dontShow.addEventListener('click', function(){ closeWelcomeModal(true); });

  // Load state
  load();
  domath();
  renderb();
  renderu();
  upd();
  startNews();

  // init golden cookie
  initGolden();

  // set auto-buyer state from storage
  try {
    var ab = localStorage.getItem('autoBuyerEnabled');
    if (ab === '1') { autoBuyerEnabled = true; autoBuyerTimer = setInterval(autoBuyerTick, autoBuyerIntervalMs); }
  } catch(e){}
  updateAutoBuyerButton();

  // autosave every 0.5s
  if (!window._autosaveTimer) {
    window._autosaveTimer = setInterval(function(){ try{ save(); }catch(e){} }, 500);
  }

  // wire main click (pointerdown for touch)
  var clickBtn = document.getElementById('clickBtn');
  if (clickBtn) {
    clickBtn.addEventListener('pointerdown', function(e){
      e.preventDefault();
      var p = getPow();
      score += p;
      TotalScore += p;
      totalclicks++;
      upd();
      save();
      checkachs();
      var f = document.createElement('div');
      f.className = 'floating-text';
      f.innerText = '+' + fmtNum(p);
      var area = document.getElementById('clickArea');
      if (area) {
        var r = area.getBoundingClientRect();
        var left = (e.clientX - r.left - 20);
        var top = (e.clientY - r.top - 20);
        f.style.left = (isNaN(left) ? (r.width/2 - 20) : left) + 'px';
        f.style.top = (isNaN(top) ? (r.height/2 - 20) : top) + 'px';
        area.appendChild(f);
      }
      setTimeout(function(){ f.remove(); }, 1000);
    });
  }

  // Upload input already wired earlier by top-level code (in global scope)

  // show welcome if first time
  showWelcomeIfNeeded();

  // playtime updater
  if (!playtimeTimer) {
    sessionStartTs = Date.now();
    playtimeTimer = setInterval(updateStatsDisplay, 1000);
  }
  updateStatsDisplay();

  // game loop
  var lastTime = performance.now();
  function gameLoop(time) {
    var dt = (time - lastTime) / 1000;
    lastTime = time;
    if (dt > 1) dt = 1;
    if (perSec > 0) {
      var gain = perSec * dt;
      score += gain;
      TotalScore += gain;
      upd();
      checkachs();
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
};
