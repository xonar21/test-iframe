// Функция, которая определяет высоту и отправляет в родительское окно
function sendHeightToParent() {
    // Берём scrollHeight документа как «самую» настоящую высоту
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ iframeHeight: height }, '*');
}

// Чтобы отлавливать любые изменения в DOM
const observer = new MutationObserver(() => {
    sendHeightToParent();
});

// Чтобы подстроиться под изменения размеров самого окна iframe (если внутри кто-то тянет размер и т.д.)
window.addEventListener('resize', () => {
    sendHeightToParent();
});

// Запуск всего процесса после полной загрузки
window.addEventListener('DOMContentLoaded', () => {
    // Начинаем следить за изменениями внутри body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    // Сразу отправим текущую высоту
    sendHeightToParent();
});

// Если нужно дождаться загрузки картинок или внешних ресурсов,
// то можно продублировать на window.load
window.addEventListener('load', () => {
    sendHeightToParent();
});

// Дополнительно, если хотим реагировать на сообщения «вынужденно» (например, когда родитель ресайзится)
window.addEventListener('message', event => {
    // По какому-то признаку или типу сообщения
    if (event.data && event.data.type === 'recalc') {
        sendHeightToParent();
    }
});
