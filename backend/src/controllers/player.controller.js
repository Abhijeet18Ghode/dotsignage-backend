const { PlayerService } = require('../services/player.service');

class PlayerController {
  /**
   * GET /api/player/playlist/:deviceCode
   * Get playlist for device by device code
   */
  static async getPlaylistByDeviceCode(req, res) {
    try {
      const { deviceCode } = req.params;

      if (!deviceCode) {
        res.status(400).json({ error: 'Device code is required' });
        return;
      }

      const playlist = await PlayerService.getPlaylistByDeviceCode(deviceCode);

      if (!playlist) {
        res.status(404).json({ 
          error: 'No playlist assigned to this device',
          deviceCode 
        });
        return;
      }

      // Update screen last seen
      await PlayerService.updateScreenLastSeen(deviceCode);

      res.json({ 
        playlist,
        deviceCode,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Screen not found')) {
        res.status(404).json({ error: 'Invalid device code' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * POST /api/player/heartbeat/:deviceCode
   * Update device last seen timestamp
   */
  static async updateHeartbeat(req, res) {
    try {
      const { deviceCode } = req.params;

      if (!deviceCode) {
        res.status(400).json({ error: 'Device code is required' });
        return;
      }

      await PlayerService.updateScreenLastSeen(deviceCode);

      res.json({ 
        message: 'Heartbeat updated',
        deviceCode,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/player/status/:deviceCode
   * Get device status and assignment info
   */
  static async getDeviceStatus(req, res) {
    try {
      const { deviceCode } = req.params;

      if (!deviceCode) {
        res.status(400).json({ error: 'Device code is required' });
        return;
      }

      const status = await PlayerService.getScreenStatus(deviceCode);

      res.json({
        ...status,
        deviceCode,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Screen not found')) {
        res.status(404).json({ error: 'Invalid device code' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = { PlayerController };
