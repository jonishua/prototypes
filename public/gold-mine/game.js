// Game State
const gameState = {
    currencies: {
        coins: 0,
        tickets: 0,
        gems: 0,
        credits: 0,
        inkCash: 0
    },
    tapPower: 1,
    critChance: 0.05,
    vault: {
        currentStored: 0,
        maxCapacity: 100,
        level: 1
    },
    pickaxes: [
        { name: 'Wooden Pickaxe', power: 1, cost: { coins: 0 }, owned: true },
        { name: 'Stone Pickaxe', power: 2, cost: { coins: 100 }, owned: false },
        { name: 'Iron Pickaxe', power: 3, cost: { coins: 250 }, owned: false },
        { name: 'Gold Pickaxe', power: 5, cost: { coins: 500, gems: 1 }, owned: false },
        { name: 'Diamond Pickaxe', power: 10, cost: { coins: 1000, gems: 3 }, owned: false, critChance: 0.10 }
    ],
    currentPickaxe: 0,
    miners: [
        { name: 'Basic Bob', coinsPerSecond: 1, cost: { coins: 100 }, owned: false, level: 1 },
        { name: 'Ticket Tina', coinsPerSecond: 0.8, ticketBonus: 0.0025, cost: { coins: 200, tickets: 1 }, owned: false, level: 1 },
        { name: 'Gemmy Joe', coinsPerSecond: 0.5, gemBonus: 0.001, cost: { coins: 250, gems: 1 }, owned: false, level: 1 },
        { name: 'Credit Clara', coinsPerSecond: 0.3, creditBonus: 0.0025, cost: { credits: 1 }, owned: false, level: 1 }
    ],
    lastDailyReset: null,
    lastSave: Date.now()
};

// Drop Rates
const dropRates = {
    coins: 1.0,
    tickets: 0.1,
    gems: 0.015,
    credits: 0.005,
    inkCash: 0.0001
};

// Initialize Game
function initGame() {
    loadGame();
    checkDailyReset();
    setupUI();
    startGameLoop();
    // Render shop initially
    switchShopTab('pickaxes');
    updateDisplay();
}

// Setup UI Event Listeners
function setupUI() {
    // Mine tap
    const mine = document.getElementById('mine');
    mine.addEventListener('click', handleTap);

    // Vault collect
    document.getElementById('collectVault').addEventListener('click', collectVault);
    
    // Vault upgrade
    document.getElementById('upgradeVault').addEventListener('click', upgradeVault);

    // Shop tabs
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => switchShopTab(tab.dataset.tab));
    });
    
    // Shop content event delegation (more reliable than individual listeners)
    const shopContent = document.getElementById('shopContent');
    shopContent.addEventListener('click', (e) => {
        const button = e.target.closest('.shop-item-btn');
        if (!button) return;
        
        const pickaxeIndex = button.getAttribute('data-pickaxe-index');
        const minerIndex = button.getAttribute('data-miner-index');
        const minerAction = button.getAttribute('data-miner-action');
        
        if (pickaxeIndex !== null && !button.disabled) {
            const index = parseInt(pickaxeIndex);
            const pickaxe = gameState.pickaxes[index];
            if (!pickaxe.owned && canAfford(pickaxe.cost)) {
                purchasePickaxe(index);
            }
        } else if (minerIndex !== null && !button.disabled) {
            const index = parseInt(minerIndex);
            if (minerAction === 'upgrade') {
                upgradeMiner(index);
            } else {
                unlockMiner(index);
            }
        }
    });
}

// Tapping System
function handleTap() {
    const pickaxe = gameState.pickaxes[gameState.currentPickaxe];
    let amount = pickaxe.power * gameState.tapPower;
    
    // Check for crit
    const isCrit = Math.random() < (pickaxe.critChance || gameState.critChance);
    if (isCrit) {
        amount *= 2;
        showNotification('CRIT!', 'crit');
    }
    
    // Add coins
    addCurrency('coins', amount);
    
    // Check for drops
    checkDrops(isCrit);
    
    // Show visual feedback
    showTapFeedback(amount, isCrit);
    
    // Update display
    updateDisplay();
    saveGame();
}

