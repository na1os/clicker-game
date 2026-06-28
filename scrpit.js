let score = 0;
let totalScore = 0;
let totalClicks = 0;
let baseClickPower = 1;
let pointsPerSecond = 0;
let ownedBuildings = {};
let purchasedUpgrades = [];
let unlockedAchievements = [];
let clickMultiplier = 1;
let globalMultiplier = 1;
let buildingMultipliers = {};
let isFrenzyActive = false;
let frenzyTimeout = null;

let diamonds = 0;
let diamondMultiplier = 1;
let permanentClickBonus = 0;
let permanentGlobalBonus = 0;
let startingPointsBonus = 0;
let purchasedPrestigeUpgrades = [];
let isPrestigeShopOpen = false;

let sessionStartTime = Date.now();
let playtimeTimer = null;

const prestigeUpgradesData = [
  { id: "p_click1", name: "Iron Fingers", desc: "+1 click power permanently", icon: "fa-hand-pointer", cost: 3, type: "click", val: 1 },
  { id: "p_click2", name: "Steel Fingers", desc: "+5 click power permanently", icon: "fa-hand-fist", cost: 15, type: "click", val: 5 },
  { id: "p_glob1", name: "Time Dilation", desc: "+10% to all production permanently", icon: "fa-clock", cost: 5, type: "global", val: 0.1 },
  { id: "p_glob2", name: "Space Warping", desc: "+25% to all production permanently", icon: "fa-rocket", cost: 20, type: "global", val: 0.25 },
  { id: "p_glob3", name: "Reality Bending", desc: "+50% to all production permanently", icon: "fa-atom", cost: 50, type: "global", val: 0.5 },
  { id: "p_start", name: "Head Start", desc: "Start with 1000 points after prestige", icon: "fa-play", cost: 2, type: "start", val: 1000 }
];

