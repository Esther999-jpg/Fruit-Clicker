// The strawberry
const strawberry = document.getElementById('strawberry')

// The base variables
let numFruits = document.getElementById('fruitCounter')
let numFruitClicker = document.getElementById('fruitClickerCount')
let clickerCost = document.getElementById('fruitClickerCost')

// The saved amounts
let savedCount = localStorage.getItem('fruitCount')
let savedFruitClickers = localStorage.getItem('fruitClickerCount')
let savedClickerCost = localStorage.getItem('fruitClickerCost')

// Loads everything
if (savedCount !== null) {
    numFruits.textContent = savedCount
}
if (savedFruitClickers !== null) {
    numFruitClicker.textContent = savedFruitClickers
}
if (savedClickerCost !== null) {
    clickerCost.textContent = savedClickerCost
}

// Helper functions
function updateFruitCount(newCount) {
    numFruits.textContent = newCount
}

function saveGame() {
    let current = parseInt(numFruits.textContent)
    let currentClickers = parseInt(numFruitClicker.textContent)
    let currentClickerCost = parseInt(clickerCost.textContent)

    localStorage.setItem('fruitCount', current)
    localStorage.setItem('fruitClickerCount', currentClickers)
    localStorage.setItem('fruitClickerCost', currentClickerCost)
}

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

// When the strawberry gets clicked, the fruit count increases
strawberry.addEventListener('click', () => {
    let current = parseInt(numFruits.textContent)
    updateFruitCount(current + 1)
})

// Code for opening and closing the shop
document.getElementById('saveButton').addEventListener('click', () => {
    saveGame()
    showPopup('saveMessage')
})

document.getElementById('closeMessage').addEventListener('click', () => {
    hidePopup('saveMessage')
})

// Code for opening and closing the shop
document.getElementById('shopButton').addEventListener('click', () => {
    showPopup('shopSection')
})

document.getElementById('closeShop').addEventListener('click', () => {
    hidePopup('shopSection')
})

// Code for buying the first upgrade
document.getElementById('buyFruitClicker').addEventListener('click', () => {
    let current = parseInt(numFruits.textContent)
    let cost = parseInt(clickerCost.textContent)
    let currentClickers = parseInt(numFruitClicker.textContent) || 0

    if (current >= cost) {
        updateFruitCount(current - cost)
        numFruitClicker.textContent = currentClickers + 1
        clickerCost.textContent = Math.floor(cost * 1.2)
    }
})

// Making the fruit clickers work
setInterval(() => {
    let current = parseInt(numFruits.textContent)
    let currentClickers = parseInt(numFruitClicker.textContent)
    updateFruitCount(current + currentClickers)
}, 1000)