function checkDrops(isCrit) {
    const multiplier = isCrit ? 2 : 1;
    const pickaxe = gameState.pickaxes[gameState.currentPickaxe];
    
    // Get active miners bonuses
    let ticketBonus = 0;
    let gemBonus = 0;
    let creditBonus = 0;
    
    gameState.miners.forEach(miner => {
        if (miner.owned) {
            ticketBonus += (miner.ticketBonus || 0) * miner.level;
            gemBonus += (miner.gemBonus || 0) * miner.level;
            creditBonus += (miner.creditBonus || 0) * miner.level;
        }
    });
    
    // Check Tickets
    if (Math.random() < (dropRates.tickets + ticketBonus)) {
        addCurrency('tickets', 1 * multiplier);
        showNotification(`+${1 * multiplier} Ticket${multiplier > 1 ? 's' : ''}!`, 'rare');
    }
    
    // Check Gems
    if (Math.random() < (dropRates.gems + gemBonus)) {
        addCurrency('gems', 1 * multiplier);
        showNotification(`+${1 * multiplier} Gem${multiplier > 1 ? 's' : ''}!`, 'rare');
    }
    
    // Check Credits
    if (Math.random() < (dropRates.credits + creditBonus)) {
        addCurrency('credits', 1 * multiplier);
        showNotification(`+${1 * multiplier} Credit${multiplier > 1 ? 's' : ''}!`, 'rare');
    }
    
    // Check INK Cash
    if (Math.random() < dropRates.inkCash) {
        addCurrency('inkCash', 0.10 * multiplier);
        showNotification(`+$${(0.10 * multiplier).toFixed(2)} INK Cash!`, 'rare');
    }
}

function showTapFeedback(amount, isCrit) {
    const feedback = document.getElementById('tapFeedback');
    feedback.textContent = `+${Math.floor(amount)}`;
    feedback.style.color = isCrit ? '#e74c3c' : '#f39c12';
    feedback.style.animation = 'none';
    setTimeout(() => {
        feedback.style.animation = 'floatUp 1s ease-out forwards';
    }, 10);
}

// Currency Management
function addCurrency(type, amount) {
    if (type === 'inkCash') {
        gameState.currencies.inkCash += amount;
    } else {
        gameState.currencies[type] += amount;
    }
}

function canAfford(cost) {
    for (const [currency, amount] of Object.entries(cost)) {
        if (currency === 'inkCash') {
            if (gameState.currencies.inkCash < amount) return false;
        } else {
            if (gameState.currencies[currency] < amount) return false;
        }
    }
    return true;
}

function spendCurrency(cost) {
    for (const [currency, amount] of Object.entries(cost)) {
        if (currency === 'inkCash') {
            gameState.currencies.inkCash -= amount;
        } else {
            gameState.currencies[currency] -= amount;
        }
    }
}

// Miner System
function startGameLoop() {
    setInterval(() => {
        updateMiners();
        updateVault();
        updateDisplay();
    }, 100); // Update every 100ms for smooth animation
}

function updateMiners() {
    gameState.miners.forEach(miner => {
        if (miner.owned && gameState.vault.currentStored < gameState.vault.maxCapacity) {
            const coinsPerSecond = miner.coinsPerSecond * (1 + (miner.level - 1) * 0.25);
            const coinsToAdd = coinsPerSecond * 0.1; // 100ms interval
            const newAmount = gameState.vault.currentStored + coinsToAdd;
            gameState.vault.currentStored = Math.min(newAmount, gameState.vault.maxCapacity);
        }
    });
}

function unlockMiner(minerIndex) {
    const miner = gameState.miners[minerIndex];
    if (miner.owned) return;
    
    if (canAfford(miner.cost)) {
        spendCurrency(miner.cost);
        miner.owned = true;
        showNotification(`Unlocked ${miner.name}!`, 'success');
        // Force full re-render after purchase
        const activeTab = document.querySelector('.shop-tab.active');
        if (activeTab && activeTab.dataset.tab === 'miners') {
            renderShop('miners');
        }
        updateMineMiners(); // Update mine scene
        updateDisplay();
        saveGame();
    }
}

