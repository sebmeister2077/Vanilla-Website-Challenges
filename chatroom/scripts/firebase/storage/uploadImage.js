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
import { getRandomImageUrl } from '../../utils/randomImage.js'

export async function uploadImageUrl(url) {
    if (!window.storage) return

    const blob = await fetch(url).then((res) => res.blob())
    return uploadBlob(blob)
}

export async function uploadRandomImage() {
    try {
        const downloadURL = await uploadImageUrl(await getRandomImageUrl())
        toastr.success('Creation complete!')
        return downloadURL
    } catch {
        toastr.error('Failed to create profile image')
    }
}

export async function uploadBlob(blob, opts = {}, givenPath) {
    if (!window.storage) return
    if (!(blob instanceof Blob)) throw new Error("parameter 'blob' is not of type Blob")
    let path = givenPath || STORAGE_ROUTES.SavePublicUserProfileImage(crypto.randomUUID())
    if (opts.isChatUpload && !givenPath) path = STORAGE_ROUTES.SavePublicChat(crypto.randomUUID())
    if (opts.isThumb) path += '_thumb'

    const newItemStorageRef = ref(window.storage, path)

    const snapshot = await uploadBytes(newItemStorageRef, blob)
    return await getDownloadURL(snapshot.ref)
}
