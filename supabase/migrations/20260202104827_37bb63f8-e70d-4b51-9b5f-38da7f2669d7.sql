-- Create table for storing metal prices
CREATE TABLE public.metal_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metal_id TEXT NOT NULL, -- 'gold', 'silver', 'copper'
  metal_name TEXT NOT NULL,
  metal_name_hindi TEXT NOT NULL,
  symbol TEXT NOT NULL, -- 'XAU', 'XAG', 'XCU'
  today_price NUMERIC NOT NULL, -- Price in INR
  yesterday_price NUMERIC NOT NULL,
  price_change NUMERIC NOT NULL,
  change_percent NUMERIC NOT NULL,
  unit TEXT NOT NULL, -- '10 grams (24K)', 'per kg'
  high_24h NUMERIC,
  low_24h NUMERIC,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying by metal
CREATE INDEX idx_metal_prices_metal_id ON public.metal_prices(metal_id);
CREATE INDEX idx_metal_prices_fetched_at ON public.metal_prices(fetched_at DESC);

-- Enable Row Level Security (public read access for prices)
ALTER TABLE public.metal_prices ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read prices (public data)
CREATE POLICY "Anyone can read metal prices" 
ON public.metal_prices 
FOR SELECT 
USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage prices" 
ON public.metal_prices 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_metal_prices_updated_at
BEFORE UPDATE ON public.metal_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a view for latest prices per metal
CREATE OR REPLACE VIEW public.latest_metal_prices AS
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