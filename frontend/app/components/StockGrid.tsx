type Props = {
  title: string
  children?: React.ReactNode

}

  export default function StockGrid({
    title,
    children,
  }: Props) {

    
  return (
    <div className="rounded-lg p-2 h-full flex flex-col bg-white shadow-xl"
    >      
      <div style={{ height: "180px" }}>
        {/* 倉庫名 */}
        <div style={{
          fontWeight: "bold",
          marginBottom: "6px"
        }}>
          {title}
        </div>

        {/* 倉庫内部グリッド */}
        <div
          className="grid flex-1"
style={{
          gridTemplateColumns: "repeat(3, 80px)", // 3列
          gridTemplateRows: "repeat(2, 70px)",    // 2行
          gap: "6px"
        }}        >
          {children}
        </div>
      </div>
    </div>
  )
}