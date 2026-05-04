type Props = {
  title: string
  children?: React.ReactNode
  cellSize:number

}

  export default function StockGrid({
    title,
    children,
    cellSize
  }: Props) {

    
  return (
        <div
            className="rounded-lg p-2 flex flex-col bg-white shadow-xl"
            style={{
            minWidth: "90px",
            width: "fit-content",
            alignSelf: "flex-start"
          }}
        >      
        {/* <div style={{ height: "180px" }}> */}
        {/* 倉庫名 */}
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "6px",

            fontSize:
              cellSize >= 88
                ? "16px"
                : cellSize >= 64
                ? "14px"
                : cellSize >= 40
                ? "12px"
                : "10px",

            lineHeight: 1.1
          }}
        >
            {title}
        </div>

        {/* 倉庫内部グリッド */}
        <div
          className="grid"
          style={{
            gridAutoFlow: "column",

            // ★ここを動的化
            gridAutoColumns: `${cellSize + 8}px`,

            gap: "6px"
          }}
      >          
      {children}
      </div>
</div>
    // </div>
  )
}