-- device_types に表示順カラムを追加
ALTER TABLE public.device_types
ADD COLUMN display_order INTEGER;

-- hospital_id ごとに1から連番を設定
WITH ordered_types AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY hospital_id
            ORDER BY id
        ) AS new_order
    FROM public.device_types
)
UPDATE public.device_types AS dt
SET display_order = ot.new_order
FROM ordered_types AS ot
WHERE dt.id = ot.id;

-- NULL を禁止
ALTER TABLE public.device_types
ALTER COLUMN display_order SET NOT NULL;