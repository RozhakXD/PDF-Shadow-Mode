if (!window.pdfFilterListenerAdded) {
    window.pdfFilterListenerAdded = true;

    function detectConflictingExtensions() {
        const iframe = document.querySelector('iframe[src*="chrome-extension://dahenjhkoodjbpjheillcadbppiidmhp"]');
        const scholarExtension = iframe && iframe.src.includes('dahenjhkoodjbpjheillcadbppiidmhp');
        
        if (scholarExtension) {
            console.log('Ekstensi PDF Scholar terdeteksi. PDF Shadow Mode akan berjalan dalam mode kompatibilitas.');
            return true;
        }
        return false;
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "updateFilter") {
            const isScholarActive = detectConflictingExtensions();
            
            let pdfViewer;
            if (isScholarActive) {
                pdfViewer = document.querySelector('iframe[src*="chrome-extension://dahenjhkoodjbpjheillcadbppiidmhp"]') ||
                           document.querySelector('#plugin') ||
                           document.querySelector('embed[type="application/pdf"]');
            } else {
                pdfViewer = document.querySelector('embed[type="application/pdf"]') ||
                           document.querySelector('#plugin') ||
                           document.querySelector('iframe');
            }

            if (pdfViewer) {
                pdfViewer.style.setProperty('filter', message.filter, 'important');
                pdfViewer.style.setProperty('transition', 'filter 0.3s ease', 'important');

                const backgroundStyle = `
                    body, html {
                        background-color: ${message.background} !important;
                        transition: background-color 0.3s ease !important;
                    }
                    iframe, embed {
                        filter: ${message.filter} !important;
                        transition: filter 0.3s ease !important;
                    }
                    /* Khusus untuk Google Scholar PDF Reader */
                    iframe[src*="chrome-extension://dahenjhkoodjbpjheillcadbppiidmhp"] {
                        filter: ${message.filter} !important;
                        background-color: ${message.background} !important;
                    }
                `;

                const oldStyle = document.getElementById('pdf-shadow-mode-style');
                if (oldStyle) {
                    oldStyle.remove();
                }

                const style = document.createElement('style');
                style.id = 'pdf-shadow-mode-style';
                style.textContent = backgroundStyle;
                document.head.appendChild(style);

                document.body.style.setProperty('background-color', message.background, 'important');
                document.documentElement.style.setProperty('background-color', message.background, 'important');
            }
        }
    });
}