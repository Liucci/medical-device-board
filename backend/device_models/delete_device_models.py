def delete_device_model(device_model_id: int):
    print(f"delete device_model")
    response = (
        supabase
        .table("device_models")
        .delete()
        .eq(
            "id",
            device_model_id
        )
        .execute()
    )
    return response.data[0]
