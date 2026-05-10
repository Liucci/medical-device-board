import {
  StockArea,StockAreaDB
} from "../types/stockTypes"
//DB情報をUI用に変換
export const normalizeStockArea = (
    s: StockAreaDB
    ): StockArea => ({
    id:s.id,
    hospitalId:s.hospital_id,
    name:s.name
    })