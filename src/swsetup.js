export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js');

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if(refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }
};