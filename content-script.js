let isActive = false;
let lastHighlighted = null;

function findClosestImage(element) {
    while (element && element !== document.body) {
        if (element.tagName === 'IMG') {
            return element;
        }
        if (element.tagName === 'A' && element.querySelector('img')) {
            return element.querySelector('img');
        }
        element = element.parentElement;
    }
    return null;
}

function highlightElement(element) {
    if (lastHighlighted) {
        lastHighlighted.classList.remove('extension-highlight');
    }
    if (element) {
        element.classList.add('extension-highlight');
        lastHighlighted = element;
    }
}

function handleMouseMove(e) {
    if (!isActive) return;
    const image = findClosestImage(e.target);
    highlightElement(image);
}

function handleClick(e) {
    if (!isActive) return;
    const image = findClosestImage(e.target);
    if (image) {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(image.src);
    }
    deactivateImageSelection();
}

function downloadImage(url) {
    chrome.runtime.sendMessage({action: 'downloadImage', url: url});
}

function deactivateImageSelection() {
    isActive = false;
    if (lastHighlighted) {
        lastHighlighted.classList.remove('extension-highlight');
        lastHighlighted = null;
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClick);
    chrome.runtime.sendMessage({action: 'updateButtonState', isActive: false});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleActive') {
        isActive = request.isActive;
        if (isActive) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('click', handleClick);
        } else {
            deactivateImageSelection();
        }
    }
});
