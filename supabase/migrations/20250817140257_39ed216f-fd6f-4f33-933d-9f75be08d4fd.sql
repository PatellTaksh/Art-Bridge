-- Security Fix: Enable leaked password protection
-- This requires enabling the password strength and leaked password protection feature
-- in the Supabase Auth configuration

-- Enable password strength validation and leaked password protection
-- This will be applied at the authentication service level
UPDATE auth.config 
SET password_min_length = 8, 
    password_check_hibp = true 
WHERE true;