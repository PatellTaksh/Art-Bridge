-- Create updated profiles table with role support
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'investor';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create artworks table (enhanced version of existing nfts)
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_wallet TEXT,
  price_amount NUMERIC,
  price_denom TEXT DEFAULT 'ETH',
  status TEXT NOT NULL DEFAULT 'available',
  fractions_total INTEGER DEFAULT 1,
  fractions_available INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ETH',
  transaction_type TEXT NOT NULL DEFAULT 'purchase',
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for artworks
DROP POLICY IF EXISTS "Artworks are viewable by everyone" ON public.artworks;
CREATE POLICY "Artworks are viewable by everyone" ON public.artworks FOR SELECT USING (true);
CREATE POLICY "Users can create artworks" ON public.artworks FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Owners can update their artworks" ON public.artworks FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Owners can delete their artworks" ON public.artworks FOR DELETE USING (auth.uid() = owner_user_id);

-- RLS Policies for bids
DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;
CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Users can create bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_user_id);
CREATE POLICY "Users can update their own bids" ON public.bids FOR UPDATE USING (auth.uid() = bidder_user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (
  auth.uid() = buyer_user_id OR auth.uid() = seller_user_id
);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (
  auth.uid() = buyer_user_id OR auth.uid() = seller_user_id
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_artworks_updated_at ON public.artworks;
CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'investor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();