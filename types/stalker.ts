/**
 * Stalker Portal API Type Definitions
 */

/**
 * Stalker authentication response
 */
export interface StalkerAuthResponse {
  js: {
    token: string;
    random: string;
  };
}

/**
 * Stalker channel/stream item
 */
export interface StalkerChannel {
  id: number;
  name: string;
  cmd: string;
  logo?: string;
  number?: number;
  tv_genre_id?: string;
  censored?: number;
  use_http_tmp_link?: number;
  use_load_balancing?: number;
  volume_correction?: number;
  monitoring_status?: number;
  enable_monitoring?: number;
  enable_balancing?: number;
  modified?: string;
  open?: number;
  allow_pvr?: number;
  allow_local_pvr?: number;
  allow_remote_pvr?: number;
  mc_cmd?: string;
}

/**
 * Stalker movie/VOD item
 */
export interface StalkerMovie {
  id: number;
  name: string;
  cmd: string;
  screenshot_uri?: string;
  o_name?: string;
  description?: string;
  pic?: string;
  cost?: number;
  time?: string;
  age?: string;
  hd?: number;
  genre_id?: string;
  genre_id_1?: string;
  genre_id_2?: string;
  genre_id_3?: string;
  genre_id_4?: string;
  cat_genre_id_1?: string;
  cat_genre_id_2?: string;
  cat_genre_id_3?: string;
  cat_genre_id_4?: string;
  director?: string;
  actors?: string;
  year?: string;
  added?: string;
  country?: string;
  series?: string[];
  censored?: number;
  rating_count_kinopoisk?: number;
  rating_kinopoisk?: number;
  rating_count_imdb?: number;
  rating_imdb?: number;
  rating_count_mpaa?: number;
  rating_mpaa?: number;
  screenshots?: any[];
}

/**
 * Stalker series item
 */
export interface StalkerSeries {
  id: number;
  name: string;
  o_name?: string;
  cover?: string;
  screenshot_uri?: string;
  description?: string;
  genre_id?: string;
  genre_id_1?: string;
  genre_id_2?: string;
  genre_id_3?: string;
  genre_id_4?: string;
  cat_genre_id_1?: string;
  cat_genre_id_2?: string;
  cat_genre_id_3?: string;
  cat_genre_id_4?: string;
  director?: string;
  actors?: string;
  year?: string;
  country?: string;
  duration?: string;
  rating_kinopoisk?: number;
  rating_imdb?: number;
  age?: string;
  last_played?: number;
  series?: StalkerEpisode[];
}

/**
 * Stalker episode item
 */
export interface StalkerEpisode {
  id: number;
  series_id: number;
  season: number;
  name: string;
  o_name?: string;
  cmd: string;
  time?: string;
  added?: string;
}

/**
 * Stalker category/genre
 */
export interface StalkerCategory {
  id: number;
  title: string;
  alias?: string;
  censored?: number;
}

/**
 * Stalker ordered list response
 */
export interface StalkerOrderedListResponse {
  js: {
    data: any[];
    total_items: number;
    max_page_items: number;
    cur_page: number;
    selected_item?: number;
  };
}

/**
 * Stalker create link response
 */
export interface StalkerCreateLinkResponse {
  js: {
    cmd: string;
  };
}

/**
 * Stalker credentials
 */
export interface StalkerCredentials {
  portalUrl: string;
  macAddress: string;
}

/**
 * Stalker season information
 */
export interface StalkerSeason {
  id: number;
  series_id: number;
  season_number: number;
  season_name?: string;
  episode_count?: number;
}
