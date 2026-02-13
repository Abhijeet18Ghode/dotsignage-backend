"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsController = void 0;
const supabase_1 = require("../config/supabase");
class AssignmentsController {
    /**
     * POST /api/assignments
     * Assign playlist to screen
     */
    static async assignPlaylistToScreen(req, res) {
        try {
            const { screen_id, playlist_id } = req.body;
            // Validate input
            if (!screen_id || !playlist_id) {
                res.status(400).json({ error: 'screen_id and playlist_id are required' });
                return;
            }
            // Check if screen exists
            const { data: screen, error: screenError } = await supabase_1.supabase
                .from('screens')
                .select('id, name')
                .eq('id', screen_id)
                .single();
            if (screenError || !screen) {
                res.status(404).json({ error: 'Screen not found' });
                return;
            }
            // Check if playlist exists
            const { data: playlist, error: playlistError } = await supabase_1.supabase
                .from('playlists')
                .select('id, name')
                .eq('id', playlist_id)
                .single();
            if (playlistError || !playlist) {
                res.status(404).json({ error: 'Playlist not found' });
                return;
            }
            // Remove existing assignment for this screen (one playlist per screen)
            await supabase_1.supabase
                .from('screen_assignments')
                .delete()
                .eq('screen_id', screen_id);
            // Create new assignment
            const { data: assignment, error: assignmentError } = await supabase_1.supabase
                .from('screen_assignments')
                .insert([{ screen_id, playlist_id }])
                .select()
                .single();
            if (assignmentError) {
                res.status(500).json({ error: `Failed to assign playlist: ${assignmentError.message}` });
                return;
            }
            res.status(201).json({
                message: `Playlist "${playlist.name}" assigned to screen "${screen.name}"`,
                assignment
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * GET /api/assignments/screen/:screenId
     * Get screen assignment
     */
    static async getScreenAssignment(req, res) {
        try {
            const { screenId } = req.params;
            const { data: assignment, error } = await supabase_1.supabase
                .from('screen_assignments')
                .select(`
          id,
          assigned_at,
          screen:screen_id (
            id,
            name,
            device_code,
            location
          ),
          playlist:playlist_id (
            id,
            name,
            description,
            is_active
          )
        `)
                .eq('screen_id', screenId)
                .single();
            if (error || !assignment) {
                res.status(404).json({ error: 'No assignment found for this screen' });
                return;
            }
            res.json({ assignment });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * DELETE /api/assignments/screen/:screenId
     * Remove screen assignment
     */
    static async removeScreenAssignment(req, res) {
        try {
            const { screenId } = req.params;
            const { error } = await supabase_1.supabase
                .from('screen_assignments')
                .delete()
                .eq('screen_id', screenId);
            if (error) {
                res.status(500).json({ error: `Failed to remove assignment: ${error.message}` });
                return;
            }
            res.json({ message: 'Screen assignment removed successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AssignmentsController = AssignmentsController;
