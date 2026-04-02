type Props = {
  title: string
}

export default function WardGrid({ title }: Props) {

  return (

<div className="border-2 border-black rounded-lg p-2 h-full flex flex-col bg-white">      
  <div className="font-bold mb-2">
      </div>

      <div
        style={{
          //display: "grid",
          //gridTemplateColumns: "repeat(1, 2fr)",
          //gridAutoRows: "60px",
          //gap: "6px",
          gridTemplateRows: "220px 220px",
          border: "2px solid black",
          borderRadius: "8px",
          padding: "8px",
          background: "white",
          display: "flex",
          flexDirection: "column"
        }} 
      >
     {/* 病棟名 */}
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