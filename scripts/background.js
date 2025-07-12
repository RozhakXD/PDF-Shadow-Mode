importScripts('themes.js');

function isPDFUrl(url) {
    if (!url) return false;
    const normalizedUrl = url.toLowerCase();
    return normalizedUrl.endsWith('.pdf') || 
           normalizedUrl.includes('.pdf?') ||
           normalizedUrl.includes('application/pdf') ||
           normalizedUrl.includes('chrome-extension://dahenjhkoodjbpjheillcadbppiidmhp');
}

function injectContentScript(tabId, callback) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['scripts/content.js']
    }, (result) => {
        if (chrome.runtime.lastError) {
            console.log('Gagal menyuntikkan skrip (percobaan 1):', chrome.runtime.lastError);
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['scripts/content.js']
                }, callback);
            }, 500);
        } else {
            callback();
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && isPDFUrl(tab.url)) {
        chrome.storage.sync.get(['autoModeEnabled', 'selectedTheme'], (settings) => {
            if (settings.autoModeEnabled) {
                const themeName = settings.selectedTheme || 'Classic Dark';
                const filterValue = getThemeFilter(themeName);
                const bgValue = getThemeBackground(themeName);

                injectContentScript(tabId, () => {
                    if (chrome.runtime.lastError) {
                        console.log('Gagal menyuntikkan skrip (percobaan terakhir):', chrome.runtime.lastError);
                        return;
                    }

                    chrome.tabs.sendMessage(tabId, {
                        command: 'updateFilter',
                        filter: filterValue,
                        background: bgValue
                    });
                });
            }
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-dark-mode") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.url && isPDFUrl(activeTab.url)) {
                chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme'], (settings) => {
                    const currentStatus = settings.darkModeEnabled !== false;
                    const newStatus = !currentStatus;

                    const themeName = settings.selectedTheme || 'Classic Dark';
                    const filterValue = newStatus ? getThemeFilter(themeName) : 'none';
                    const bgValue = newStatus ? getThemeBackground(themeName) : '#ffffff';

                    chrome.storage.sync.set({ darkModeEnabled: newStatus });

                    injectContentScript(activeTab.id, () => {
                        if (chrome.runtime.lastError) {
                            console.log('Gagal menyuntikkan skrip (perintah toggle):', chrome.runtime.lastError);
                            return;
                        }
                        chrome.tabs.sendMessage(activeTab.id, {
                            command: 'updateFilter',
                            filter: filterValue,
                            background: bgValue
                        });
                    });
                });
            }
        });
    }
});

chrome.runtime.onStartup.addListener(() => {
    console.log('PDF Shadow Mode Enhanced: Ekstensi dimulai');
});

chrome.runtime.onInstalled.addListener((details) => {
    console.log('PDF Shadow Mode Enhanced: Ekstensi terpasang/diperbarui', details.reason);
});

const keepAlive = () => {
    setInterval(() => {
        chrome.storage.local.get('keepAlive', () => {
            if (chrome.runtime.lastError) {
                console.log('Ping keep alive gagal');
            }
        });
    }, 25000);
};

keepAlive();