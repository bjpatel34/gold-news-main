-- Drop the security definer view and recreate as SECURITY INVOKER
DROP VIEW IF EXISTS public.latest_metal_prices;

CREATE OR REPLACE VIEW public.latest_metal_prices 
WITH (security_invoker = true) AS
SELECT DISTINCT ON (metal_id)
  id,
  metal_id,
  metal_name,
  metal_name_hindi,
  symbol,
  today_price,
  yesterday_price,
  price_change,
  change_percent,
  unit,
  high_24h,
  low_24h,
  fetched_at,
  created_at,
  updated_at
FROM public.metal_prices
ORDER BY metal_id, fetched_at DESC;