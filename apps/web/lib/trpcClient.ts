// tRPC was removed in favour of Supabase. Keeping this file to avoid breaking stale imports.
export function trpcClient() {
	throw new Error('tRPC has been removed. Use the Supabase client in lib/supabaseClient instead.');
}
