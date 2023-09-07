import IProduct from "./IProduct"

export default interface IProductCrawler {
    gotoSite: () => void,
    handleSearch: () => void,
    getProducts: () => IProduct[]
}