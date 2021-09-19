import { home_folder } from './navigation.js';

export const service_worker_path = home_folder + '/sw.js';

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