type Props = {
  onAdd: () => void
}

export default function ButtonGrid({ onAdd }: Props) {
  return (
    <button onClick={onAdd}>
      新規登録
    </button>
  )
}