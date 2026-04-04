import WardGrid from "./WardGrid"

export default function WardArea(){
  return (
    <div className="p-3 ">

      <h2 className="text-2xl font-bold mb-3">
        病棟一覧
      </h2>            
      <div
              style={{
                 display: "grid",
                 gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px"
               }}
            >
      
              <div style={{ gridColumn: "span 3" }}>
                <WardGrid title="ICU" />
              </div>
      
              <WardGrid title="CCU" />
              <WardGrid title="HCU" />
              <WardGrid title="SCU" />
      
              <WardGrid title="東３" />
              <WardGrid title="西６" />
      
            </div>
    </div>
  )
}