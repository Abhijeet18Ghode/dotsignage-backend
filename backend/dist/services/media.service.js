"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const supabase_1 = require("../config/supabase");
const helpers_1 = require("../utils/helpers");
class MediaService {
    /**
     * Get all media files
     */
    static async getAllMedia() {
        const { data: media, error } = await supabase_1.supabase
            .from('media')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch media: ${error.message}`);
        }
        return media || [];
    }
    /**
     * Get media by ID
     */
    static async getMediaById(id) {
        const { data: media, error } = await supabase_1.supabase
            .from('media')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !media) {
            throw new Error('Media not found');
        }
        return media;
    }
    /**
     * Upload media file to Supabase Storage and create database record
     */
    static async uploadMedia(file, name, duration) {
        try {
            // Generate unique filename
            const filename = (0, helpers_1.generateUniqueFilename)(file.originalname);
            const filePath = `media/${filename}`;
            // Upload file to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase_1.supabase.storage
                .from('media')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });
            if (uploadError) {
                throw new Error(`Failed to upload file: ${uploadError.message}`);
            }
            // Get file type
            const fileType = (0, helpers_1.getFileType)(file.mimetype);
            // Create media record in database
            const { data: media, error: dbError } = await supabase_1.supabase
                .from('media')
                .insert([{
                    name,
                    file_path: filePath,
                    file_type: fileType,
                    file_size: file.size,
                    duration: duration || (fileType === 'image' ? 5 : 10) // Default duration
                }])
                .select()
                .single();
            if (dbError) {
                // If database insert fails, clean up uploaded file
                await supabase_1.supabase.storage.from('media').remove([filePath]);
                throw new Error(`Failed to create media record: ${dbError.message}`);
            }
            return media;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get public URL for media file
     */
    static async getMediaUrl(filePath) {
        const { data } = supabase_1.supabase.storage
            .from('media')
            .getPublicUrl(filePath);
        return data.publicUrl;
    }
    /**
     * Delete media file and database record
     */
    static async deleteMedia(id) {
        // Get media record first
        const media = await this.getMediaById(id);
        // Delete from storage
        const { error: storageError } = await supabase_1.supabase.storage
            .from('media')
            .remove([media.file_path]);
        if (storageError) {
            console.warn(`Failed to delete file from storage: ${storageError.message}`);
        }
        // Delete from database
        const { error: dbError } = await supabase_1.supabase
            .from('media')
            .delete()
            .eq('id', id);
        if (dbError) {
            throw new Error(`Failed to delete media record: ${dbError.message}`);
        }
    }
    /**
     * Update media metadata
     */
    static async updateMedia(id, updates) {
        const { data: media, error } = await supabase_1.supabase
            .from('media')
            .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to update media: ${error.message}`);
        }
        return media;
    }
}
exports.MediaService = MediaService;
