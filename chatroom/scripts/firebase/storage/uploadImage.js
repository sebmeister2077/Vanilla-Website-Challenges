import { ref } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js'
import { STORAGE_ROUTES } from '../../global-vars/index.js'

export function uploadImage(url) {
    if (!window.storage) return
    fetch(url)
        .then((res) => res.blob())
        .then((blob) => {})
}