function upgradeMiner(minerIndex) {
    const miner = gameState.miners[minerIndex];
    if (!miner.owned) return;
    
    const upgradeCost = calculateUpgradeCost(minerIndex);
    if (canAfford(upgradeCost)) {
        spendCurrency(upgradeCost);
        miner.level++;
        showNotification(`${miner.name} upgraded to level ${miner.level}!`, 'success');
        // Force full re-render after upgrade
        const activeTab = document.querySelector('.shop-tab.active');
        if (activeTab && activeTab.dataset.tab === 'miners') {
            renderShop('miners');
        }
        updateDisplay();
        saveGame();
    }
}

function calculateUpgradeCost(minerIndex) {
    const miner = gameState.miners[minerIndex];
    const baseCost = {};
    
    if (miner.name === 'Basic Bob') {
        baseCost.coins = 50 * miner.level;
    } else if (miner.name === 'Ticket Tina') {
        baseCost.coins = 100 * miner.level;
        baseCost.tickets = 1;
    } else if (miner.name === 'Gemmy Joe') {
        baseCost.coins = 150 * miner.level;
        baseCost.gems = 1;
    } else if (miner.name === 'Credit Clara') {
        baseCost.credits = 1;
    }
    
    return baseCost;
}

// Vault System
function updateVault() {
    const vaultBar = document.getElementById('vaultBar');
    const vaultFull = document.getElementById('vaultFull');
    const vaultAmount = document.getElementById('vaultAmount');
    const collectBtn = document.getElementById('collectVault');
    const upgradeBtn = document.getElementById('upgradeVault');
    
    const percentage = (gameState.vault.currentStored / gameState.vault.maxCapacity) * 100;
    vaultBar.style.width = percentage + '%';
    vaultAmount.textContent = Math.floor(gameState.vault.currentStored);
    
    // Ensure vault.level exists
    if (!gameState.vault.level) {
        gameState.vault.level = 1;
    }
    
    // Update vault level and capacity display
    document.getElementById('vaultLevel').textContent = gameState.vault.level;
    document.getElementById('vaultCapacity').textContent = gameState.vault.maxCapacity;
    
    // Update upgrade cost
    const upgradeCost = getVaultUpgradeCost();
    if (isNaN(upgradeCost)) {
        console.error('Upgrade cost is NaN. Vault level:', gameState.vault.level);
        document.getElementById('vaultUpgradeCost').textContent = '100 🪙';
    } else {
        document.getElementById('vaultUpgradeCost').textContent = `${upgradeCost} 🪙`;
    }
    
    // Update upgrade button state
    if (isNaN(upgradeCost)) {
        upgradeBtn.disabled = true;
    } else {
        const canAffordUpgrade = canAfford({ coins: upgradeCost });
        upgradeBtn.disabled = !canAffordUpgrade;
    }
    
    if (gameState.vault.currentStored >= gameState.vault.maxCapacity) {
        vaultFull.classList.add('show');
        collectBtn.disabled = false;
    } else {
        vaultFull.classList.remove('show');
        collectBtn.disabled = gameState.vault.currentStored === 0;
    }
    
    // Calculate time to full
    const totalCoinsPerSecond = gameState.miners
        .filter(m => m.owned)
        .reduce((sum, m) => sum + (m.coinsPerSecond * (1 + (m.level - 1) * 0.25)), 0);
    
    if (totalCoinsPerSecond > 0) {
        const remaining = gameState.vault.maxCapacity - gameState.vault.currentStored;
        const timeToFull = remaining / totalCoinsPerSecond;
        const minutes = Math.floor(timeToFull / 60);
        const seconds = Math.floor(timeToFull % 60);
        document.getElementById('timeToFull').textContent = 
            minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    } else {
        document.getElementById('timeToFull').textContent = '--';
    }
}

