# Supabase Schema Metadata

| table_name               |   ordinal_position | column_name             | data_type                   | pk   | fk                          | is_nullable   |
|:-------------------------|-------------------:|:------------------------|:----------------------------|:-----|:----------------------------|:--------------|
| device_histories         |                  1 | id                      | bigint                      | YES  | nan                         | NO            |
| device_histories         |                  2 | device_id               | bigint                      | nan  | nan                         | NO            |
| device_histories         |                  3 | user_id                 | uuid                        | nan  | nan                         | YES           |
| device_histories         |                  4 | action_type             | text                        | nan  | nan                         | NO            |
| device_histories         |                  5 | status                  | text                        | nan  | nan                         | YES           |
| device_histories         |                  6 | room_id                 | bigint                      | nan  | rooms.id                    | YES           |
| device_histories         |                  7 | stock_area_id           | bigint                      | nan  | stock_areas.id              | YES           |
| device_histories         |                  8 | management_number       | text                        | nan  | nan                         | YES           |
| device_histories         |                  9 | serial_number           | text                        | nan  | nan                         | YES           |
| device_histories         |                 10 | note                    | text                        | nan  | nan                         | YES           |
| device_histories         |                 11 | error_code              | text                        | nan  | nan                         | YES           |
| device_histories         |                 12 | error_level             | text                        | nan  | nan                         | YES           |
| device_histories         |                 13 | error_detail            | text                        | nan  | nan                         | YES           |
| device_histories         |                 14 | message                 | text                        | nan  | nan                         | YES           |
| device_histories         |                 15 | created_at              | timestamp with time zone    | nan  | nan                         | NO            |
| device_histories         |                 16 | patient_name            | text                        | nan  | nan                         | YES           |
| device_histories         |                 17 | device_type_name        | text                        | nan  | nan                         | YES           |
| device_histories         |                 18 | device_model_name       | text                        | nan  | nan                         | YES           |
| device_histories         |                 19 | room_name               | text                        | nan  | nan                         | YES           |
| device_histories         |                 20 | stock_area_name         | text                        | nan  | nan                         | YES           |
| device_histories         |                 21 | maintenance_started_at  | date                        | nan  | nan                         | YES           |
| device_histories         |                 22 | maintenance_finished_at | date                        | nan  | nan                         | YES           |
| device_histories         |                 23 | standby_started_at      | date                        | nan  | nan                         | YES           |
| device_histories         |                 24 | standby_finished_at     | date                        | nan  | nan                         | YES           |
| device_histories         |                 25 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| device_histories         |                 26 | action_by               | uuid                        | nan  | users.id                    | YES           |
| device_maintenance_logs  |                  1 | id                      | bigint                      | YES  | nan                         | NO            |
| device_maintenance_logs  |                  2 | device_id               | bigint                      | nan  | devices.id                  | NO            |
| device_maintenance_logs  |                  3 | maintenance_type_id     | bigint                      | nan  | maintenance_types.id        | NO            |
| device_maintenance_logs  |                  4 | performed_at            | timestamp with time zone    | nan  | nan                         | NO            |
| device_maintenance_logs  |                  5 | task_id                 | bigint                      | nan  | device_maintenance_tasks.id | YES           |
| device_maintenance_logs  |                  6 | note                    | text                        | nan  | nan                         | YES           |
| device_maintenance_logs  |                  7 | created_at              | timestamp with time zone    | nan  | nan                         | YES           |
| device_maintenance_logs  |                  8 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| device_maintenance_tasks |                  1 | id                      | bigint                      | YES  | nan                         | NO            |
| device_maintenance_tasks |                  2 | device_id               | bigint                      | nan  | devices.id                  | NO            |
| device_maintenance_tasks |                  3 | maintenance_type_id     | bigint                      | nan  | maintenance_types.id        | NO            |
| device_maintenance_tasks |                  4 | due_at                  | timestamp with time zone    | nan  | nan                         | NO            |
| device_maintenance_tasks |                  5 | status                  | text                        | nan  | nan                         | NO            |
| device_maintenance_tasks |                  6 | completed_at            | timestamp with time zone    | nan  | nan                         | YES           |
| device_maintenance_tasks |                  7 | created_at              | timestamp with time zone    | nan  | nan                         | YES           |
| device_maintenance_tasks |                  8 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| device_models            |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| device_models            |                  2 | device_type_id          | integer                     | nan  | device_types.id             | YES           |
| device_models            |                  3 | name                    | text                        | nan  | nan                         | NO            |
| device_models            |                  4 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| device_types             |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| device_types             |                  2 | name                    | text                        | nan  | nan                         | NO            |
| device_types             |                  3 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| devices                  |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| devices                  |                  2 | type                    | integer                     | nan  | nan                         | YES           |
| devices                  |                  3 | model                   | integer                     | nan  | nan                         | YES           |
| devices                  |                  4 | asset_type              | text                        | nan  | nan                         | YES           |
| devices                  |                  5 | status                  | text                        | nan  | nan                         | NO            |
| devices                  |                  6 | stock_area_id           | integer                     | nan  | stock_areas.id              | YES           |
| devices                  |                  7 | room_id                 | integer                     | nan  | rooms.id                    | YES           |
| devices                  |                  8 | management_number       | text                        | nan  | nan                         | YES           |
| devices                  |                  9 | serial_number           | text                        | nan  | nan                         | YES           |
| devices                  |                 10 | note                    | text                        | nan  | nan                         | YES           |
| devices                  |                 11 | created_at              | timestamp without time zone | nan  | nan                         | YES           |
| devices                  |                 12 | rental_start_date       | date                        | nan  | nan                         | YES           |
| devices                  |                 13 | rental_end_date         | date                        | nan  | nan                         | YES           |
| devices                  |                 14 | is_under_maintenance    | boolean                     | nan  | nan                         | NO            |
| devices                  |                 15 | maintenance_started_at  | date                        | nan  | nan                         | YES           |
| devices                  |                 16 | maintenance_finished_at | date                        | nan  | nan                         | YES           |
| devices                  |                 17 | standby                 | boolean                     | nan  | nan                         | NO            |
| devices                  |                 18 | standby_started_at      | date                        | nan  | nan                         | YES           |
| devices                  |                 19 | standby_finished_at     | date                        | nan  | nan                         | YES           |
| devices                  |                 20 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| devices                  |                 21 | created_by              | uuid                        | nan  | users.id                    | YES           |
| devices                  |                 22 | updated_by              | uuid                        | nan  | users.id                    | YES           |
| hospitals                |                  1 | id                      | uuid                        | YES  | nan                         | NO            |
| hospitals                |                  2 | hospital_name           | text                        | nan  | nan                         | NO            |
| hospitals                |                  3 | created_at              | timestamp with time zone    | nan  | nan                         | NO            |
| hospitals                |                  4 | is_active               | boolean                     | nan  | nan                         | NO            |
| hospitals                |                  5 | updated_at              | timestamp with time zone    | nan  | nan                         | YES           |
| hospitals                |                  6 | price_plan              | text                        | nan  | nan                         | YES           |
| invite_codes             |                  1 | id                      | uuid                        | YES  | nan                         | NO            |
| invite_codes             |                  2 | code                    | text                        | nan  | nan                         | NO            |
| invite_codes             |                  3 | hospital_id             | uuid                        | nan  | nan                         | NO            |
| invite_codes             |                  4 | role                    | text                        | nan  | nan                         | NO            |
| invite_codes             |                  5 | created_by              | uuid                        | nan  | users.id                    | YES           |
| invite_codes             |                  6 | used                    | boolean                     | nan  | nan                         | YES           |
| invite_codes             |                  7 | expires_at              | timestamp with time zone    | nan  | nan                         | YES           |
| invite_codes             |                  8 | created_at              | timestamp with time zone    | nan  | nan                         | YES           |
| invite_codes             |                  9 | email                   | text                        | nan  | nan                         | YES           |
| maintenance_types        |                  1 | id                      | bigint                      | YES  | nan                         | NO            |
| maintenance_types        |                  2 | name                    | text                        | nan  | nan                         | NO            |
| maintenance_types        |                  3 | device_type_id          | bigint                      | nan  | device_types.id             | NO            |
| maintenance_types        |                  4 | device_model_id         | bigint                      | nan  | device_models.id            | YES           |
| maintenance_types        |                  5 | interval_days           | integer                     | nan  | nan                         | NO            |
| maintenance_types        |                  6 | warning_days            | integer                     | nan  | nan                         | YES           |
| maintenance_types        |                  7 | auto_create_on_drop     | boolean                     | nan  | nan                         | YES           |
| maintenance_types        |                  8 | is_active               | boolean                     | nan  | nan                         | YES           |
| maintenance_types        |                  9 | created_at              | timestamp with time zone    | nan  | nan                         | YES           |
| maintenance_types        |                 10 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| rooms                    |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| rooms                    |                  2 | ward_id                 | integer                     | nan  | wards.id                    | YES           |
| rooms                    |                  3 | name                    | text                        | nan  | nan                         | NO            |
| rooms                    |                  4 | patient_name            | text                        | nan  | nan                         | YES           |
| rooms                    |                  5 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| stock_areas              |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| stock_areas              |                  2 | name                    | text                        | nan  | nan                         | NO            |
| stock_areas              |                  3 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| users                    |                  1 | id                      | uuid                        | YES  | nan                         | NO            |
| users                    |                  1 | id                      | uuid                        | YES  | nan                         | NO            |
| users                    |                  2 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
| users                    |                  3 | email                   | text                        | nan  | nan                         | NO            |
| users                    |                  4 | display_name            | text                        | nan  | nan                         | NO            |
| users                    |                  5 | role                    | text                        | nan  | nan                         | NO            |
| users                    |                  6 | is_active               | boolean                     | nan  | nan                         | NO            |
| users                    |                  7 | created_at              | timestamp with time zone    | nan  | nan                         | NO            |
| users                    |                  8 | updated_at              | timestamp with time zone    | nan  | nan                         | NO            |
| wards                    |                  1 | id                      | integer                     | YES  | nan                         | NO            |
| wards                    |                  2 | name                    | text                        | nan  | nan                         | NO            |
| wards                    |                  3 | hospital_id             | uuid                        | nan  | hospitals.id                | NO            |
