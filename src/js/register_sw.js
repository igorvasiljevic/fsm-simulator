import { service_worker_path } from './constants.js';


const register_sw = () => {
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

export default register_sw;