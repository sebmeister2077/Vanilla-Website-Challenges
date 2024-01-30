import Compressor from 'https://cdn.jsdelivr.net/npm/compressorjs@1.2.1/+esm'

export async function compress(file) {
    var scope = {}
    const promise = new Promise(function (res, rej) {
        scope.res = res
        scope.rej = rej
    })
    new Compressor(file, {
        quality: 0.1,
        maxWidth: 60,
        maxHeight: 60,
        success: scope.res,
        error: scope.rej,
    })
    return promise
}
