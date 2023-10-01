export async function getRandomImage() {
    const fakerImg = faker.image.abstract(40, 40).replace('http://', 'https://').replace('lorempixel', 'loremflickr')
    const { url } = await fetch(fakerImg, { mode: 'cors' })
    return url
}