const buildingsData = [
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

const upgradesData = [
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

const achievementsData = [
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

const newsFeed = [
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

function formatNumber(num) {
  if (num < 1000) return Math.floor(num);
  if (num < 1000000) return (num / 1000).toFixed(1) + "K";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + "T";
  if (num < 1000000000000000000) return (num / 1000000000000000).toFixed(1) + "Qa";
  return (num / 1000000000000000000).toFixed(1) + "Qi";
}

function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
}

function getClickPower() {
  return baseClickPower * clickMultiplier * diamondMultiplier * (isFrenzyActive ? 777 : 1);
}

function updateGameMultipliers() {
  clickMultiplier = 1;
  globalMultiplier = 1;
  buildingMultipliers = {};

  for (let i = 0; i < purchasedUpgrades.length; i++) {
    const upgradeId = purchasedUpgrades[i];
    const upgrade = upgradesData.find(u => u.id === upgradeId);
    if (!upgrade) continue;

    if (upgrade.type === 'click_mult') {
      clickMultiplier *= upgrade.power;
    }
    if (upgrade.type === 'g_mult' || upgrade.type === 'global_mult') {
      globalMultiplier *= upgrade.power;
    }
    if (upgrade.type === 'building_mult' || upgrade.type === 'b_mult') {
      if (!buildingMultipliers[upgrade.target]) {
        buildingMultipliers[upgrade.target] = 1;
      }
      buildingMultipliers[upgrade.target] *= upgrade.power;
    }
  }
  calculatePointsPerSecond();
}

function calculatePointsPerSecond() {
  let totalCps = 0;
  for (let i = 0; i < buildingsData.length; i++) {
    const building = buildingsData[i];
    const amountOwned = ownedBuildings[building.id] || 0;
    if (amountOwned === 0) continue;

    const synergyMultiplier = Math.floor(amountOwned / 10) + 1;
    const specificMultiplier = buildingMultipliers[building.id] || 1;
    totalCps += building.baseCps * amountOwned * synergyMultiplier * specificMultiplier * globalMultiplier * diamondMultiplier;
  }
  pointsPerSecond = totalCps;
}

function calculateBuildingCost(baseCost, multiplier, count) {
  return Math.floor(baseCost * Math.pow(multiplier, count));
}

function updateUI() {
  const perClickEl = document.getElementById('perClickStat');
  const perSecEl = document.getElementById('perSecStat');
  const clickBtn = document.getElementById('clickBtn');
  const dimEl = document.getElementById('dimStat');
  const dimModal = document.getElementById('dimStatModal');
  const totalBuildingsEl = document.getElementById('totalBuildingsStat');

  if (perClickEl) perClickEl.innerText = formatNumber(getClickPower());
  if (perSecEl) perSecEl.innerText = formatNumber(pointsPerSecond);
  if (clickBtn) clickBtn.innerText = formatNumber(score);
  if (dimEl) dimEl.innerText = diamonds;
  if (dimModal) dimModal.innerText = diamonds;

  if (totalBuildingsEl) {
    let count = 0;
    for (const key in ownedBuildings) {
      count += ownedBuildings[key];
    }
    totalBuildingsEl.innerText = count;
  }

  for (let i = 0; i < buildingsData.length; i++) {
    const building = buildingsData[i];
    const amountOwned = ownedBuildings[building.id] || 0;
    const costElement = document.getElementById('cost-b-' + building.id);
    const ownedElement = document.getElementById('owned-b-' + building.id);
    const buyButton = document.querySelector('.buy-btn[data-id="' + building.id + '"]');
    const currentCost = calculateBuildingCost(building.baseCost, building.costMult, amountOwned);

    if (costElement) costElement.innerText = formatNumber(currentCost);
    if (ownedElement) ownedElement.innerText = amountOwned;
    if (buyButton) buyButton.disabled = score < currentCost;

    const synergyElement = document.getElementById('syn-' + building.id);
    if (synergyElement) {
      const nextMilestone = 10 - (amountOwned % 10);
      if (nextMilestone !== 10 && amountOwned > 0) {
        synergyElement.innerText = `${nextMilestone} until x2 production`;
        synergyElement.style.display = 'block';
      } else {
        synergyElement.style.display = 'none';
      }
    }
  }
  updatePrestigeUI();
}

function isBuildingUnlocked(index) {
  if (index === 0) return true;
  const previousBuilding = buildingsData[index - 1];
  return (ownedBuildings[previousBuilding.id] || 0) >= previousBuilding.unlockReq;
}

function renderBuildings() {
  const container = document.getElementById('buildingsContainer');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < buildingsData.length; i++) {
    if (!isBuildingUnlocked(i)) continue;
    const building = buildingsData[i];
    const amountOwned = ownedBuildings[building.id] || 0;
    const cost = calculateBuildingCost(building.baseCost, building.costMult, amountOwned);
    const hoverTitle = `${building.name}: ${building.desc}`;

    container.innerHTML += `
      <div class="box" id="box-${building.id}" title="${hoverTitle}">
        <div class="box-info">
          <div class="box-icon"><i class="fas ${building.icon}"></i></div>
          <div class="box-details">
            <h3>${building.name}</h3>
            <p>${building.desc}</p>
            <div class="synergy" id="syn-${building.id}" style="display:none;"></div>
          </div>
        </div>
        <div class="box-actions">
          <span class="cost" id="cost-b-${building.id}">${formatNumber(cost)}</span>
          <button class="buy-btn" data-id="${building.id}" data-index="${i}">Buy</button>
          <span class="owned-badge" id="owned-b-${building.id}">${amountOwned}</span>
        </div>
      </div>`;
  }

  container.querySelectorAll('.buy-btn').forEach(btn => {
    if (btn._handler) btn.removeEventListener('pointerdown', btn._handler);
    const clickHandler = (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const index = parseInt(btn.dataset.index, 10);
      if (e.shiftKey) {
        buyMaxBuildings(id, index);
      } else if (e.ctrlKey || e.metaKey) {
        buyMultipleBuildings(id, index, 10);
      } else {
        buyBuilding(id, index, 1);
      }
    };
    btn._handler = clickHandler;
    btn.addEventListener('pointerdown', clickHandler);
  });
}

function buyBuilding(id, index, count) {
  count = Math.max(1, Math.floor(count || 1));
  const building = buildingsData[index];
  let amountOwned = ownedBuildings[id] || 0;

  for (let k = 0; k < count; k++) {
    const currentCost = calculateBuildingCost(building.baseCost, building.costMult, amountOwned);
    if (score >= currentCost) {
      score -= currentCost;
      amountOwned++;
      ownedBuildings[id] = amountOwned;
    } else {
      break;
    }
  }

  updateGameMultipliers();
  updateUI();
  saveGame();
  checkAchievements();

  if (index + 1 < buildingsData.length) {
    if (!document.getElementById('box-' + buildingsData[index + 1].id) && isBuildingUnlocked(index + 1)) {
      renderBuildings();
    }
  }
}

function buyMultipleBuildings(id, index, count) {
  buyBuilding(id, index, count);
}

function buyMaxBuildings(id, index) {
  const building = buildingsData[index];
  let amountOwned = ownedBuildings[id] || 0;
  let buildingsBought = 0;
  let safetyLoopBreaker = 1000000;

  while (safetyLoopBreaker-- > 0) {
    const currentCost = calculateBuildingCost(building.baseCost, building.costMult, amountOwned);
    if (score >= currentCost) {
      score -= currentCost;
      amountOwned++;
      buildingsBought++;
      ownedBuildings[id] = amountOwned;
    } else {
      break;
    }
  }

  if (buildingsBought > 0) {
    updateGameMultipliers();
    updateUI();
    saveGame();
    checkAchievements();
    if (index + 1 < buildingsData.length) {
      if (!document.getElementById('box-' + buildingsData[index + 1].id) && isBuildingUnlocked(index + 1)) {
        renderBuildings();
      }
    }
  }
}

function isUpgradeUnlocked(upgrade) {
  if (purchasedUpgrades.indexOf(upgrade.id) !== -1) return false;
  if (!upgrade.req) return true;
  if (upgrade.req.type === 'clicks') return totalClicks >= upgrade.req.amount;
  if (upgrade.req.type === 'score') return totalScore >= upgrade.req.amount;
  if (upgrade.req.type === 'building') return (ownedBuildings[upgrade.req.id] || 0) >= upgrade.req.amount;
  return false;
}

function renderUpgrades() {
  const container = document.getElementById('upgradesContainer');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < upgradesData.length; i++) {
    const upgrade = upgradesData[i];
    const isAvailable = isUpgradeUnlocked(upgrade);
    const isBought = purchasedUpgrades.indexOf(upgrade.id) !== -1;
    let elementClass = 'upgrade-pill';

    if (!isAvailable && !isBought) elementClass += ' locked';
    if (isBought) elementClass += ' bought';

    const clickAction = (!isBought && isAvailable) ? ` onclick="buyUpgrade('${upgrade.id}')"` : '';
    const displayedCost = isBought ? 'Bought' : formatNumber(upgrade.cost);

    container.innerHTML += `
      <div class="${elementClass}" title="${upgrade.name}: ${upgrade.desc}" ${clickAction}>
        <i class="fas ${upgrade.icon}"></i>
        <span>${displayedCost}</span>
      </div>`;
  }
}

function buyUpgrade(id) {
  const upgrade = upgradesData.find(u => u.id === id);
  if (!upgrade || purchasedUpgrades.indexOf(id) !== -1 || score < upgrade.cost) return;

  score -= upgrade.cost;
  purchasedUpgrades.push(id);
  updateGameMultipliers();
  renderUpgrades();
  updateUI();
  saveGame();
  checkAchievements();
}

function calculatePrestigeGain() {
  if (score < 1000000) return 0;
  return Math.floor(Math.sqrt(score / 1000000));
}

function updatePrestigeUI() {
  const prestigeBtn = document.getElementById('prestigeBtn');
  const possibleGain = calculatePrestigeGain();

  if (prestigeBtn) {
    if (possibleGain > 0) {
      prestigeBtn.classList.add('unlocked');
      const gainDisplay = document.getElementById('prestigeGain');
      if (gainDisplay) gainDisplay.innerText = possibleGain;
    } else {
      prestigeBtn.classList.remove('unlocked');
    }
  }
}

function calculatePermanentStats() {
  permanentClickBonus = 0;
  permanentGlobalBonus = 0;
  startingPointsBonus = 0;

  for (let i = 0; i < purchasedPrestigeUpgrades.length; i++) {
    const upgrade = prestigeUpgradesData.find(p => p.id === purchasedPrestigeUpgrades[i]);
    if (!upgrade) continue;
    if (upgrade.type === 'click') permanentClickBonus += upgrade.val;
    if (upgrade.type === 'global') permanentGlobalBonus += upgrade.val;
    if (upgrade.type === 'start') startingPointsBonus += upgrade.val;
  }

  baseClickPower = 1 + permanentClickBonus;
  diamondMultiplier = 1 + permanentGlobalBonus;
}

function triggerPrestige() {
  const possibleGain = calculatePrestigeGain();
  if (possibleGain <= 0) return;

  if (confirm(`Are you sure? You will reset everything but gain ${possibleGain} Diamonds!`)) {
    diamonds += possibleGain;
    score = startingPointsBonus;
    totalScore = 0;
    totalClicks = 0;
    pointsPerSecond = 0;
    ownedBuildings = {};
    purchasedUpgrades = [];
    clickMultiplier = 1;
    globalMultiplier = 1;
    buildingMultipliers = {};
    isFrenzyActive = false;

    const clickButton = document.getElementById('clickBtn');
    if (clickButton) clickButton.classList.remove('frenzy');

    calculatePermanentStats();
    updateGameMultipliers();
    renderBuildings();
    renderUpgrades();
    updateUI();
    saveGame();
    checkAchievements();
    closePrestigeShop();
  }
}

function togglePrestigeShop() {
  const shopModal = document.getElementById('prestigeShopModal');
  if (!shopModal) return;

  if (isPrestigeShopOpen) {
    shopModal.style.display = 'none';
    isPrestigeShopOpen = false;
  } else {
    renderPrestigeShop();
    shopModal.style.display = 'flex';
    isPrestigeShopOpen = true;
  }
}

function closePrestigeShop() {
  const shopModal = document.getElementById('prestigeShopModal');
  if (shopModal) shopModal.style.display = 'none';
  isPrestigeShopOpen = false;
}

function renderPrestigeShop() {
  const container = document.getElementById('prestigeShopGrid');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < prestigeUpgradesData.length; i++) {
    const upgrade = prestigeUpgradesData[i];
    const isBought = purchasedPrestigeUpgrades.indexOf(upgrade.id) !== -1;
    const canAfford = !isBought && diamonds >= upgrade.cost;
    let boxClass = 'p-upgrade-box';

    if (isBought) boxClass += ' bought';
    else if (!canAfford) boxClass += ' locked';

    const clickAction = (!isBought && canAfford) ? ` onclick="buyPrestigeUpgrade('${upgrade.id}')"` : '';

    container.innerHTML += `
      <div class="${boxClass}" ${clickAction}>
        <i class="fas ${upgrade.icon}"></i>
        <div>
          <strong>${upgrade.name}</strong><br>
          <small>${upgrade.desc}</small>
        </div>
        <div class="p-cost"><i class="fas fa-gem"></i> ${upgrade.cost}</div>
      </div>`;
  }
}

