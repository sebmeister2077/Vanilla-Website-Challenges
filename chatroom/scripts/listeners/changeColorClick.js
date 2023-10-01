import { setUserData } from '../firebase/setGlobalData.js'
import { getRandomColor } from '../utils/randomColor.js'

export function changeColorClick() {
    if (!window.auth?.currentUser) return

    setUserData({ color: getRandomColor() })
}
