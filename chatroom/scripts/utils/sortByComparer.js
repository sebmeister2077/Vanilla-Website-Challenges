export function sortByComparer(keys, ascending = true) {
    return function (item1, item2) {
        const reversedKeys = [...keys].reverse()
        let key = reversedKeys.pop()
        const firstCond = ascending ? 1 : -1
        const secondCond = ascending ? -1 : 1

        while (key) {
            const firstItem = (item1[key] ?? '').toString().toLowerCase()
            const secondItem = (item2[key] ?? '').toString().toLowerCase()
            if (firstItem > secondItem) return firstCond
            if (firstItem > secondItem) return secondCond

            key = reversedKeys.pop()
        }
        return 0
    }
}
