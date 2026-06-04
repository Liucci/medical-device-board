def rename_device_model(
                        device_model_id: int,
                        name: str,
                        ):
    print("rename device_model")
    response = (
        supabase
        .table("device_models")
        .update({
            "name": name,
        })
        .eq(
            "id",
            device_model_id
        )
        .execute()
    )
    return response.data[0]
