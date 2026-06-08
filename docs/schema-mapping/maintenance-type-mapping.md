# MaintenanceType

## Response

| Schema | Type | Frontend | Type |
|----------|----------|----------|----------|
| id | int | id | number |
| hospital_id | str | hospitalId | string |
| name | str | name | string |
| device_type_id | int | deviceTypeId | number |
| device_model_id | int \| None | deviceModelId | number \| null |
| interval_days | int | intervalDays | number |
| warning_days | int \| None | warningDays | number \| null |
| auto_create_on_drop | bool \| None | autoCreateOnDrop | boolean \| null |
| is_active | bool \| None | isActive | boolean \| null |
| created_at | str \| None | createdAt | string \| null |

## Create Request

| Frontend | Type | Request | Type |
|----------|----------|----------|----------|
| name | string | name | str |
| deviceTypeId | number | device_type_id | int |
| deviceModelId | number \| null | device_model_id | int \| None |
| intervalDays | number | interval_days | int |

## Update Request

| Frontend | Type | Request | Type |
|----------|----------|----------|----------|
| id | number | id | int |
| name | string | name | str |
| intervalDays | number | interval_days | int |