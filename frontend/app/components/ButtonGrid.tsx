type Props = {
  title: string
  onAdd: () => void
}

export default function ButtonGrid({ title, onAdd }: Props) {
  return (
    //ボタンを表示するためのグリッドレイアウト
    //CSSグリッドを使用して、ボタンを配置するためのスタイルを定義
    <button onClick={onAdd} className="rounded-lg p-3 bg-white shadow-xl">
      {title}
    </button>
  )
}