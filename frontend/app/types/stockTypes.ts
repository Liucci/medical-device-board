//frontend側での型定義
//frontendのstockArea情報はnameしか持っていない
//そのほか情報はDBやbackend側で取得する情報
//fetchStockAreaではid取得は必要

export type StockArea = {
  id?: number
  hospitalId?: string
  name: string
}

export type StockAreaDB = {
  id?: number
  hospital_id?: string
  name: string
  created_at?: string
}