function buyPrestigeUpgrade(id) {
  const upgrade = prestigeUpgradesData.find(p => p.id === id);
  if (!upgrade || purchasedPrestigeUpgrades.indexOf(id) !== -1 || diamonds < upgrade.cost) return;

  diamonds -= upgrade.cost;
  purchasedPrestigeUpgrades.push(id);
  calculatePermanentStats();
  updateGameMultipliers();
  renderPrestigeShop();
  updateUI();
  saveGame();
}

const goldenMinDelay = 60000;
const goldenMaxDelay = 180000;
const goldenSessionRespawns = 3;
const goldenActiveDuration = 7000;
let goldenRespawnsLeft = 0;
let goldenActiveTimer = null;
let goldenSessionActive = false;
let goldenSchedTimer = null;

function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function repositionGoldenCookie() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie) return;
  goldenCookie.style.right = 'auto';
  goldenCookie.style.left = (Math.random() * 78 + 8) + '%';
  goldenCookie.style.top = (Math.random() * 68 + 6) + '%';
}

function displayGoldenCookie() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie) return;

  repositionGoldenCookie();
  goldenCookie.style.display = 'flex';
  setTimeout(() => { goldenCookie.classList.add('active'); }, 20);
  goldenSessionActive = true;

  if (goldenActiveTimer) clearTimeout(goldenActiveTimer);
  goldenActiveTimer = setTimeout(handleGoldenCookieTimeout, goldenActiveDuration);
}

