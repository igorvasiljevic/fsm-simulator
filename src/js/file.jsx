import { __jsx, __jsx_fragment } from './jsx.js';

const download_element = (
    <a download='fsm.json' style={{display:'none'}} onclick={e => e.stopPropagation()}/>
);
const upload_element = (
    <input type='file' accept='.json' style={{display:'none'}} onclick={e => e.stopPropagation()}/>
);
const reader = new FileReader();

document.addEventListener('DOMContentLoaded', () => {
    document.body.append(download_element, upload_element);
}, { once: true });

const File = {
    download: (filename, content) => {
        download_element.setAttribute('download', filename);
        download_element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
            encodeURIComponent(content)
        );
        download_element.click();
    },

    upload: () => new Promise((resolve, reject) => {
        upload_element.onchange = e => {
            try {
                const file = upload_element.files?.[0];
                if(file) {
                    reader.onload = () => {
                        upload_element.value = null;
                        reader.onload = undefined;
                        resolve(reader.result);
                    };
                    reader.readAsText(file, 'utf-8');
                }
            } catch(err) {
                reject(err);
            }
        }
        upload_element.click();
    })
}

export default File;