function collectVault() {
    if (gameState.vault.currentStored > 0) {
        const collected = Math.floor(gameState.vault.currentStored);
        addCurrency('coins', collected);
        gameState.vault.currentStored = 0;
        showNotification(`Collected ${collected} coins!`, 'success');
        updateDisplay();
        saveGame();
    }
}

function getVaultUpgradeCost() {
    // Ensure level exists (for backward compatibility)
    const level = gameState.vault.level || 1;
    // Exponential scaling: base cost * (1.5 ^ level)
    const baseCost = 100;
    return Math.floor(baseCost * Math.pow(1.5, level - 1));
}

function upgradeVault() {
    const cost = getVaultUpgradeCost();
    if (canAfford({ coins: cost })) {
        spendCurrency({ coins: cost });
        gameState.vault.level++;
        // Increase capacity by 50% per level (rounded)
        const capacityIncrease = Math.floor(gameState.vault.maxCapacity * 0.5);
        gameState.vault.maxCapacity += capacityIncrease;
        showNotification(`Vault upgraded to level ${gameState.vault.level}! Capacity: ${gameState.vault.maxCapacity}`, 'success');
        updateDisplay();
        saveGame();
    }
}

// Shop System
function switchShopTab(tab) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    renderShop(tab);
}

function renderShop(tab) {
    const shopContent = document.getElementById('shopContent');
    shopContent.innerHTML = '';
    
    if (tab === 'pickaxes') {
        gameState.pickaxes.forEach((pickaxe, index) => {
            const item = createPickaxeItem(pickaxe, index);
            shopContent.appendChild(item);
        });
    } else if (tab === 'miners') {
        gameState.miners.forEach((miner, index) => {
            const item = createMinerItem(miner, index);
            shopContent.appendChild(item);
        });
    }
    
    // Reset currency tracking after render
    lastCurrencyUpdate = {
        coins: Math.floor(gameState.currencies.coins),
        tickets: gameState.currencies.tickets,
        gems: gameState.currencies.gems,
        credits: gameState.currencies.credits,
        inkCash: gameState.currencies.inkCash
    };
    shopUpdateThrottle = 0;
}

function updateShopButtonStates() {
    const shopContent = document.getElementById('shopContent');
    if (!shopContent || shopContent.innerHTML === '') return;
    
    const activeTab = document.querySelector('.shop-tab.active');
    if (!activeTab) return;
    
    const tab = activeTab.dataset.tab;
    
    if (tab === 'pickaxes') {
        gameState.pickaxes.forEach((pickaxe, index) => {
            const button = shopContent.querySelector(`[data-pickaxe-index="${index}"]`);
            if (button) {
                const canAff = canAfford(pickaxe.cost);
                button.disabled = pickaxe.owned || !canAff;
                
                // Update cost badges
                const costContainer = button.closest('.shop-item').querySelector('.shop-item-cost');
                if (costContainer) {
                    costContainer.innerHTML = Object.entries(pickaxe.cost)
                        .map(([currency, amount]) => {
                            return `<span class="cost-badge ${!canAff ? 'insufficient' : ''}">${formatCurrency(currency, amount)}</span>`;
                        })
                        .join('');
                }
            }
        });
    } else if (tab === 'miners') {
        gameState.miners.forEach((miner, index) => {
            const button = shopContent.querySelector(`[data-miner-index="${index}"]`);
            if (button) {
                const cost = miner.owned ? calculateUpgradeCost(index) : miner.cost;
                const canAff = canAfford(cost);
                button.disabled = !canAff;
                
                // Update cost badges
                const costContainer = button.closest('.shop-item').querySelector('.shop-item-cost');
                if (costContainer) {
                    costContainer.innerHTML = Object.entries(cost)
                        .map(([currency, amount]) => {
                            return `<span class="cost-badge ${!canAff ? 'insufficient' : ''}">${formatCurrency(currency, amount)}</span>`;
                        })
                        .join('');
                }
                
                // Update output display if miner is owned
                if (miner.owned) {
                    const output = miner.coinsPerSecond * (1 + (miner.level - 1) * 0.25);
                    const statsContainer = button.closest('.shop-item').querySelector('.shop-item-stats');
                    if (statsContainer) {
                        const bonusText = miner.ticketBonus ? `+${(miner.ticketBonus * miner.level * 100).toFixed(2)}% ticket drop` :
                                         miner.gemBonus ? `+${(miner.gemBonus * miner.level * 100).toFixed(2)}% gem drop` :
                                         miner.creditBonus ? `+${(miner.creditBonus * miner.level * 100).toFixed(2)}% credit drop` : '';
                        statsContainer.innerHTML = `
                            Output: ${output.toFixed(2)} coins/sec<br>
                            Level: ${miner.level}<br>
                            ${bonusText}
                        `;
                    }
                }
            }
        });
    }
}