function hideGoldenCookie() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie) return;

  goldenCookie.classList.remove('active');
  setTimeout(() => { goldenCookie.style.display = 'none'; }, 160);
  goldenSessionActive = false;

  if (goldenActiveTimer) {
    clearTimeout(goldenActiveTimer);
    goldenActiveTimer = null;
  }
}

function relocateGoldenInstant() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie) return;

  repositionGoldenCookie();
  if (goldenActiveTimer) clearTimeout(goldenActiveTimer);
  goldenActiveTimer = setTimeout(handleGoldenCookieTimeout, goldenActiveDuration);
}

function handleGoldenCookieTimeout() {
  if (goldenRespawnsLeft > 0) {
    goldenRespawnsLeft--;
    relocateGoldenInstant();
    return;
  }
  hideGoldenCookie();
  scheduleGoldenCookie();
}

function startGoldenCookieSession() {
  goldenRespawnsLeft = goldenSessionRespawns;
  displayGoldenCookie();
}

function scheduleGoldenCookie() {
  if (goldenSchedTimer) clearTimeout(goldenSchedTimer);
  const nextDelay = generateRandomNumber(goldenMinDelay, goldenMaxDelay);
  goldenSchedTimer = setTimeout(startGoldenCookieSession, nextDelay);
}

