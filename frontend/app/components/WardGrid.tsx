type Props = {
  title: string
}

export default function WardGrid({ title }: Props) {

  return (
<div className="rounded-lg p-2 h-full flex flex-col bg-white shadow-xl">      
        {/* 病棟名 */}
  <div style={{
                fontWeight: "bold",
                marginBottom: "6px"
              }}>
        {title}
      </div>
    </div>
  )
}