type Props = {
  title: string
  children?: React.ReactNode

}

  export default function StockGrid({
    title,
    children,
  }: Props) {

    
  return (
<div
    className="rounded-lg p-2 flex flex-col bg-white shadow-xl"
    style={{
    minWidth: "200px",
    width: "fit-content",
    alignSelf: "flex-start"
   }}
>      
        {/* <div style={{ height: "180px" }}> */}
        {/* 倉庫名 */}
        <div style={{
          fontWeight: "bold",
          marginBottom: "6px"
        }}>
          {title}
        </div>

        {/* 倉庫内部グリッド */}
      <div
        className="grid"
        style={{
          gridAutoFlow: "column",
          gridAutoColumns: "80px",
          gap: "6px"
        }}
      >     
          {children}
      </div>
</div>
    // </div>
  )
}