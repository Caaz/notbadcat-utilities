#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');

const SteamAPIClient = require('./SteamAPIClient');

const config = require('./config.json');

const client = new SteamAPIClient(config.steamApiKey);
const workshopDir = path.join(__dirname, 'WorkshopItems');
const userDir = path.join(__dirname, 'SteamUsers');

const filePath = process.argv[2];

if (!filePath) {
    console.error('Error: Please provide a path to a text file with a list of workshop URLs as an argument.');
    process.exit(1);
}

async function run(workshopId) {
    try {
        const workshopInfo = await client.getWorkshopInfo(workshopId);
        if (!fs.existsSync(workshopDir)) {
            fs.mkdirSync(workshopDir);
        }
        fs.writeFileSync(path.join(workshopDir, `${workshopId}.json`), JSON.stringify(workshopInfo, null, 2));

        const userId = workshopInfo.creator;
        const userInfo = await client.getUserInfo(userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
        fs.writeFileSync(path.join(userDir, `${userId}.json`), JSON.stringify(userInfo, null, 2));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function main() {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const workshopIds = fileContent.match(/id=\d+/g).map(idString => idString.replace('id=', ''));
        for (const workshopId of workshopIds) {
            await run(workshopId);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function extractAndConvertImages(workshopId) {
    try {
        const workshopInfo = require(path.join(workshopDir, `${workshopId}.json`));
        const imageDir = path.join(workshopDir, workshopId);
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir);
        }
        const imageUrls = workshopInfo.description.match(/\[img\](.+?)\[\/img\]/g);
        if (imageUrls == null)
            return;
        for (const imageUrl of imageUrls) {
            try {
                const url = imageUrl.replace(/\[img\]|\[\/img\]/g, '');
                const fileName = url.match(/\/([^/]+)$/)[1];
                // Ensure that the file name ends in .png
                const filePath = path.join(imageDir, fileName.endsWith('.png') ? fileName : `${fileName}.png`);
                const response = await axios({
                    method: 'get',
                    url: url,
                    responseType: 'arraybuffer'
                });
                await sharp(response.data).toFile(filePath);
            } catch (error) {
                console.error("Error downloading image");
            }
        }
    } catch (error) {
        console.error(error);
    }
}


main();

const workshopIds = fs.readdirSync(workshopDir).map(fileName => fileName.replace('.json', ''));
for (const workshopId of workshopIds) {
    extractAndConvertImages(workshopId);
}