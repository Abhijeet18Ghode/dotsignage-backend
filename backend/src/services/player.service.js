const { supabase } = require('../config/supabase');
const { MediaService } = require('./media.service');

class PlayerService {
  /**
   * Get playlist assigned to a screen by device code
   */
  static async getPlaylistByDeviceCode(deviceCode) {
    // Get screen by device code
    const { data: screen, error: screenError } = await supabase
      .from('screens')
      .select('id')
      .eq('device_code', deviceCode)
      .eq('is_active', true)
      .single();

    if (screenError || !screen) {
      throw new Error('Screen not found or inactive');
    }

    // Get assigned playlist
    const { data: assignment, error: assignmentError } = await supabase
      .from('screen_assignments')
      .select(`
        playlist:playlist_id (
          id,
          name,
          description,
          is_active,
          created_at,
          updated_at
        )
      `)
      .eq('screen_id', screen.id)
      .single();

    if (assignmentError || !assignment || !assignment.playlist) {
      return null; // No playlist assigned
    }

    const playlist = assignment.playlist;

    // Get playlist media with details
    const { data: playlistMedia, error: mediaError } = await supabase
      .from('playlist_media')
      .select(`
        order_index,
        media:media_id (
          id,
          name,
          file_path,
          file_type,
          file_size,
          duration,
          created_at,
          updated_at
        )
      `)
      .eq('playlist_id', playlist.id)
      .order('order_index', { ascending: true });

    if (mediaError) {
      throw new Error(`Failed to fetch playlist media: ${mediaError.message}`);
    }

    // Transform media data and add public URLs
    const mediaWithUrls = await Promise.all(
      (playlistMedia || []).map(async (item) => {
        const mediaUrl = await MediaService.getMediaUrl(item.media.file_path);
        return {
          ...item.media,
          order_index: item.order_index,
          url: mediaUrl
        };
      })
    );

    return {
      ...playlist,
      media: mediaWithUrls
    };
  }

  /**
   * Update screen last seen timestamp (for monitoring)
   */
  static async updateScreenLastSeen(deviceCode) {
    const { error } = await supabase
      .from('screens')
      .update({ updated_at: new Date().toISOString() })
      .eq('device_code', deviceCode);

    if (error) {
      console.warn(`Failed to update screen last seen: ${error.message}`);
    }
  }

  /**
   * Get screen status by device code
   */
  static async getScreenStatus(deviceCode) {
    // Get screen details
    const { data: screen, error: screenError } = await supabase
      .from('screens')
      .select('*')
      .eq('device_code', deviceCode)
      .single();

    if (screenError || !screen) {
      throw new Error('Screen not found');
    }

    // Check if screen has assigned playlist
    const { data: assignment, error: assignmentError } = await supabase
      .from('screen_assignments')
      .select(`
        playlist:playlist_id (
          name,
          is_active
        )
      `)
      .eq('screen_id', screen.id)
      .single();

    const hasPlaylist = !assignmentError && assignment && assignment.playlist;
    const playlistName = hasPlaylist ? assignment.playlist.name : undefined;

    return {
      screen,
      hasPlaylist: !!hasPlaylist,
      playlistName
    };
  }
}

module.exports = { PlayerService };
