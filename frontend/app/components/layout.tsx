import WardArea from "./WardArea"
import StockArea from "./StockArea"
import ButtonPanel from "./ButtonPanel"

export default function Layout() {
  return (
    <div className="layout">

      <WardArea />

      <StockArea />

      <ButtonPanel />

    </div>
  )
}