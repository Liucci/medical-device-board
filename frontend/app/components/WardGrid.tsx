type Props = {
  title: string
  children?: React.ReactNode
  minWidth?: number
  cellSize:number
}
//病棟コンテナのUIを定義する関数コンポーネント
export default function WardGrid({ 
                                    title, 
                                    children, 
                                    minWidth,
                                    cellSize
                                  }: Props) {

  return (
          <div
            className="rounded-lg p-2 flex flex-col bg-white shadow-xl"
            style={{
              minWidth: minWidth
            }}
           >        
            {/* 病棟名 */}
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "6px",
              width: "fit-content",

              fontSize:
                cellSize >= 88
                  ? "16px"
                  : cellSize >= 64
                  ? "14px"
                  : cellSize >= 40
                  ? "12px"
                  : "10px"
            }}
          >
            {title}
          </div>
                {children}
          </div>
        )
  }