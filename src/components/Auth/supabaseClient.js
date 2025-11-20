import {createClient} from '@supabase/supabase-js'

import {SUPABASE_KEY} from "../../constants/api.js";

const supabaseUrl = 'https://hiyedeydxfvupdkiplmf.supabase.co'

export const supabase = createClient(supabaseUrl, SUPABASE_KEY)