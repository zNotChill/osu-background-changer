const fs = require('fs');
const fetch = require("node-fetch");
const exec = require("child_process").exec;
const {time,duration,timeStr} = require("fancy-time");
const yargs = require("yargs");

const opt = yargs // this IS stupid
	.usage("Usage: -path <value>")
	.options("background", {describe: "Defines the background image, if it exists.", type: "string", demandOption: true})
	.argv;

const config = {
	"data_url": "http://localhost:24050/json",
	"background": opt.background,
}


// https://stackoverflow.com/a/47996795/11917017
function isRunning(win, mac, linux){
    return new Promise(function(resolve, reject){
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
        if(cmd === '' || proc === ''){
            resolve(false)
        }
        exec(cmd, function(err, stdout, stderr) {
            resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
        })
    })
}

isRunning("gosumemory.exe", "gosumemory", "gosumemory").then((v) => {
	if(!v) {
		console.log("gosumemory must be running!");
		process.exit();
	}
	if(!opt.background) { // Fallback event.
		console.log(timeStr(`Background image must be defined! Example: node index --background=background.jpg`));
		process.exit();
	}
	runMain();
});

if(!fs.existsSync(`${config.background}`)) {
	console.log(timeStr(`Background image could not be found, is it called ${config.background}?`));
	process.exit();
}

let imageData = "";

function getBackgroundData() {
	fs.readFile(`${config.background}`, "base64", function(err, data) {
		if(err) {
			console.log(timeStr(`Could not read background image data.`));
			process.exit();
		}
		console.log(timeStr(`Fetched background data`));
		imageData = data;
	});
}

async function runMain() {
	// Must be running because of the above function
	console.log(timeStr("gosumemory detected"));

	getBackgroundData();

	// Attempt to fetch data
	fetch(config.data_url).then(res => res.json()).then(async json => {
		if(!json) {
			console.log(timeStr("Failed to fetch gosumemory data, is your config correct?"));
		}

		console.log(timeStr("Fetched gosumemory data"));
		
		// Get game/map data
		let bmData = json.menu.bm.metadata,
			gameFolder = json.settings.folders.game,
			artist = bmData.artist,
			title = bmData.title,
			mapper = bmData.mapper,
			difficulty = bmData.difficulty,
		 	mapFolderData = json.menu.bm.path

		let songPath = mapFolderData.folder,
			songBG = mapFolderData.bg,
			mapPath = `${gameFolder}\\Songs\\${songPath}`,
			mapP = mapPath + "\\" + songBG
		
		fs.writeFile(mapP, imageData, { encoding: "base64", flag: "w" }, function(err, val) {
			if(err) {	
				console.log(timeStr(`Could not write map background data.`));
				console.log(err);
				process.exit();
			}
			console.log(timeStr(`Successfully wrote to map background of ${artist} - ${title} (mapped by ${mapper}) [${json.menu.bm.id}]`));
		});
	});
}