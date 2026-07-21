export function showError(error: unknown) 
{
    console.log("showError")

    if (error instanceof Error) {
        alert(error.message)
        return
    }

    alert("エラーが発生しました。")
}