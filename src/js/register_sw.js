import { app_root } from './navigation.js';

export const service_worker_path = app_root + '/sw.js';

export default () => {
    if(navigator.serviceWorker) {
        navigator.serviceWorker.register(service_worker_path);

        let refreshing;
        navigator.serviceWorker.oncontrollerchange = () => {
            if(refreshing) return;
            refreshing = true;
            window.location.reload();
        };
    }
}