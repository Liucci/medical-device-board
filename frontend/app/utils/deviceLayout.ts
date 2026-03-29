//病室内医療機器の配置を３行２列にする座標を計算するユーティリティ関数です。

export function getDevicePosition(index:number){

  const col = index % 2
  const row = Math.floor(index / 2)

  const x = 10 + col * 110
  const y = 50 + row * 70

  return {x,y}
}