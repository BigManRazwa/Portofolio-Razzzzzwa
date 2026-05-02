const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase environment variables are missing. Image storage will not work.')
}

const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseServiceKey || 'service-key-placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

module.exports = { supabase }
