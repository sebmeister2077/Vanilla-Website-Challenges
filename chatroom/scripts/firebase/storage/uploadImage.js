import {
    ref,
    uploadBytes,
    uploadString,
    getDownloadURL,
    getMetadata,
    updateMetadata,
    deleteObject,
    listAll,
    list,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js'
import { STORAGE_ROUTES } from '../../global-vars/index.js'

export async function uploadImageUrl(url) {
    if (!window.storage) return
    const newItemStorageRef = ref(window.storage, STORAGE_ROUTES.SavePublic(crypto.randomUUID()))

    const blob = await fetch(url).then((res) => res.blob())
    return uploadBlob(blob)
}

export async function uploadBlob(blob) {
    if (!window.storage) return
    const newItemStorageRef = ref(window.storage, STORAGE_ROUTES.SavePublic(crypto.randomUUID()))

    const snapshot = await uploadBytes(newItemStorageRef, blob)
    return await getDownloadURL(snapshot.ref)
}
