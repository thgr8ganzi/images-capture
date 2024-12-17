chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {
        chrome.downloads.download({
            url: request.url,
            saveAs: false,
            filename: getFilenameFromUrl(request.url)
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error("Download failed:", chrome.runtime.lastError);
                // 다운로드 실패 시 대체 방법 시도
                chrome.tabs.create({ url: request.url, active: false }, (tab) => {
                    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                        if (tabId === tab.id && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.tabs.remove(tab.id);
                        }
                    });
                });
            }
        });
    }
});

function getFilenameFromUrl(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (!filename.includes('.')) {
        filename += '.jpg';
    }
    return filename;
}
