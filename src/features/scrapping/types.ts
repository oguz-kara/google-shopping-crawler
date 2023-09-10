import { Product } from "@features/excel/types"
import { RowData } from "@features/excel/types"
import { ScrapedProduct } from "@features/excel/types"

export interface ProductData {
  baseProduct: Product | RowData
  ads: ScrapedProduct[]
  regular: ScrapedProduct[]
  related: ScrapedProduct[]
}