function attachGoldenCookieHandler() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie || goldenCookie._goldenHandlerAttached) return;

  goldenCookie._goldenHandlerAttached = true;
  goldenCookie.addEventListener('pointerdown', (e) => {
    if (!goldenSessionActive) return;
    e.preventDefault();

    if (Math.random() < 0.5) {
      isFrenzyActive = true;
      const clickButton = document.getElementById('clickBtn');
      if (clickButton) clickButton.classList.add('frenzy');
      updateUI();

      if (frenzyTimeout) clearTimeout(frenzyTimeout);
      frenzyTimeout = setTimeout(() => {
        isFrenzyActive = false;
        const btn = document.getElementById('clickBtn');
        if (btn) btn.classList.remove('frenzy');
        updateUI();
      }, 10000);

      createFloatingText("FRENZY x777!", true);
    } else {
      const luckyBonus = Math.max(totalScore * 0.1, 100);
      score += luckyBonus;
      totalScore += luckyBonus;
      updateUI();
      createFloatingText(`+${formatNumber(luckyBonus)} Lucky!`, true);
    }

    saveGame();
    relocateGoldenInstant();
  });
}

function initializeGoldenCookie() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (!goldenCookie) return;

  goldenCookie.style.display = 'none';
  goldenCookie.classList.remove('active');
  attachGoldenCookieHandler();

  if (!goldenSchedTimer) scheduleGoldenCookie();
}

function createFloatingText(text, isGolden) {
  const textElement = document.createElement('div');
  textElement.className = 'floating-text' + (isGolden ? ' gold' : '');
  textElement.innerText = text;

  const clickArea = document.getElementById('clickArea');
  if (clickArea) {
    textElement.style.left = (Math.random() * 100 + 20) + 'px';
    textElement.style.top = (Math.random() * 40 + 40) + 'px';
    clickArea.appendChild(textElement);
    setTimeout(() => { textElement.remove(); }, 1000);
  } else {
    setTimeout(() => { textElement.remove(); }, 1000);
  }
}

function showWelcomeModal() {
  const welcomeModal = document.getElementById('welcomeModal');
  if (welcomeModal) welcomeModal.style.display = 'flex';
}

