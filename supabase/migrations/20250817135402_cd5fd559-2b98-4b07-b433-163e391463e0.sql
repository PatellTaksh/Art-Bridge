-- Improve transaction RLS policy to be more explicit and secure
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;

-- Create more secure and explicit policies
CREATE POLICY "Users can view transactions they are involved in" 
ON public.transactions 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    (buyer_user_id IS NOT NULL AND auth.uid() = buyer_user_id) 
    OR 
    (seller_user_id IS NOT NULL AND auth.uid() = seller_user_id)
  )
);

CREATE POLICY "Users can create transactions they are involved in" 
ON public.transactions 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (buyer_user_id IS NOT NULL AND auth.uid() = buyer_user_id) 
    OR 
    (seller_user_id IS NOT NULL AND auth.uid() = seller_user_id)
  )
);

-- Ensure only authenticated users can perform these operations
CREATE POLICY "Prevent anonymous access to transactions" 
ON public.transactions 
FOR ALL 
TO anon 
USING (false);