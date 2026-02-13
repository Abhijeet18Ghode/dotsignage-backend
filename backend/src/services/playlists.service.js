const { supabase } = require('../config/supabase');

class PlaylistsService {
  /**
   * Get all playlists
   */
  static async getAllPlaylists() {
    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch playlists: ${error.message}`);
    }

    return playlists || [];
  }

  /**
   * Get playlist by ID with media
   */
  static async getPlaylistById(id) {
    // Get playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single();

    if (playlistError || !playlist) {
      throw new Error('Playlist not found');
    }

    // Get playlist media with media details
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
      .eq('playlist_id', id)
      .order('order_index', { ascending: true });

    if (mediaError) {
      throw new Error(`Failed to fetch playlist media: ${mediaError.message}`);
    }

    // Transform the data
    const media = (playlistMedia || []).map((item) => ({
      ...item.media,
      order_index: item.order_index
    }));

    return {
      ...playlist,
      media
    };
  }

  /**
   * Create a new playlist
   */
  static async createPlaylist(playlistData) {
    // Create playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .insert([{
        name: playlistData.name,
        description: playlistData.description
      }])
      .select()
      .single();

    if (playlistError) {
      throw new Error(`Failed to create playlist: ${playlistError.message}`);
    }

    // Add media to playlist if provided
    if (playlistData.media_ids && playlistData.media_ids.length > 0) {
      await this.updatePlaylistMedia(playlist.id, playlistData.media_ids);
    }

    // Return playlist with media
    return this.getPlaylistById(playlist.id);
  }

  /**
   * Update playlist media order
   */
  static async updatePlaylistMedia(playlistId, mediaIds) {
    // Remove existing media from playlist
    const { error: deleteError } = await supabase
      .from('playlist_media')
      .delete()
      .eq('playlist_id', playlistId);

    if (deleteError) {
      throw new Error(`Failed to clear playlist media: ${deleteError.message}`);
    }

    // Add new media with order
    if (mediaIds.length > 0) {
      const playlistMediaData = mediaIds.map((mediaId, index) => ({
        playlist_id: playlistId,
        media_id: mediaId,
        order_index: index
      }));

      const { error: insertError } = await supabase
        .from('playlist_media')
        .insert(playlistMediaData);

      if (insertError) {
        throw new Error(`Failed to add media to playlist: ${insertError.message}`);
      }
    }
  }

  /**
   * Update playlist details
   */
  static async updatePlaylist(id, updates) {
    const { data: playlist, error } = await supabase
      .from('playlists')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update playlist: ${error.message}`);
    }

    return playlist;
  }

  /**
   * Delete playlist
   */
  static async deletePlaylist(id) {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete playlist: ${error.message}`);
    }
  }
}

module.exports = { PlaylistsService };
