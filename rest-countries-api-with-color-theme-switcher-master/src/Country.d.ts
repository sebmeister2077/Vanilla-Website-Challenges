export type Country = {
    capital: string[]
    flags: { png: string; alt: string; svg: string }
    name: {
        common: string
        official: string
        nativeName: string
    }
    population: number
    region: string
}
