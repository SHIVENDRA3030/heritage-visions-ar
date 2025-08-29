export interface Monument {
  id: string;
  name: string;
  location: string | null;
  build_year: number | null;
  cover_image: string | null;
  historical_details: string | null;
  quick_facts: any | null;
  about: string | null;
  slug: string;
  published: boolean;
  audio_url: string | null;
  model_glb_url: string | null;
  model_usdz_url: string | null;
  type: string | null;
  period: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonumentAudio {
  id: string;
  monument_id: string;
  audio_url: string;
  language: string;
  title: string;
  created_at: string;
}

export interface MonumentGallery {
  id: string;
  monument_id: string;
  image_url: string;
  title: string | null;
  created_at: string;
}

export interface MonumentEmbed {
  id: string;
  monument_id: string;
  sketchfab_embed: string | null;
  google_street_view_embed: string | null;
  youtube_embed: string | null;
  created_at: string;
  updated_at: string;
}