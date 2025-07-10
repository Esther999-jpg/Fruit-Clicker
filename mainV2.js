// DOM references
const dom = {
    // Fruit & fruit count
    fruit: document.getElementById('fruit'),
    numFruits: document.getElementById('fruitCounter'),
    // Fruit clickers
    numFruitClicker: document.getElementById('fruitClickerCount'),
    clickerCost: document.getElementById('fruitClickerCost'),
    // Glove
    bGloveCost: document.getElementById('bGloveCost'),
    bGloveUpgrade: document.getElementById('bGloveUpgrade'),
    // Workers
    numWorkers: document.getElementById('workerCount'),
    workerCost: document.getElementById('workerCost'),
    // For the save button
    saveButton: document.getElementById('saveButton'),
    closeMessage: document.getElementById('closeMessage'),
    // For deleting game save
    deleteSaveButton: document.getElementById('deleteSaveButton'),
    deleteConfirm: document.getElementById('deleteConfirm'),
    deleteReject: document.getElementById('deleteReject'),
    deleted: document.getElementById('deleted'),
    // For the shop
    shopButton: document.getElementById('shopButton'),
    closeShop: document.getElementById('closeShop'),
    // For the upgrades
    buyFruitClicker: document.getElementById('buyFruitClicker'),
    buyBGloves: document.getElementById('buyBGloves'),
    buyWorkers: document.getElementById('buyWorkers'),
    // For the dropdown
    purchaseAmount: document.getElementById('purchaseAmount')

}

// Base game state
const state = {
    fruitCount: 0,
    fruitClickers: 0,
    clickerCost: 10,
    betterGloves: false,
    bGloveCost: 100,
    workers: 0,
    workerCost: 1000

}

// ------------------------------------------------------------------------------

// For loading
function loadState() {
    state.fruitCount = parseInt(localStorage.getItem('fruitCount')) || 0
    state.fruitClickers = parseInt(localStorage.getItem('fruitClickerCount')) || 0
    state.clickerCost = parseInt(localStorage.getItem('fruitClickerCost')) || 10
    state.betterGloves = localStorage.getItem('betterGloves') === "true"
    state.bGloveCost = parseInt(localStorage.getItem('bGloveCost')) || 100
    state.workers = parseInt(localStorage.getItem('workerCount')) || 0
    state.workerCost = parseInt(localStorage.getItem('workerCost')) || 1000
}

// For saving
function saveState() {
    localStorage.setItem('fruitCount', state.fruitCount)
    localStorage.setItem('fruitClickerCount', state.fruitClickers)
    localStorage.setItem('fruitClickerCost', state.clickerCost)
    localStorage.setItem('betterGloves', state.betterGloves)
    localStorage.setItem('bGloveCost', state.bGloveCost)
    localStorage.setItem('workerCount', state.workers)
    localStorage.setItem('workerCost', state.workerCost)
}

// For updating the UI
function updateUI() {
    dom.numFruits.textContent = formatNumber(state.fruitCount)
    dom.numFruitClicker.textContent = state.fruitClickers
    dom.clickerCost.textContent = state.clickerCost
    dom.bGloveCost.textContent = state.bGloveCost
    dom.bGloveUpgrade.style.display = state.betterGloves ? 'none' : ''
    dom.numWorkers.textContent = state.workers
    dom.workerCost.textContent = state.workerCost

    // Update button text and cost display for both upgrades
    updateUpgradeDisplay('clicker')
    updateUpgradeDisplay('worker')

    updateButtonStates()
}

// New function to update upgrade display
function updateUpgradeDisplay(type) {
    const purchaseAmount = dom.purchaseAmount.value === 'max' ? 
        `Max (${calculateAffordable(type)})` : 
        dom.purchaseAmount.value
    
    let totalCost = 0
    let baseCost = 0
    
    if (type === 'clicker') {
        baseCost = state.clickerCost
        dom.buyFruitClicker.textContent = `Buy ${purchaseAmount}`
    } else if (type === 'worker') {
        baseCost = state.workerCost
        dom.buyWorkers.textContent = `Buy ${purchaseAmount}`
    }
    
    // Calculate total cost for the selected amount
    if (dom.purchaseAmount.value === 'max') {
        const affordable = calculateAffordable(type)
        for (let i = 0; i < affordable; i++) {
            totalCost += Math.floor(baseCost * Math.pow(1.2, i))
        }
    } else {
        const amount = parseInt(dom.purchaseAmount.value)
        for (let i = 0; i < amount; i++) {
            totalCost += Math.floor(baseCost * Math.pow(1.2, i))
        }
    }
    
    // Update the cost display
    if (type === 'clicker') {
        dom.clickerCost.textContent = formatNumber(totalCost)
    } else if (type === 'worker') {
        dom.workerCost.textContent = formatNumber(totalCost)
    }
}

// For resetting the UI
function resetUI() {
    state.fruitCount = 0
    state.fruitClickers = 0
    state.clickerCost = 10
    state.betterGloves = false
    state.bGloveCost = 100
    state.workers = 0
    state.workerCost = 1000
    updateUI()
}

// Just for formatting
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    } else {
        return num
    }
}

// For adding the fruit amount
function addFruit(amount) {
    state.fruitCount += amount
    updateUI()
}