function closeWelcomeModal(savePreference) {
  const welcomeModal = document.getElementById('welcomeModal');
  if (!welcomeModal) return;
  welcomeModal.style.display = 'none';

  if (savePreference) {
    try {
      localStorage.setItem('seenWelcome', '1');
    } catch (e) { }
  }
}

function verifyWelcomePreference() {
  try {
    const hasSeenWelcome = localStorage.getItem('seenWelcome');
    if (!hasSeenWelcome) showWelcomeModal();
  } catch (e) { }
}

function startNewsTicker() {
  const tickerElement = document.getElementById('newsText');
  if (!tickerElement) return;

  const updateTickerText = () => {
    const randomNews = newsFeed[Math.floor(Math.random() * newsFeed.length)];
    tickerElement.innerText = `${randomNews}     +++     ${randomNews}     +++     `;
  };

  updateTickerText();
  setInterval(updateTickerText, 30000);
}

function checkAchievements() {
  let totalBuildingsCount = 0;
  for (const key in ownedBuildings) {
    totalBuildingsCount += ownedBuildings[key];
  }

  for (let i = 0; i < achievementsData.length; i++) {
    const achievement = achievementsData[i];
    if (unlockedAchievements.indexOf(achievement.id) !== -1) continue;

    let conditionMet = false;
    if (achievement.req.type === 'total_clicks' && totalClicks >= achievement.req.amount) conditionMet = true;
    if (achievement.req.type === 'score' && totalScore >= achievement.req.amount) conditionMet = true;
    if (achievement.req.type === 'total_buildings' && totalBuildingsCount >= achievement.req.amount) conditionMet = true;
    if (achievement.req.type === 'specific_building' && (ownedBuildings[achievement.req.id] || 0) >= achievement.req.amount) conditionMet = true;
    if (achievement.req.type === 'dim' && diamonds >= achievement.req.amount) conditionMet = true;

    if (conditionMet) {
      unlockedAchievements.push(achievement.id);
      triggerAchievementPopup(achievement.name);
      saveGame();
    }
  }
}

function triggerAchievementPopup(name) {
  const popup = document.getElementById('achievementPopup');
  const textContainer = document.getElementById('achText');
  if (!popup || !textContainer) return;

  textContainer.innerText = name;
  popup.classList.add('show');
  setTimeout(() => { popup.classList.remove('show'); }, 3000);
}

function saveGame() {
  const gameState = {
    s: score,
    ts: totalScore,
    tc: totalClicks,
    bc: baseClickPower,
    b: JSON.stringify(ownedBuildings),
    u: JSON.stringify(purchasedUpgrades),
    a: JSON.stringify(unlockedAchievements),
    d: diamonds,
    pu: JSON.stringify(purchasedPrestigeUpgrades)
  };
  try {
    localStorage.setItem("save3", JSON.stringify(gameState));
  } catch (e) { }
}

function loadGame() {
  let savedData = null;
  try {
    savedData = localStorage.getItem("save3");
  } catch (e) {
    savedData = null;
  }

  if (savedData) {
    try {
      const parsedState = JSON.parse(savedData);
      score = parsedState.s || 0;
      totalScore = parsedState.ts || 0;
      totalClicks = parsedState.tc || 0;
      baseClickPower = parsedState.bc || 1;
      ownedBuildings = parsedState.b ? JSON.parse(parsedState.b) : {};
      purchasedUpgrades = parsedState.u ? JSON.parse(parsedState.u) : [];
      unlockedAchievements = parsedState.a ? JSON.parse(parsedState.a) : [];
      diamonds = parsedState.d || 0;
      purchasedPrestigeUpgrades = parsedState.pu ? JSON.parse(parsedState.pu) : [];
      calculatePermanentStats();
    } catch (e) { }
  }
}

function exportSaveToClipboard() {
  try {
    let savedString = localStorage.getItem("save3");
    if (!savedString) savedString = JSON.stringify({});

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(savedString).then(() => {
        alert("Save copied to clipboard.");
      }, () => {
        prompt("Copy this save string:", savedString);
      });
    } else {
      prompt("Copy this save string:", savedString);
    }
  } catch (e) {
    alert("Export failed: " + e);
  }
}

