# Table Relations

Generated from Supabase foreign key metadata.

```text
wards
└─ rooms

rooms
└─ devices

stock_areas
└─ devices

device_types
├─ device_models
└─ maintenance_types

devices
├─ device_histories
├─ maintenance_tasks
└─ maintenance_records

users
├─ device_histories
├─ maintenance_tasks
└─ maintenance_records

hospitals
├─ users
├─ wards
├─ rooms
├─ stock_areas
├─ devices
├─ device_types
├─ device_models
├─ maintenance_types
├─ maintenance_tasks
├─ maintenance_records
└─ device_histories
```

---

# Foreign Key Mapping

| Table | Column | References |
|---|---|---|
| rooms | ward_id | wards.id |
| devices | stock_area_id | stock_areas.id |
| devices | room_id | rooms.id |
| device_models | device_type_id | device_types.id |
| maintenance_types | device_type_id | device_types.id |
| device_histories | device_id | devices.id |
| device_histories | user_id | users.id |
| maintenance_tasks | device_id | devices.id |
| maintenance_tasks | assigned_user_id | users.id |
| maintenance_records | task_id | maintenance_tasks.id |
| maintenance_records | completed_by | users.id |
| users | hospital_id | hospitals.id |
| wards | hospital_id | hospitals.id |
| rooms | hospital_id | hospitals.id |
| stock_areas | hospital_id | hospitals.id |
| devices | hospital_id | hospitals.id |
| device_types | hospital_id | hospitals.id |
| device_models | hospital_id | hospitals.id |
| maintenance_types | hospital_id | hospitals.id |
| maintenance_tasks | hospital_id | hospitals.id |
| maintenance_records | hospital_id | hospitals.id |
| device_histories | hospital_id | hospitals.id |

---

# Notes

## Relation Direction

```text
child_table.column
→ parent_table.id
```

Example:

```text
devices.room_id
→ rooms.id
```

Meaning:

- One room can contain many devices.
- Each device belongs to one room.

---

# Architecture Observations

Current schema structure is already fairly normalized.

Key architectural characteristics:

- hospital-centered multi-tenant structure
- device lifecycle tracking
- maintenance workflow support
- user action history tracking
- device type abstraction
- room / ward hierarchy
- stock management separation

This relation document is highly useful for:

- AI-assisted development
- RLS policy design
- migration review
- API route design
- debugging JOIN logic
- onboarding future developers

