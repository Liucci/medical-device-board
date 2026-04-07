import WardGrid from "./WardGrid"
import { wards, rooms } from "../types/wards"

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
        {wards.map((ward) => (
          <div
            key={ward.wardID}
                        style={{
              gridColumn: ward.wardID === 1 ? "span 3" : undefined
            }}
          >
            {/* 病棟ごとにWardGridコンポーネントを生成。titleには病棟名を渡す。 */}
            <WardGrid title={ward.name} />
          </div>
        ))}

            </div>
    </div>
  )}
