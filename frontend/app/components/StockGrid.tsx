type Props = {
  title: string
}

export default function StockGrid({ title }: Props) {

  return (

<div className="border-2 border-black rounded-lg p-2 h-full flex flex-col bg-white">      
  <div className="font-bold mb-2">
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          //gridAutoRows: "60px",
          //gap: "6px",
          flexGrow: 1,
            border:"3px solid black",
          borderRadius:"8px",
          padding:"8px",
          height:"180px"
        }} 
      >
     {/* 倉庫名 */}
      <div style={{
        fontWeight: "bold",
        marginBottom: "6px"
      }}>
        {title}
      </div>

        {/* 機器アイコン */}

      </div>

    </div>
  )
}