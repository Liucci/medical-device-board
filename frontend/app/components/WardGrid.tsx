import { WardType } from "../types/wardTypes"
import { WardInfectionType } from "../types/wardInfectionTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"

import { FaVirus } from "react-icons/fa"

type Props = {
                title: string
                children?: React.ReactNode
                minWidth?: number
                cellSize:number
                ward: WardType
                wardInfections: WardInfectionType[]
                infectionTypes: InfectionTypeType[]
                onClick?: (ward: WardType) => void
              }
//病棟コンテナのUIを定義する関数コンポーネント
export default function WardGrid({ 
                                    title, 
                                    children, 
                                    minWidth,
                                    cellSize,
                                    ward,
                                    wardInfections,
                                    infectionTypes,
                                    onClick
                                  }: Props) {

  const wardInfectionsForWard =
    wardInfections.filter(
      wi => wi.wardId === ward.id
  )
  const statusFontSize =
    cellSize >= 88
      ? "16px"
      : cellSize >= 64
      ? "14px"
      : cellSize >= 40
      ? "12px"
    : "10px"

  return (
          <div
            className={`
                        rounded-lg
                        p-2
                        flex
                        flex-col
                        bg-white
                        shadow-xl
                        ${wardInfectionsForWard.length > 0 ? "infection-glow" : ""}
            `} 
            style={{
                    minWidth,
                    background:
                      wardInfectionsForWard.length > 0
                        ? "#fff5f5"
                        : "#ffffff",
            }}            
          >
            {/* ★ このヘッダーだけクリック可能にする */}
          <div
            className="cursor-pointer"
            onClick={() => {
              console.log("ward click", ward.name)
              onClick?.(ward)
            }}          >   
            {/* 病棟名 */}
          <div
          className="flex items-center gap-2 mb-2"
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
        
          
        <span>{title}</span>
            {ward.status && (
              <span
              
                className="rounded bg-red-100 text-red-700"
                style={{
                  fontSize: statusFontSize,
                  padding: "2px 6px",
                  lineHeight: 1.2,
                }}
              >
                {ward.status}
              </span>
            )}
           <div className="flex gap-1">
            {wardInfectionsForWard.map(wi => {
              const infection =
                infectionTypes.find(
                  i => i.id === wi.infectionTypeId
                )

              if (!infection) return null

              return (
                <FaVirus
                  key={wi.id}
                  size={12}
                  color={infection.color}
                  title={infection.name}
                />
              )
            })}
          </div>
          </div>
        </div>
                {children}
          </div>
        )
  }