function createPickaxeItem(pickaxe, index) {
    const item = document.createElement('div');
    item.className = `shop-item ${pickaxe.owned ? 'owned' : ''}`;
    
    const costHTML = Object.entries(pickaxe.cost)
        .map(([currency, amount]) => {
            const canAff = canAfford(pickaxe.cost);
            return `<span class="cost-badge ${!canAff ? 'insufficient' : ''}">${formatCurrency(currency, amount)}</span>`;
        })
        .join('');
    
    item.innerHTML = `
        <div class="shop-item-header">
            <div class="shop-item-name">${pickaxe.name}</div>
            <div class="shop-item-icon">⛏️</div>
        </div>
        <div class="shop-item-stats">
            Power: ${pickaxe.power}×<br>
            ${pickaxe.critChance ? `Crit Chance: ${(pickaxe.critChance * 100).toFixed(0)}%` : ''}
        </div>
        <div class="shop-item-cost">${costHTML}</div>
        <button class="shop-item-btn ${pickaxe.owned ? 'owned' : ''}" 
                data-pickaxe-index="${index}"
                ${pickaxe.owned ? 'disabled' : !canAfford(pickaxe.cost) ? 'disabled' : ''}>
            ${pickaxe.owned ? 'Owned' : 'Purchase'}
        </button>
    `;
    
    return item;
}

function createMinerItem(miner, index) {
    const item = document.createElement('div');
    item.className = `shop-item ${miner.owned ? 'owned' : ''}`;
    
    const output = miner.coinsPerSecond * (1 + (miner.level - 1) * 0.25);
    const bonusText = miner.ticketBonus ? `+${(miner.ticketBonus * miner.level * 100).toFixed(2)}% ticket drop` :
                     miner.gemBonus ? `+${(miner.gemBonus * miner.level * 100).toFixed(2)}% gem drop` :
                     miner.creditBonus ? `+${(miner.creditBonus * miner.level * 100).toFixed(2)}% credit drop` : '';
    
    let costHTML = '';
    if (miner.owned) {
        const upgradeCost = calculateUpgradeCost(index);
        costHTML = Object.entries(upgradeCost)
            .map(([currency, amount]) => {
                const canAff = canAfford(upgradeCost);
                return `<span class="cost-badge ${!canAff ? 'insufficient' : ''}">${formatCurrency(currency, amount)}</span>`;
            })
            .join('');
    } else {
        costHTML = Object.entries(miner.cost)
            .map(([currency, amount]) => {
                const canAff = canAfford(miner.cost);
                return `<span class="cost-badge ${!canAff ? 'insufficient' : ''}">${formatCurrency(currency, amount)}</span>`;
            })
            .join('');
    }
    
    item.innerHTML = `
        <div class="shop-item-header">
            <div class="shop-item-name">${miner.name}</div>
            <div class="shop-item-icon">👷</div>
        </div>
        <div class="shop-item-stats">
            Output: ${output.toFixed(2)} coins/sec<br>
            Level: ${miner.level}<br>
            ${bonusText}
        </div>
        <div class="shop-item-cost">${costHTML}</div>
        <button class="shop-item-btn ${miner.owned ? 'owned' : ''}" 
                data-miner-index="${index}"
                data-miner-action="${miner.owned ? 'upgrade' : 'unlock'}"
                ${!canAfford(miner.owned ? calculateUpgradeCost(index) : miner.cost) ? 'disabled' : ''}>
            ${miner.owned ? `Upgrade (Lv ${miner.level + 1})` : 'Unlock'}
        </button>
    `;
    
    return item;
}

