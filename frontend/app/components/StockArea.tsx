import StockGrid from "./StockGrid"

export default function Stock() {

  return (
    <div className="p-3">

      <h2 className="text-lg font-bold mb-3">
        ストックエリア
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "220px 220px",
          gap: "12px"
        }}
      >

        <div style={{ gridColumn: "span 3" }}>
          <StockGrid title="CE室" />
        </div>

        <StockGrid title="倉庫A" />
        <StockGrid title="倉庫B" />
        <StockGrid title="倉庫C" />

        <StockGrid title="倉庫D" />
        <StockGrid title="倉庫E" />

      </div>

    </div>
  )
}