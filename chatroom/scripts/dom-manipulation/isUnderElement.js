export function isUnderElement(elem, e) {
    const elemWidth = $(elem).width()
    const elemHeight = $(elem).height()
    const elemPosition = $(elem).offset()
    const elemPosition2 = {}
    elemPosition2.top = elemPosition.top + elemHeight
    elemPosition2.left = elemPosition.left + elemWidth

    return e.pageX > elemPosition.left && e.pageX < elemPosition2.left && e.pageY > elemPosition.top && e.pageY < elemPosition2.top
}
