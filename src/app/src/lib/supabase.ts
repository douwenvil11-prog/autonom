import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'COLE_AQUI_A_SUA_URL';
const supabaseKey = 'COLE_AQUI_A_SUA_CHAVE_SB';

export const supabase = createClient(supabaseUrl, supabaseKey);