function purchasePickaxe(index) {
    const pickaxe = gameState.pickaxes[index];
    if (pickaxe.owned) return;
    
    if (canAfford(pickaxe.cost)) {
        spendCurrency(pickaxe.cost);
        pickaxe.owned = true;
        gameState.currentPickaxe = index;
        gameState.tapPower = pickaxe.power;
        if (pickaxe.critChance) {
            gameState.critChance = pickaxe.critChance;
        }
        showNotification(`Equipped ${pickaxe.name}!`, 'success');
        // Force full re-render after purchase
        const activeTab = document.querySelector('.shop-tab.active');
        if (activeTab && activeTab.dataset.tab === 'pickaxes') {
            renderShop('pickaxes');
        }
        updateDisplay();
        saveGame();
    }
}

// Track previous currency values to only update shop when needed
let lastCurrencyUpdate = {
    coins: -1,
    tickets: -1,
    gems: -1,
    credits: -1,
    inkCash: -1
};
let shopUpdateThrottle = 0;

// Display Updates
function updateDisplay() {
    // Update currency displays
    document.getElementById('coins').textContent = Math.floor(gameState.currencies.coins);
    document.getElementById('tickets').textContent = gameState.currencies.tickets;
    document.getElementById('gems').textContent = gameState.currencies.gems;
    document.getElementById('credits').textContent = gameState.currencies.credits;
    document.getElementById('inkCash').textContent = '$' + gameState.currencies.inkCash.toFixed(2);
    
    // Update tap stats
    const pickaxe = gameState.pickaxes[gameState.currentPickaxe];
    document.getElementById('tapPower').textContent = pickaxe.power;
    document.getElementById('critChance').textContent = ((pickaxe.critChance || gameState.critChance) * 100).toFixed(0) + '%';
    
    // Vault capacity is updated in updateVault() function
    
    // Update miners list
    updateMinersList();
    
    // Update miners working animation
    updateMineMiners();
    
    // Update shop button states (throttled to avoid flashing)
    shopUpdateThrottle++;
    const currencyChanged = 
        Math.floor(gameState.currencies.coins) !== lastCurrencyUpdate.coins ||
        gameState.currencies.tickets !== lastCurrencyUpdate.tickets ||
        gameState.currencies.gems !== lastCurrencyUpdate.gems ||
        gameState.currencies.credits !== lastCurrencyUpdate.credits ||
        Math.abs(gameState.currencies.inkCash - lastCurrencyUpdate.inkCash) > 0.01;
    
    // Only update shop if currency changed or every 10 updates (1 second)
    if (currencyChanged || shopUpdateThrottle >= 10) {
        updateShopButtonStates();
        lastCurrencyUpdate = {
            coins: Math.floor(gameState.currencies.coins),
            tickets: gameState.currencies.tickets,
            gems: gameState.currencies.gems,
            credits: gameState.currencies.credits,
            inkCash: gameState.currencies.inkCash
        };
        shopUpdateThrottle = 0;
    }
}

function updateMineMiners() {
    const minersWorking = document.getElementById('minersWorking');
    if (!minersWorking) return; // Safety check
    
    minersWorking.innerHTML = '';
    
    // Miner sprite classes and positions
    const minerClasses = ['basic-bob', 'ticket-tina', 'gemmy-joe', 'credit-clara'];
    const minerIcons = ['👷', '👷‍♀️', '👷', '👷‍♀️'];
    
    let activeMiners = 0;
    gameState.miners.forEach((miner, index) => {
        if (miner.owned) {
            activeMiners++;
            const minerSprite = document.createElement('div');
            minerSprite.className = `miner-sprite ${minerClasses[index]}`;
            minerSprite.textContent = minerIcons[index];
            minerSprite.setAttribute('data-miner', miner.name);
            minersWorking.appendChild(minerSprite);
        }
    });
    
    // Debug: Log if miners should be visible
    if (activeMiners === 0) {
        console.log('No miners are currently owned. Unlock miners to see them work!');
    }
}

