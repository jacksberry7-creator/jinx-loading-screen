// Garry's Mod Loading Screen API integration

// Variables to track loading progress
let filesTotal = 0;
let filesNeeded = 0;
let filesDownloaded = 0;

// DOM Elements
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const percentageText = document.getElementById('percentage');
const mapNameText = document.getElementById('mapname');

// Update the visible progress bar
function updateProgress() {
    if (filesTotal > 0) {
        // Calculate percentage based on how many files remain compared to the total
        let currentProgress = filesTotal - filesNeeded;
        let percent = Math.floor((currentProgress / filesTotal) * 100);
        
        // Ensure percent stays between 1 and 100 smoothly
        percent = Math.max(0, Math.min(100, percent));
        
        progressBar.style.width = percent + '%';
        percentageText.innerText = percent + '%';
    }
}

// Garry's Mod automatically calls these functions from C++ during the loading sequence:

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
    if (mapname) {
        mapNameText.innerText = mapname.toUpperCase();
    }
}

function DownloadingFile(fileName) {
    // If we're downloading, update the status
    statusText.innerText = 'Downloading: ' + fileName;
    
    // Sometimes GMod is tricky, so if we download a file, decrement the needed files
    if (filesNeeded > 0) {
        filesNeeded--;
        updateProgress();
    }
}

function SetStatusChanged(status) {
    // Things like 'Sending client info', 'Mounting add-ons', etc.
    statusText.innerText = status;
}

function SetFilesTotal(total) {
    filesTotal = total;
    updateProgress();
}

function SetFilesNeeded(needed) {
    filesNeeded = needed;
    updateProgress();
}

// To allow testing in browser without Garry's mod, here's a mock loading sequence if GameDetails isn't called:
setTimeout(() => {
    if(mapNameText.innerText === 'Retrieving coordinates...') {
        // We aren't in Garry's Mod
        console.log("Mocking Garry's Mod loading sequence for testing in browser...");
        GameDetails("Jinx Server", "", "rp_starwars_v1", 64, "STEAM_ID", "starwarsrp", 1, "en");
        SetFilesTotal(100);
        SetFilesNeeded(100);
        
        let mockProgress = 100;
        let interval = setInterval(() => {
            mockProgress--;
            DownloadingFile("models/player/clone_trooper.mdl");
            SetFilesNeeded(mockProgress);
            
            if(mockProgress <= 0) {
                SetStatusChanged("Sending client info...");
                clearInterval(interval);
            }
        }, 50);
    }
}, 1000);
