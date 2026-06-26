// public/js/bot.js - AI Bot Interaction Handler

// Initialize bot on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeBotFeatures();
});

function initializeBotFeatures() {
    // Add smooth scrolling for bot link
    const botLinks = document.querySelectorAll('[href*="snacksbot.netlify.app"]');
    
    botLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('🤖 Opening AI Assistant Bot');
            // Bot opens in new tab, so no additional handling needed
        });
    });

    // Add loading animation on bot click
    const botFloatingBtn = document.querySelector('.bot-floating-btn');
    if (botFloatingBtn) {
        botFloatingBtn.addEventListener('click', function(e) {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 300);
        });
    }

    // Store bot preference in localStorage
    storeBotPreference();
}

function storeBotPreference() {
    // Track that user has interacted with bot
    const botVisited = localStorage.getItem('botVisited');
    if (!botVisited) {
        // Could add welcome tooltip here
        localStorage.setItem('botVisited', 'true');
    }
}

// Show bot floating button only after scroll
document.addEventListener('scroll', function() {
    const botContainer = document.querySelector('.bot-floating-container');
    if (botContainer) {
        if (window.scrollY > 200) {
            botContainer.style.display = 'block';
        } else {
            botContainer.style.display = 'none';
        }
    }
});

// Optional: Add keyboard shortcut to open bot (Ctrl+K or Cmd+K)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openBotAssistant();
    }
});

function openBotAssistant() {
    window.open('https://snacksbot.netlify.app/', '_blank');
}
