import { pushImageToChat } from '../firebase/db/mutations/sendMessage.js'
import { uploadBlob } from '../firebase/storage/uploadImage.js'
import { MB } from '../constants/fileSize.js'
import { compress } from '../utils/compressImage.js'
import { STORAGE_ROUTES } from '../global-vars/index.js'

export function uploadImageClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.hidden = true
    input.addEventListener('change', () => {
        const { files } = input
        input.remove()
        if (!files.length) return
        const firstFile = files[0]
        if (!firstFile) return
        if (firstFile.size >= 1 * MB) {
            window.toastr.error('The File you selected is too big. Please select files less than 1MB.')
            return
        }

        const isChatUpload = true
        const isThumb = true

        const path = STORAGE_ROUTES.SavePublicChat(crypto.randomUUID())
        Promise.allSettled([
            compress(firstFile).then((compressedFile) => {
                return uploadBlob(compressedFile, { isChatUpload, isThumb }, path)
            }),
            uploadBlob(firstFile, { isChatUpload }, path),
        ]).then(([thumbResult, result]) => {
            if (thumbResult.status === 'rejected' || result.status === 'rejected') {
                window.toastr.error('Something went wrong while uploading your file')
                return
            }

            const imageThumbUrl = thumbResult.value
            const imageUrl = result.value

            pushImageToChat(window.db, { imageThumbUrl, imageUrl })
        })
    })
    document.body.appendChild(input)
    input.click()
    function onFocus() {
        input.remove()
        window.removeEventListener('focus', onFocus)
    }
    window.addEventListener('focus', onFocus)
}
