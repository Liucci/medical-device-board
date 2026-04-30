type Props = {
  title: string
  children?: React.ReactNode
  minWidth?: number
}
//病棟コンテナのUIを定義する関数コンポーネント
export default function WardGrid({ 
                                    title, 
                                    children, 
                                    minWidth 
                                  }: Props) {

  return (
          <div
            className="rounded-lg p-2 flex flex-col bg-white shadow-xl"
            style={{
              minWidth: minWidth
            }}
           >        
            {/* 病棟名 */}
            <div style={{
                          fontWeight: "bold",
                          marginBottom: "6px",
                          minWidth: "200px",
                          width: "fit-content"
                        }}>
                  {title}
                
            </div>
                {children}
          </div>
        )
  }