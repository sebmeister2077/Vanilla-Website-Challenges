import { pushImageToChat } from '../firebase/db/mutations/sendMessage.js'
import { uploadBlob } from '../firebase/storage/uploadImage.js'
import { MB } from '../constants/fileSize.js'

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
            window.toastr.error('The File you selected is too big')
            return
        }

        const isChatUpload = true
        uploadBlob(firstFile, isChatUpload).then((downloadUrl) => {
            pushImageToChat(window.db, downloadUrl)
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
