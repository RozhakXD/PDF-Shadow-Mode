document.addEventListener('DOMContentLoaded', function () {
    const masterToggle = document.getElementById('masterToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const autoModeToggle = document.getElementById('autoModeToggle');

    for (const themeName of getAllThemeNames()) {
        const option = document.createElement('option');
        option.value = themeName;
        option.textContent = themeName;
        themeDropdown.appendChild(option);
    }

    chrome.storage.sync.get(['darkModeEnabled', 'selectedTheme', 'autoModeEnabled'], (items) => {
        masterToggle.checked = items.darkModeEnabled !== false;
        themeDropdown.value = items.selectedTheme || 'Classic Dark';
        themeDropdown.disabled = !masterToggle.checked;
        autoModeToggle.checked = !!items.autoModeEnabled;
    });

    function sendUpdate() {
        const isEnabled = masterToggle.checked;
        const selectedThemeName = themeDropdown.value;

        const filterValue = isEnabled ? getThemeFilter(selectedThemeName) : 'none';
        const bgValue = isEnabled ? getThemeBackground(selectedThemeName) : '#ffffff';

        themeDropdown.disabled = !isEnabled;

        chrome.storage.sync.set({
            darkModeEnabled: isEnabled,
            selectedTheme: selectedThemeName
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0] && tabs[0].url.toLowerCase().endsWith('.pdf')) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['scripts/content.js']
                }, () => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        command: 'updateFilter',
                        filter: filterValue,
                        background: bgValue
                    });
                });
            }
        });
    }

    autoModeToggle.addEventListener('change', () => {
        chrome.storage.sync.set({ autoModeEnabled: autoModeToggle.checked });
    });

    masterToggle.addEventListener('change', sendUpdate);
    themeDropdown.addEventListener('change', sendUpdate);
});