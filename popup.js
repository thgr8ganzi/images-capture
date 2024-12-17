let isActive = false;
const button = document.getElementById('activateButton');

button.addEventListener('click', () => {
    isActive = !isActive;
    updateButtonState();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleActive', isActive: isActive});
    });
});

function updateButtonState() {
    button.textContent = isActive ? '이미지 선택 모드 비활성화' : '이미지 선택 모드 활성화';
    button.classList.toggle('active', isActive);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateButtonState') {
        isActive = request.isActive;
        updateButtonState();
    }
});
