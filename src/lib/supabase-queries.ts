import { supabase } from "@/integrations/supabase/client";
import { Monument, MonumentAudio, MonumentGallery, MonumentEmbed } from "@/types/monument";

export async function getMonuments() {
  const { data, error } = await supabase
    .from("monuments")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Monument[];
}

export async function getMonumentBySlug(slug: string) {
  const { data, error } = await supabase
    .from("monuments")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) throw error;
  return data as Monument;
}

export async function getMonumentAudios(monumentId: string) {
  const { data, error } = await supabase
    .from("monument_audios")
    .select("*")
    .eq("monument_id", monumentId)
    .order("language");

  if (error) throw error;
  return data as MonumentAudio[];
}

export async function getMonumentGallery(monumentId: string) {
  const { data, error } = await supabase
    .from("monument_gallery")
    .select("*")
    .eq("monument_id", monumentId)
    .order("created_at");

  if (error) throw error;
  return data as MonumentGallery[];
}

export async function getMonumentEmbeds(monumentId: string) {
  const { data, error } = await supabase
    .from("monument_embeds")
    .select("*")
    .eq("monument_id", monumentId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as MonumentEmbed | null;
}

export async function searchMonuments(query: string) {
  const { data, error } = await supabase
    .from("monuments")
    .select("*")
    .eq("published", true)
    .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
    .order("name");

  if (error) throw error;
  return data as Monument[];
}