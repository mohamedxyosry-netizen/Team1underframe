const SUPABASE_URL =
    "https://gzyybadyaunizdlvmcle.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
} else {
    console.error("Supabase library لم يتم تحميلها");
}