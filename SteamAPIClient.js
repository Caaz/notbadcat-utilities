const axios = require('axios');

class SteamAPIClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Error: API key is required to initialize SteamAPIClient.');
        }
        this.apiKey = apiKey;
    }

    async getWorkshopInfo(workshopId) {
        try {
            const response = await axios({
                method: 'post',
                url: 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    itemcount: 1,
                    "publishedfileids[0]": workshopId,
                    key: this.apiKey
                }
            });
            return response.data.response.publishedfiledetails[0];
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    async getUserInfo(userId) {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
                params: {
                    key: this.apiKey,
                    steamids: userId
                }
            });
            return response.data.response.players[0];
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

module.exports = SteamAPIClient;