function updateMinersList() {
    const minersList = document.getElementById('minersList');
    minersList.innerHTML = '';
    
    gameState.miners.forEach((miner, index) => {
        const card = document.createElement('div');
        card.className = `miner-card ${miner.owned ? 'active' : 'inactive'}`;
        
        const output = miner.coinsPerSecond * (1 + (miner.level - 1) * 0.25);
        const bonusText = miner.ticketBonus ? `+${(miner.ticketBonus * miner.level * 100).toFixed(2)}% ticket` :
                         miner.gemBonus ? `+${(miner.gemBonus * miner.level * 100).toFixed(2)}% gem` :
                         miner.creditBonus ? `+${(miner.creditBonus * miner.level * 100).toFixed(2)}% credit` : '';
        
        card.innerHTML = `
            <div class="miner-header">
                <div class="miner-name">${miner.name}</div>
                <div class="miner-status ${miner.owned ? '' : 'inactive'}">${miner.owned ? 'Active' : 'Locked'}</div>
            </div>
            <div class="miner-stats">
                ${output.toFixed(2)} coins/sec<br>
                Level ${miner.level}<br>
                ${bonusText}
            </div>
            <div class="miner-actions">
                ${!miner.owned ? 
                    `<button class="miner-btn unlock" onclick="unlockMiner(${index})" ${!canAfford(miner.cost) ? 'disabled' : ''}>Unlock</button>` :
                    `<button class="miner-btn upgrade" onclick="upgradeMiner(${index})" ${!canAfford(calculateUpgradeCost(index)) ? 'disabled' : ''}>Upgrade (Lv ${miner.level + 1})</button>`
                }
            </div>
        `;
        minersList.appendChild(card);
    });
}

// Notifications
function showNotification(message, type = '') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Daily Reset
function checkDailyReset() {
    const now = new Date();
    const nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const todayUTC = nowUTC.getTime();
    
    if (!gameState.lastDailyReset) {
        gameState.lastDailyReset = todayUTC;
        return;
    }
    
    const lastResetUTC = new Date(gameState.lastDailyReset);
    const lastResetDate = new Date(lastResetUTC.getUTCFullYear(), lastResetUTC.getUTCMonth(), lastResetUTC.getUTCDate());
    
    if (todayUTC > lastResetDate.getTime()) {
        performDailyReset();
        gameState.lastDailyReset = todayUTC;
    }
}

function performDailyReset() {
    // Reset tap power
    gameState.tapPower = 1;
    gameState.currentPickaxe = 0;
    
    // Deactivate all miners
    gameState.miners.forEach(miner => {
        miner.owned = false;
        miner.level = 1;
    });
    
    // Reset vault storage (but keep level and capacity)
    gameState.vault.currentStored = 0;
    
    // Reset pickaxes (keep first one)
    gameState.pickaxes.forEach((pickaxe, index) => {
        pickaxe.owned = index === 0;
    });
    
    showNotification('Daily Reset! Your progress has been reset.', 'success');
    updateDisplay();
    saveGame();
}

// Save/Load
function saveGame() {
    const saveData = {
        ...gameState,
        lastSave: Date.now()
    };
    localStorage.setItem('pppMiningGame', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('pppMiningGame');
    if (saved) {
        const savedData = JSON.parse(saved);
        Object.assign(gameState, savedData);
        
        // Ensure vault.level exists (for backward compatibility with old saves)
        if (!gameState.vault.level) {
            gameState.vault.level = 1;
        }
        
        // Check if daily reset is needed
        checkDailyReset();
    }
}

// Utility
function formatCurrency(type, amount) {
    const icons = {
        coins: '🪙',
        tickets: '🎟',
        gems: '💎',
        credits: '🎮',
        inkCash: '💵'
    };
    
    if (type === 'inkCash') {
        return `${icons[type]} $${amount.toFixed(2)}`;
    }
    return `${icons[type]} ${Math.floor(amount)}`;
}

// Initialize on load
window.addEventListener('load', initGame);

