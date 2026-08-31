| table_name                        | ordinal_position | column_name             | data_type                   | pk  | fk                            | is_nullable |
| --------------------------------- | ---------------- | ----------------------- | --------------------------- | --- | ----------------------------- | ----------- |
| account_edit_codes                | 1                | id                      | bigint                      | YES |                               | NO          |
| account_edit_codes                | 2                | user_id                 | uuid                        |     | users.id                      | NO          |
| account_edit_codes                | 3                | code                    | text                        |     |                               | NO          |
| account_edit_codes                | 4                | used                    | boolean                     |     |                               | NO          |
| account_edit_codes                | 5                | expires_at              | timestamp with time zone    |     |                               | NO          |
| account_edit_codes                | 6                | created_at              | timestamp with time zone    |     |                               | NO          |
| announcement_hospitals            | 1                | announcement_id         | bigint                      | YES | announcements.id              | NO          |
| announcement_hospitals            | 2                | hospital_id             | uuid                        | YES | hospitals.id                  | NO          |
| announcements                     | 1                | id                      | bigint                      | YES |                               | NO          |
| announcements                     | 2                | message                 | text                        |     |                               | NO          |
| announcements                     | 3                | start_at                | timestamp with time zone    |     |                               | NO          |
| announcements                     | 4                | end_at                  | timestamp with time zone    |     |                               | NO          |
| announcements                     | 5                | is_active               | boolean                     |     |                               | NO          |
| announcements                     | 6                | updated_at              | timestamp with time zone    |     |                               | NO          |
| announcements                     | 7                | created_at              | timestamp with time zone    |     |                               | NO          |
| device_histories                  | 1                | id                      | bigint                      | YES |                               | NO          |
| device_histories                  | 2                | device_id               | bigint                      |     |                               | NO          |
| device_histories                  | 4                | action_type             | text                        |     |                               | NO          |
| device_histories                  | 8                | management_number       | text                        |     |                               | YES         |
| device_histories                  | 9                | serial_number           | text                        |     |                               | YES         |
| device_histories                  | 10               | note                    | text                        |     |                               | YES         |
| device_histories                  | 14               | message                 | text                        |     |                               | YES         |
| device_histories                  | 15               | created_at              | timestamp with time zone    |     |                               | NO          |
| device_histories                  | 16               | patient_name            | text                        |     |                               | YES         |
| device_histories                  | 17               | device_type_name        | text                        |     |                               | YES         |
| device_histories                  | 18               | device_model_name       | text                        |     |                               | YES         |
| device_histories                  | 19               | room_name               | text                        |     |                               | YES         |
| device_histories                  | 20               | stock_area_name         | text                        |     |                               | YES         |
| device_histories                  | 21               | maintenance_started_at  | date                        |     |                               | YES         |
| device_histories                  | 22               | maintenance_finished_at | date                        |     |                               | YES         |
| device_histories                  | 23               | standby_started_at      | date                        |     |                               | YES         |
| device_histories                  | 24               | standby_finished_at     | date                        |     |                               | YES         |
| device_histories                  | 25               | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| device_histories                  | 26               | action_by               | uuid                        |     | users.id                      | YES         |
| device_histories                  | 27               | action_by_name          | text                        |     |                               | YES         |
| device_maintenance_logs           | 1                | id                      | bigint                      | YES |                               | NO          |
| device_maintenance_logs           | 2                | device_id               | bigint                      |     | devices.id                    | NO          |
| device_maintenance_logs           | 3                | maintenance_type_id     | bigint                      |     | maintenance_types.id          | NO          |
| device_maintenance_logs           | 4                | performed_at            | timestamp with time zone    |     |                               | NO          |
| device_maintenance_logs           | 5                | task_id                 | bigint                      |     | device_maintenance_tasks.id   | YES         |
| device_maintenance_logs           | 6                | note                    | text                        |     |                               | YES         |
| device_maintenance_logs           | 7                | created_at              | timestamp with time zone    |     |                               | YES         |
| device_maintenance_logs           | 8                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| device_maintenance_tasks          | 1                | id                      | bigint                      | YES |                               | NO          |
| device_maintenance_tasks          | 2                | device_id               | bigint                      |     | devices.id                    | NO          |
| device_maintenance_tasks          | 3                | maintenance_type_id     | bigint                      |     | maintenance_types.id          | NO          |
| device_maintenance_tasks          | 4                | due_at                  | timestamp with time zone    |     |                               | NO          |
| device_maintenance_tasks          | 6                | completed_at            | timestamp with time zone    |     |                               | YES         |
| device_maintenance_tasks          | 7                | created_at              | timestamp with time zone    |     |                               | YES         |
| device_maintenance_tasks          | 8                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| device_maintenance_tasks          | 9                | completed_by            | uuid                        |     | users.id                      | YES         |
| device_maintenance_tasks          | 10               | is_active               | boolean                     |     |                               | NO          |
| device_models                     | 1                | id                      | integer                     | YES |                               | NO          |
| device_models                     | 2                | device_type_id          | integer                     |     | device_types.id               | YES         |
| device_models                     | 3                | name                    | text                        |     |                               | NO          |
| device_models                     | 4                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| device_models                     | 5                | display_remaining_count | boolean                     |     |                               | NO          |
| device_models                     | 6                | remaining_alert_count   | integer                     |     |                               | NO          |
| device_types                      | 1                | id                      | integer                     | YES |                               | NO          |
| device_types                      | 2                | name                    | text                        |     |                               | NO          |
| device_types                      | 3                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| device_types                      | 4                | icon_color              | text                        |     |                               | NO          |
| devices                           | 1                | id                      | integer                     | YES |                               | NO          |
| devices                           | 2                | type                    | integer                     |     |                               | YES         |
| devices                           | 3                | model                   | integer                     |     |                               | YES         |
| devices                           | 4                | asset_type              | text                        |     |                               | YES         |
| devices                           | 5                | status                  | text                        |     |                               | NO          |
| devices                           | 6                | stock_area_id           | integer                     |     | stock_areas.id                | YES         |
| devices                           | 7                | room_id                 | integer                     |     | rooms.id                      | YES         |
| devices                           | 8                | management_number       | text                        |     |                               | YES         |
| devices                           | 9                | serial_number           | text                        |     |                               | YES         |
| devices                           | 10               | note                    | text                        |     |                               | YES         |
| devices                           | 11               | created_at              | timestamp without time zone |     |                               | YES         |
| devices                           | 12               | rental_start_date       | date                        |     |                               | YES         |
| devices                           | 13               | rental_end_date         | date                        |     |                               | YES         |
| devices                           | 14               | is_under_maintenance    | boolean                     |     |                               | NO          |
| devices                           | 15               | maintenance_started_at  | date                        |     |                               | YES         |
| devices                           | 16               | maintenance_finished_at | date                        |     |                               | YES         |
| devices                           | 17               | standby                 | boolean                     |     |                               | NO          |
| devices                           | 18               | standby_started_at      | date                        |     |                               | YES         |
| devices                           | 19               | standby_finished_at     | date                        |     |                               | YES         |
| devices                           | 20               | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| devices                           | 21               | created_by              | uuid                        |     | users.id                      | YES         |
| devices                           | 22               | updated_by              | uuid                        |     | users.id                      | YES         |
| devices                           | 23               | updated_at              | timestamp with time zone    |     |                               | YES         |
| hospital_settings                 | 1                | hospital_id             | uuid                        | YES | hospitals.id                  | NO          |
| hospital_settings                 | 2                | show_patient_name       | boolean                     |     |                               | NO          |
| hospital_settings                 | 3                | auto_logout_enabled     | boolean                     |     |                               | NO          |
| hospital_settings                 | 4                | auto_logout_time        | time without time zone      |     |                               | YES         |
| hospital_settings                 | 5                | created_at              | timestamp with time zone    |     |                               | NO          |
| hospital_settings                 | 6                | updated_at              | timestamp with time zone    |     |                               | NO          |
| hospitals                         | 1                | id                      | uuid                        | YES |                               | NO          |
| hospitals                         | 2                | hospital_name           | text                        |     |                               | NO          |
| hospitals                         | 3                | created_at              | timestamp with time zone    |     |                               | NO          |
| hospitals                         | 4                | is_active               | boolean                     |     |                               | NO          |
| hospitals                         | 5                | updated_at              | timestamp with time zone    |     |                               | YES         |
| hospitals                         | 6                | price_plan              | text                        |     |                               | YES         |
| hospitals                         | 7                | note                    | text                        |     |                               | YES         |
| infection_types                   | 1                | id                      | bigint                      | YES |                               | NO          |
| infection_types                   | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| infection_types                   | 3                | name                    | text                        |     |                               | NO          |
| infection_types                   | 4                | color                   | text                        |     |                               | NO          |
| inspection_checklist_item_options | 1                | id                      | bigint                      | YES |                               | NO          |
| inspection_checklist_item_options | 2                | checklist_item_id       | bigint                      |     | inspection_checklist_items.id | NO          |
| inspection_checklist_item_options | 3                | value                   | text                        |     |                               | NO          |
| inspection_checklist_item_options | 4                | display_order           | integer                     |     |                               | NO          |
| inspection_checklist_items        | 1                | id                      | integer                     | YES |                               | NO          |
| inspection_checklist_items        | 2                | checklist_id            | integer                     |     | inspection_checklists.id      | NO          |
| inspection_checklist_items        | 3                | display_order           | integer                     |     |                               | NO          |
| inspection_checklist_items        | 4                | item_name               | text                        |     |                               | NO          |
| inspection_checklist_items        | 5                | item_type_id            | integer                     |     | inspection_item_types.id      | NO          |
| inspection_checklist_items        | 6                | required                | boolean                     |     |                               | NO          |
| inspection_checklist_items        | 7                | default_value           | text                        |     |                               | YES         |
| inspection_checklist_items        | 8                | options                 | jsonb                       |     |                               | YES         |
| inspection_checklist_items        | 9                | unit                    | text                        |     |                               | YES         |
| inspection_checklist_items        | 10               | category_id             | bigint                      |     | inspection_item_categories.id | YES         |
| inspection_checklists             | 1                | id                      | integer                     | YES |                               | NO          |
| inspection_checklists             | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| inspection_checklists             | 3                | inspection_type_id      | integer                     |     | inspection_types.id           | NO          |
| inspection_checklists             | 4                | device_type_id          | integer                     |     | device_types.id               | NO          |
| inspection_checklists             | 5                | device_model_id         | integer                     |     | device_models.id              | YES         |
| inspection_checklists             | 6                | name                    | text                        |     |                               | NO          |
| inspection_checklists             | 7                | version                 | integer                     |     |                               | NO          |
| inspection_checklists             | 8                | is_active               | boolean                     |     |                               | NO          |
| inspection_checklists             | 9                | created_at              | timestamp with time zone    |     |                               | NO          |
| inspection_checklists             | 10               | updated_at              | timestamp with time zone    |     |                               | NO          |
| inspection_item_categories        | 1                | id                      | bigint                      | YES |                               | NO          |
| inspection_item_categories        | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| inspection_item_categories        | 3                | name                    | text                        |     |                               | NO          |
| inspection_item_categories        | 4                | display_order           | integer                     |     |                               | NO          |
| inspection_item_categories        | 5                | is_active               | boolean                     |     |                               | NO          |
| inspection_item_types             | 1                | id                      | integer                     | YES |                               | NO          |
| inspection_item_types             | 2                | name                    | text                        |     |                               | NO          |
| inspection_item_types             | 3                | description             | text                        |     |                               | YES         |
| inspection_item_types             | 4                | is_active               | boolean                     |     |                               | NO          |
| inspection_item_types             | 5                | input_type              | text                        |     |                               | NO          |
| inspection_item_types             | 6                | options                 | jsonb                       |     |                               | YES         |
| inspection_results                | 1                | id                      | bigint                      | YES |                               | NO          |
| inspection_results                | 2                | inspection_id           | bigint                      |     | inspections.id                | NO          |
| inspection_results                | 3                | checklist_item_id       | integer                     |     | inspection_checklist_items.id | NO          |
| inspection_results                | 4                | value                   | text                        |     |                               | YES         |
| inspection_types                  | 1                | id                      | integer                     | YES |                               | NO          |
| inspection_types                  | 2                | name                    | text                        |     |                               | NO          |
| inspection_types                  | 4                | is_active               | boolean                     |     |                               | NO          |
| inspection_types                  | 5                | hospital_id             | uuid                        |     | hospitals.id                  | YES         |
| inspections                       | 1                | id                      | bigint                      | YES |                               | NO          |
| inspections                       | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| inspections                       | 3                | device_id               | integer                     |     | devices.id                    | NO          |
| inspections                       | 4                | room_id                 | integer                     |     | rooms.id                      | YES         |
| inspections                       | 5                | inspection_type_id      | integer                     |     | inspection_types.id           | NO          |
| inspections                       | 6                | checklist_id            | integer                     |     | inspection_checklists.id      | NO          |
| inspections                       | 7                | performed_by            | uuid                        |     | users.id                      | YES         |
| inspections                       | 8                | performed_at            | timestamp with time zone    |     |                               | NO          |
| inspections                       | 9                | overall_result          | text                        |     |                               | YES         |
| inspections                       | 10               | comment                 | text                        |     |                               | YES         |
| inspections                       | 11               | created_at              | timestamp with time zone    |     |                               | NO          |
| invite_codes                      | 2                | code                    | text                        |     |                               | NO          |
| invite_codes                      | 3                | hospital_id             | uuid                        |     |                               | YES         |
| invite_codes                      | 4                | role                    | text                        |     |                               | NO          |
| invite_codes                      | 5                | created_by              | uuid                        |     | users.id                      | YES         |
| invite_codes                      | 6                | used                    | boolean                     |     |                               | YES         |
| invite_codes                      | 7                | expires_at              | timestamp with time zone    |     |                               | YES         |
| invite_codes                      | 8                | created_at              | timestamp with time zone    |     |                               | YES         |
| invite_codes                      | 9                | email                   | text                        |     |                               | YES         |
| invite_codes                      | 10               | id                      | bigint                      | YES |                               | NO          |
| invite_codes                      | 11               | hospital_name           | text                        |     |                               | YES         |
| maintenance_types                 | 1                | id                      | bigint                      | YES |                               | NO          |
| maintenance_types                 | 2                | name                    | text                        |     |                               | NO          |
| maintenance_types                 | 3                | device_type_id          | bigint                      |     | device_types.id               | NO          |
| maintenance_types                 | 4                | device_model_id         | bigint                      |     | device_models.id              | YES         |
| maintenance_types                 | 5                | interval_days           | integer                     |     |                               | NO          |
| maintenance_types                 | 6                | warning_days            | integer                     |     |                               | YES         |
| maintenance_types                 | 7                | auto_create_on_drop     | boolean                     |     |                               | YES         |
| maintenance_types                 | 8                | is_active               | boolean                     |     |                               | YES         |
| maintenance_types                 | 9                | created_at              | timestamp with time zone    |     |                               | YES         |
| maintenance_types                 | 10               | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| room_infections                   | 1                | id                      | bigint                      | YES |                               | NO          |
| room_infections                   | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| room_infections                   | 3                | room_id                 | bigint                      |     | rooms.id                      | NO          |
| room_infections                   | 4                | infection_type_id       | bigint                      |     | infection_types.id            | NO          |
| rooms                             | 1                | id                      | integer                     | YES |                               | NO          |
| rooms                             | 2                | ward_id                 | integer                     |     | wards.id                      | YES         |
| rooms                             | 3                | name                    | text                        |     |                               | NO          |
| rooms                             | 4                | patient_name            | text                        |     |                               | YES         |
| rooms                             | 5                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| stock_areas                       | 1                | id                      | integer                     | YES |                               | NO          |
| stock_areas                       | 2                | name                    | text                        |     |                               | NO          |
| stock_areas                       | 3                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| stock_areas                       | 4                | display_order           | integer                     |     |                               | NO          |
| users                             | 1                | id                      | uuid                        | YES |                               | NO          |
| users                             | 1                | id                      | uuid                        | YES |                               | NO          |
| users                             | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| users                             | 3                | email                   | text                        |     |                               | NO          |
| users                             | 4                | display_name            | text                        |     |                               | NO          |
| users                             | 5                | role                    | text                        |     |                               | NO          |
| users                             | 6                | is_active               | boolean                     |     |                               | NO          |
| users                             | 7                | created_at              | timestamp with time zone    |     |                               | NO          |
| users                             | 8                | updated_at              | timestamp with time zone    |     |                               | NO          |
| ward_infections                   | 1                | id                      | bigint                      | YES |                               | NO          |
| ward_infections                   | 2                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| ward_infections                   | 3                | ward_id                 | bigint                      |     | wards.id                      | NO          |
| ward_infections                   | 4                | infection_type_id       | bigint                      |     | infection_types.id            | NO          |
| wards                             | 1                | id                      | integer                     | YES |                               | NO          |
| wards                             | 2                | name                    | text                        |     |                               | NO          |
| wards                             | 3                | hospital_id             | uuid                        |     | hospitals.id                  | NO          |
| wards                             | 4                | display_order           | integer                     |     |                               | NO          |
| wards                             | 5                | status                  | text                        |     |                               | YES         |
| wards                             | 6                | note                    | text                        |     |                               | YES         |