function downloadSaveFile() {
  try {
    const rawData = localStorage.getItem("save3") || JSON.stringify({});
    const blob = new Blob([rawData], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');

    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = 'clicker-save.json';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);
  } catch (e) {
    alert("Download failed: " + e);
  }
}

function importSaveFromString(saveStr) {
  try {
    const parsedData = typeof saveStr === 'string' ? JSON.parse(saveStr) : saveStr;
    if (!parsedData) throw new Error("Invalid save file structure");

    localStorage.setItem("save3", JSON.stringify(parsedData));
    loadGame();
    updateGameMultipliers();
    renderBuildings();
    renderUpgrades();
    updateUI();
    alert("Save imported successfully.");
  } catch (e) {
    alert("Import failed: invalid file or format.");
  }
}

function promptImport() {
  const userInput = prompt("Paste the save string here and press OK:");
  if (userInput) importSaveFromString(userInput);
}

const saveFileInput = document.getElementById('saveFileInput');
if (saveFileInput) {
  saveFileInput.addEventListener('change', (e) => {
    const chosenFile = e.target.files[0];
    if (!chosenFile) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      importSaveFromString(event.target.result);
      saveFileInput.value = '';
    };
    fileReader.readAsText(chosenFile);
  });
}

function resetSave() {
  if (!confirm("Reset save? This will clear local progress.")) return;
  try {
    localStorage.removeItem("save3");
  } catch (e) { }

  score = 0;
  totalScore = 0;
  totalClicks = 0;
  ownedBuildings = {};
  purchasedUpgrades = [];
  unlockedAchievements = [];
  diamonds = 0;
  purchasedPrestigeUpgrades = [];

  updateGameMultipliers();
  renderBuildings();
  renderUpgrades();
  updateUI();
  saveGame();
  createFloatingText("Save reset", false);
}

let autoBuyerEnabled = false;
const autoBuyerIntervalMs = 3000;
let autoBuyerTimer = null;

function fetchNextCostForBuilding(index) {
  const building = buildingsData[index];
  const amountOwned = ownedBuildings[building.id] || 0;
  return calculateBuildingCost(building.baseCost, building.costMult, amountOwned);
}

function computeBestValueIndex() {
  let highestValueIdx = null;
  let bestScoreRatio = 0;

  for (let i = 0; i < buildingsData.length; i++) {
    if (!isBuildingUnlocked(i)) continue;
    const building = buildingsData[i];
    const cost = fetchNextCostForBuilding(i);
    if (!isFinite(cost) || cost <= 0) continue;

    const amountOwned = ownedBuildings[building.id] || 0;
    const synergyMultiplier = Math.floor((amountOwned + 1) / 10) + 1;
    const specificMultiplier = buildingMultipliers[building.id] || 1;
    const efficientCps = building.baseCps * synergyMultiplier * specificMultiplier * globalMultiplier * diamondMultiplier;
    const efficiencyRatio = efficientCps / cost;

    if (efficiencyRatio > bestScoreRatio) {
      bestScoreRatio = efficiencyRatio;
      highestValueIdx = i;
    }
  }
  return highestValueIdx;
}

function runAutoBuyerTick() {
  if (!autoBuyerEnabled) return;
  const bestIndex = computeBestValueIndex();
  if (bestIndex === null || bestIndex === undefined) return;

  const building = buildingsData[bestIndex];
  buyMaxBuildings(building.id, bestIndex);
}

function updateAutoBuyerButtonState() {
  const toggleBtn = document.getElementById('autoBuyerBtn');
  if (!toggleBtn) return;
  toggleBtn.innerText = 'Auto-buyer: ' + (autoBuyerEnabled ? 'ON' : 'OFF');
  toggleBtn.style.opacity = autoBuyerEnabled ? '1' : '0.85';
}