// For buying upgrades
function buyUpgrade(type) {
    const purchaseAmount = parseInt(dom.purchaseAmount.value)
    let amountToBuy = purchaseAmount
    
    // Handle "max" option
    if (dom.purchaseAmount.value === 'max') {
        amountToBuy = calculateAffordable(type)
    }
    
    if (type === 'clicker') {
        // Calculate total cost for multiple purchases
        let totalCost = 0
        for (let i = 0; i < amountToBuy; i++) {
            totalCost += Math.floor(state.clickerCost * Math.pow(1.2, i))
        }
        
        if (state.fruitCount >= totalCost) {
            state.fruitCount -= totalCost
            state.fruitClickers += amountToBuy
            state.clickerCost = Math.floor(state.clickerCost * Math.pow(1.2, amountToBuy))
        }
    } else if (type === 'gloves' && state.fruitCount >= state.bGloveCost && !state.betterGloves) {
        state.fruitCount -= state.bGloveCost
        state.betterGloves = true
    } else if (type === 'worker') {
        // Calculate total cost for multiple purchases
        let totalCost = 0
        for (let i = 0; i < amountToBuy; i++) {
            totalCost += Math.floor(state.workerCost * Math.pow(1.2, i))
        }
        
        if (state.fruitCount >= totalCost) {
            state.fruitCount -= totalCost
            state.workers += amountToBuy
            state.workerCost = Math.floor(state.workerCost * Math.pow(1.2, amountToBuy))
        }
    }
    updateUI()
}

// For calculating the passive income
function passiveIncome() {
    addFruit(state.fruitClickers + state.workers * 10)
}

// For initializing
function init() {
    loadState()
    updateUI()
}

// For showing or hiding the popups
function showPopup(popupId) {
    const popup = document.getElementById(popupId)
    popup.style.display = 'block'

    setTimeout(() => {
        popup.style.opacity = '1'
        popup.style.transform = 'scale(1)'
    }, 10)
}

function hidePopup(popupId) {
    const popup = document.getElementById(popupId)
    popup.style.opacity = '0'
    popup.style.transform = 'scale(0.9)'

    setTimeout(() => {
        popup.style.display = 'none'
    }, 300)
}

// Updating the buttons
function updateButtonStates() {
    // Fruit Clicker button
    const clickerAffordable = calculateAffordable('clicker')
    if (clickerAffordable > 0) {
        dom.buyFruitClicker.disabled = false
        dom.buyFruitClicker.classList.remove('unaffordable')
        dom.buyFruitClicker.classList.add('affordable')
    } else {
        dom.buyFruitClicker.disabled = true
        dom.buyFruitClicker.classList.remove('affordable')
        dom.buyFruitClicker.classList.add('unaffordable')
    }
    
    // Better Gloves button
    if (state.fruitCount >= state.bGloveCost && !state.betterGloves) {
        dom.buyBGloves.disabled = false
        dom.buyBGloves.classList.remove('unaffordable')
        dom.buyBGloves.classList.add('affordable')
    } else {
        dom.buyBGloves.disabled = true
        dom.buyBGloves.classList.remove('affordable')
        dom.buyBGloves.classList.add('unaffordable')
    }
    
    // Workers button
    const workerAffordable = calculateAffordable('worker')
    if (workerAffordable > 0) {
        dom.buyWorkers.disabled = false
        dom.buyWorkers.classList.remove('unaffordable')
        dom.buyWorkers.classList.add('affordable')
    } else {
        dom.buyWorkers.disabled = true
        dom.buyWorkers.classList.remove('affordable')
        dom.buyWorkers.classList.add('unaffordable')
    }
}

// To calculate how much you can afford
function calculateAffordable(type) {
    let cost = 0
    let baseCost = 0
    
    if (type === 'clicker') {
        baseCost = state.clickerCost
    } else if (type === 'worker') {
        baseCost = state.workerCost
    } else {
        return 0 // Gloves are one-time purchase
    }
    
    // Calculate cost for each unit (cost increases by 20% each time)
    let totalCost = 0
    let affordable = 0
    
    for (let i = 0; i < 1000; i++) { // Limit to prevent infinite loop
        let currentCost = Math.floor(baseCost * Math.pow(1.2, i))
        if (totalCost + currentCost <= state.fruitCount) {
            totalCost += currentCost
            affordable++
        } else {
            break
        }
    }
    
    return affordable
}

// ------------------------------------------------------------------------------

// For the fruit
dom.fruit.addEventListener('click', () => {
    addFruit(state.betterGloves ? 10 : 1)
})

// For the save functionality
dom.saveButton.addEventListener('click', () => {
    saveState()
    showPopup('saveMessage')
})

dom.closeMessage.addEventListener('click', () => {
    hidePopup('saveMessage')
})

// For deleting the game save
dom.deleteSaveButton.addEventListener('click', () => {
    showPopup('deleteSaveMessage')
})

dom.deleteConfirm.addEventListener('click', () => {
    localStorage.clear()
    resetUI()
    hidePopup('deleteSaveMessage')
    showPopup('deleteConfirmed')
})

dom.deleteReject.addEventListener('click', () => {
    hidePopup('deleteSaveMessage')
})

dom.deleted.addEventListener('click', () => {
    hidePopup('deleteConfirmed')
})

// For the shop functionality
dom.shopButton.addEventListener('click', () => {
    showPopup('shopSection')
})

dom.closeShop.addEventListener('click', () => {
    hidePopup('shopSection')
})

// ------------------------------------------------------------------------------

// For the upgrades
dom.buyFruitClicker.addEventListener('click', () => buyUpgrade('clicker'))
dom.buyBGloves.addEventListener('click', () => buyUpgrade('gloves'))
dom.buyWorkers.addEventListener('click', () => buyUpgrade('worker'))

// Update display when dropdown changes
dom.purchaseAmount.addEventListener('change', () => {
    updateUI()
})

// For passive income
setInterval(passiveIncome, 1000)

// For the auto-save
setInterval(saveState, 30000)

// Initializing the game
init()