type Props = {
  title: string
}

export default function StockGrid({ title }: Props) {

  return (
<div className="rounded-lg p-2 h-full flex flex-col bg-white shadow-xl">      
  <div style={{
      
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

        
      </div>
    </div>
  )
}