function toggleAutoBuyer() {
  autoBuyerEnabled = !autoBuyerEnabled;

  if (autoBuyerEnabled) {
    autoBuyerTimer = setInterval(runAutoBuyerTick, autoBuyerIntervalMs);
    createFloatingText("Auto-buyer ON", false);
  } else {
    if (autoBuyerTimer) clearInterval(autoBuyerTimer);
    autoBuyerTimer = null;
    createFloatingText("Auto-buyer OFF", false);
  }

  try {
    localStorage.setItem('autoBuyerEnabled', autoBuyerEnabled ? '1' : '0');
  } catch (e) { }
  updateAutoBuyerButtonState();
}

window.exportSaveToClipboard = exportSaveToClipboard;
window.downloadSaveFile = downloadSaveFile;
window.importSaveFromString = importSaveFromString;
window.promptImport = promptImport;
window.toggleAutoBuyer = toggleAutoBuyer;
window.resetSave = resetSave;

function updatePlaytimeDisplay() {
  const playtimeElement = document.getElementById('playtimeStat');
  if (playtimeElement) {
    const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    playtimeElement.innerText = formatTime(elapsedSeconds);
  }
}

window.onload = function () {
  const modalCloseButton = document.getElementById('welcomeClose');
  const modalDismissButton = document.getElementById('welcomeDontShow');

  if (modalCloseButton) modalCloseButton.addEventListener('click', () => { closeWelcomeModal(true); });
  if (modalDismissButton) modalDismissButton.addEventListener('click', () => { closeWelcomeModal(true); });

  loadGame();
  updateGameMultipliers();
  renderBuildings();
  renderUpgrades();
  updateUI();
  startNewsTicker();
  initializeGoldenCookie();

  try {
    const cachedAutoBuyerState = localStorage.getItem('autoBuyerEnabled');
    if (cachedAutoBuyerState === '1') {
      autoBuyerEnabled = true;
      autoBuyerTimer = setInterval(runAutoBuyerTick, autoBuyerIntervalMs);
    }
  } catch (e) { }
  updateAutoBuyerButtonState();

  if (!window._autosaveTimer) {
    window._autosaveTimer = setInterval(() => {
      try { saveGame(); } catch (e) { }
    }, 500);
  }

  const mainClickButton = document.getElementById('clickBtn');
  if (mainClickButton) {
    mainClickButton.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const clickPower = getClickPower();

      score += clickPower;
      totalScore += clickPower;
      totalClicks++;

      updateUI();
      saveGame();
      checkAchievements();

      const floatingTextElement = document.createElement('div');
      floatingTextElement.className = 'floating-text';
      floatingTextElement.innerText = '+' + formatNumber(clickPower);

      const clickArea = document.getElementById('clickArea');
      if (clickArea) {
        const areaBounds = clickArea.getBoundingClientRect();
        const calculatedLeft = (e.clientX - areaBounds.left - 20);
        const calculatedTop = (e.clientY - areaBounds.top - 20);

        floatingTextElement.style.left = (isNaN(calculatedLeft) ? (areaBounds.width / 2 - 20) : calculatedLeft) + 'px';
        floatingTextElement.style.top = (isNaN(calculatedTop) ? (areaBounds.height / 2 - 20) : calculatedTop) + 'px';
        clickArea.appendChild(floatingTextElement);
      }
      setTimeout(() => { floatingTextElement.remove(); }, 1000);
    });
  }

  verifyWelcomePreference();

  if (!playtimeTimer) {
    sessionStartTime = Date.now();
    playtimeTimer = setInterval(updatePlaytimeDisplay, 1000);
  }
  updatePlaytimeDisplay();

  let standardLastTime = performance.now();
  function coreGameLoop(currentTime) {
    let delta = (currentTime - standardLastTime) / 1000;
    standardLastTime = currentTime;

    if (delta > 1) delta = 1;
    if (pointsPerSecond > 0) {
      const generatedPoints = pointsPerSecond * delta;
      score += generatedPoints;
      totalScore += generatedPoints;
      updateUI();
      checkAchievements();
    }
    requestAnimationFrame(coreGameLoop);
  }
  requestAnimationFrame(coreGameLoop);
};
