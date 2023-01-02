const fs = require('fs');
const path = require('path');

const SteamAPIClient = require('./SteamAPIClient');

const config = require('./config.json');

const client = new SteamAPIClient(config.steamApiKey);

const workshopId = process.argv[2];

if (!workshopId) {
    console.error('Error: Please provide a Steam Workshop ID as an argument.');
    process.exit(1);
}

async function run() {
    try {
        const workshopInfo = await client.getWorkshopInfo(workshopId);
        const workshopDir = path.join(__dirname, 'WorkshopItems');
        if (!fs.existsSync(workshopDir)) {
            fs.mkdirSync(workshopDir);
        }
        fs.writeFileSync(path.join(workshopDir, `${workshopId}.json`), JSON.stringify(workshopInfo, null, 2));

        const userId = workshopInfo.creator;
        const userInfo = await client.getUserInfo(userId);
        const userDir = path.join(__dirname, 'SteamUsers');
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
        fs.writeFileSync(path.join(userDir, `${userId}.json`), JSON.stringify(userInfo, null, 2));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

run();
