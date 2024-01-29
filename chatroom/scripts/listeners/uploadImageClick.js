import { uploadBlob } from '../firebase/storage/uploadImage.js'

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

        console.log(files)
        uploadBlob(firstFile).then((downloadUrl) => {
            console.log(downloadUrl)
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
