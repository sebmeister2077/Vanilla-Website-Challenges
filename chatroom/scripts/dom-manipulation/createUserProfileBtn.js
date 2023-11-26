export function createUserProfileBtn(photoURL) {
    const button = $('#current-user-profile-template')
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)
    button.on('click', function (e) {
        console.log(e)
    })

    button.children('[data-current-user-img]').attr('src', photoURL)
    return button
}
