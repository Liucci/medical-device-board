alter policy "title"

on public.table_name

to public

using (
    EXISTS (
        SELECT 1
        FROM users
        WHERE (
            users.id = auth.uid()
            AND users.hospital_id = table_name.hospital_id
            AND users.role = 'admin'
        )
    )
);