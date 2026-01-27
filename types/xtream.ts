/**
 * Xtream Codes API Type Definitions
 */

/**
 * Xtream authentication response
 */
export interface XtreamAuthResponse {
  user_info: {
    username: string;
    password: string;
    message?: string;
    auth: number;
    status: string;
    exp_date: string | number;
    is_trial: string | number;
    active_cons: string | number;
    created_at: string | number;
    max_connections: string | number;
    allowed_output_formats: string[];
  };
  server_info: {
    url: string;
    port: string | number;
    https_port: string | number;
    server_protocol: string;
    rtmp_port: string | number;
    timezone: string;
    timestamp_now: number;
    time_now: string;
  };
}

/**
 * Xtream category
 */
export interface XtreamCategory {
  category_id: string | number;
  category_name: string;
  parent_id?: number;
}

/**
 * Xtream live stream
 */
export interface XtreamLiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon?: string;
  epg_channel_id?: string;
  added: string;
  is_adult?: string;
  category_id: string;
  category_ids?: number[];
  custom_sid?: string;
  tv_archive?: number;
  direct_source?: string;
  tv_archive_duration?: number;
}

/**
 * Xtream VOD stream
 */
export interface XtreamVodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon?: string;
  rating?: number | string;
  rating_5based?: number;
  added: string;
  category_id: string;
  category_ids?: number[];
  container_extension: string;
  custom_sid?: string;
  direct_source?: string;
  tmdb_id?: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  release_date?: string;
  backdrop_path?: string[];
  youtube_trailer?: string;
  episode_run_time?: string;
  cover?: string;
  duration?: string;
  duration_secs?: number;
  bitrate?: number;
}

/**
 * Xtream series stream
 */
export interface XtreamSeriesStream {
  num: number;
  name: string;
  series_id: number;
  cover?: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  last_modified: string;
  rating?: number | string;
  rating_5based?: number;
  backdrop_path?: string[];
  youtube_trailer?: string;
  episode_run_time?: string;
  category_id: string;
  category_ids?: number[];
}

/**
 * Xtream series info
 */
export interface XtreamSeriesInfo {
  seasons: XtreamSeason[];
  info: {
    name: string;
    cover?: string;
    plot?: string;
    cast?: string;
    director?: string;
    genre?: string;
    releaseDate?: string;
    last_modified?: string;
    rating?: number | string;
    rating_5based?: number;
    backdrop_path?: string[];
    youtube_trailer?: string;
    episode_run_time?: string;
    category_id?: string;
    tmdb_id?: string;
  };
  episodes: Record<string, XtreamEpisode[]>;
}

/**
 * Xtream season
 */
export interface XtreamSeason {
  air_date?: string;
  episode_count: number;
  id: number;
  name: string;
  overview?: string;
  season_number: number;
  cover?: string;
  cover_big?: string;
}

/**
 * Xtream episode
 */
export interface XtreamEpisode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    air_date?: string;
    crew?: string;
    rating?: number | string;
    id?: string | number;
    movie_image?: string;
    duration_secs?: number;
    duration?: string;
    video?: any;
    audio?: any;
    bitrate?: number;
    plot?: string;
    season?: number;
    episode_num?: number;
    name?: string;
    cover_big?: string;
  };
  custom_sid?: string;
  added?: string;
  season: number;
  direct_source?: string;
}

/**
 * Xtream VOD info
 */
export interface XtreamVodInfo {
  info: {
    tmdb_id?: string;
    name: string;
    o_name?: string;
    cover_big?: string;
    movie_image?: string;
    releasedate?: string;
    episode_run_time?: string;
    youtube_trailer?: string;
    director?: string;
    actors?: string;
    cast?: string;
    description?: string;
    plot?: string;
    age?: string;
    mpaa_rating?: string;
    rating_5based?: number;
    rating?: number | string;
    country?: string;
    genre?: string;
    backdrop_path?: string[];
    duration_secs?: number;
    duration?: string;
    video?: any;
    audio?: any;
    bitrate?: number;
  };
  movie_data: {
    stream_id: number;
    name: string;
    added: string;
    category_id: string;
    category_ids?: number[];
    container_extension: string;
    custom_sid?: string;
    direct_source?: string;
  };
}

/**
 * Xtream credentials
 */
export interface XtreamCredentials {
  serverUrl: string;
  username: string;
  password: string;
}
