import { service_worker_path } from './constants.js';


export default () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(service_worker_path);

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if(refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }
}