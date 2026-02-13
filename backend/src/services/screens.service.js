const { supabase } = require('../config/supabase');
const { generateDeviceCode } = require('../utils/helpers');

class ScreensService {
  /**
   * Get all screens
   */
  static async getAllScreens() {
    const { data: screens, error } = await supabase
      .from('screens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch screens: ${error.message}`);
    }

    return screens || [];
  }

  /**
   * Get screen by ID
   */
  static async getScreenById(id) {
    const { data: screen, error } = await supabase
      .from('screens')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !screen) {
      throw new Error('Screen not found');
    }

    return screen;
  }

  /**
   * Get screen by device code
   */
  static async getScreenByDeviceCode(deviceCode) {
    const { data: screen, error } = await supabase
      .from('screens')
      .select('*')
      .eq('device_code', deviceCode)
      .single();

    if (error || !screen) {
      throw new Error('Screen not found');
    }

    return screen;
  }

  /**
   * Create a new screen
   */
  static async createScreen(screenData) {
    // Generate unique device code
    let deviceCode;
    let isUnique = false;
    
    // Keep generating until we get a unique code
    do {
      deviceCode = generateDeviceCode();
      const { data: existing } = await supabase
        .from('screens')
        .select('id')
        .eq('device_code', deviceCode)
        .single();
      
      isUnique = !existing;
    } while (!isUnique);

    // Insert new screen
    const { data: screen, error } = await supabase
      .from('screens')
      .insert([{
        name: screenData.name,
        location: screenData.location,
        device_code: deviceCode
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create screen: ${error.message}`);
    }

    return screen;
  }

  /**
   * Update screen
   */
  static async updateScreen(id, updates) {
    const { data: screen, error } = await supabase
      .from('screens')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update screen: ${error.message}`);
    }

    return screen;
  }

  /**
   * Delete screen
   */
  static async deleteScreen(id) {
    const { error } = await supabase
      .from('screens')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete screen: ${error.message}`);
    }
  }
}

module.exports = { ScreensService };
