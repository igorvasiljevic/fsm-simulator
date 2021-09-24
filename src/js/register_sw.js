import { app_root } from './navigation.js';

export const service_worker_path = app_root + '/sw.js';

export default () => {
    if('serviceWorker' in navigator)
        navigator.serviceWorker.register(service_worker_path);
}