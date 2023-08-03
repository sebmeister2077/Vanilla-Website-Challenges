// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log('Hello from Functions!')

serve(() => {
    const data = {
        message: `Hello There!`,
    }

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Client-Info, Authorization, Access-Control-Allow-Origin, ApiKey',
        },
    })
})
