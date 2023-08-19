$('#rules-btn').on('click', function (e) {
    const dialog = document.getElementsByTagName('dialog')[0]
    if (dialog.open) dialog.close()
    else dialog.showModal()
})
