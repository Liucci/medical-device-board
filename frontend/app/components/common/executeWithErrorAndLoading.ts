import { executeWithLoading } from "./executeWithLoading"
import { showError } from "./showError"


//executeWithLoadingにエラーを取得する機能をラップする
type ExecuteWithErrorAndLoadingParams = {
                        setLoading: React.Dispatch<React.SetStateAction<boolean>>
                        action: () => Promise<void>
}

export async function executeWithErrorAndLoading({
                            setLoading,
                            action
                            }: ExecuteWithErrorAndLoadingParams) 
{
    console.log("executeWithErrorAndLoading")
    try {
        await executeWithLoading({ setLoading, action })
    }
    catch (error) {
        showError(error)
    }
}