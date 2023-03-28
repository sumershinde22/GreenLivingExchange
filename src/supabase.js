import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aalxystcwlvovcnhewxc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbHh5c3Rjd2x2b3Zjbmhld3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4NDkwODYsImV4cCI6MTk5NDQyNTA4Nn0.emV4U2rD70mMJztHSzV8b1nTPXahD-ErB4c4_Xt1CfY";
const supabase = createClient(
  "https://aalxystcwlvovcnhewxc.supabase.co",
  supabaseKey
);

export default supabase;
