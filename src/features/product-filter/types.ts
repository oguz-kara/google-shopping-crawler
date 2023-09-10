import { Product, RowData, ScrapedProduct } from "@features/excel/types";

export interface ProductWithRelateds {
    baseProduct: Product | RowData;
    relatedProducts: ScrapedProduct[];
}