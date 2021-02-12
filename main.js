const {app, protocol, ipcMain, session, BrowserWindow} = require('electron')
const {readFileSync} = require('fs') // used to read files
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs') // used to read files

const http = require("http");
const https = require("https");
const url = require("url");
const async = require('async');
const crypto = require('crypto');
// const DownloadManager = require("electron-download-manager");

// const {download} = require("electron-dl");

var dataPath;
var wordsJSON;
var categoriesJSON;
var MainWin;
var newGuest;
var LesonParameters;
// function to read from a json file
function readWords() {
	const data = readFileSync(path.join(dataPath, 'words.json'), 'utf8')
	return data
}

function readOpposites() {
	// const data = readFileSync(path.join(dataPath, 'opposites.json'), 'utf8')
	const data = readFileSync('./opposites.json', 'utf8')
	return data
}

function fileHash(filename, algorithm = 'md5') {
	return new Promise((resolve, reject) => {
		// Algorithm depends on availability of OpenSSL on platform
		// Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
		let shasum = crypto.createHash(algorithm);
		try {
			let s = fs.ReadStream(filename)
			s.on('data', function (data) {
				shasum.update(data)
			})
			// making digest
			s.on('end', function () {
				const hash = shasum.digest('hex')
				return resolve(hash);
			})
		} catch (error) {
			return reject('calc fail');
		}
	});
}


var download = function (url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = https.get(url, function (response) {
		response.pipe(file);
		file.on('finish', function () {
			console.log(url + " downloaded to " + dest);
			file.close(cb);  // close() is async, call cb after close completes.
		});
	}).on('error', function (err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});
};



function createChildWindow(url) {

console.log("NEW : "+url);
	newGuest = new BrowserWindow({
		parent: MainWin,
		width: 1280,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: false,
			nativeWindowOpen: true
		}
	})
	newGuest.webContents.openDevTools({mode: 'bottom'});
	newGuest.loadFile(url);

}

function createWindow() {
	MainWin = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true
		}
	})
	MainWin.webContents.openDevTools({mode: 'bottom'})

	MainWin.loadFile('index.html')

	protocol.registerFileProtocol('poster', (request, callback) => {
		const url = request.url.substr(9);
		console.log("poster url" + url);
		callback({path: path.normalize(app.getPath('userData') + "/" + url)})
	});

	// protocol.registerBufferProtocol('poster',
	// 	(request, callback) => {
	// 		const url = request.url.substr(9, request.url.length - 10);
	//
	// 		const uri = request.url;
	// 		if (uri) {
	// 			// callback({ mimeType: 'text/plain', data: Buffer.from(uri) });
	// 			callback({path: app.getPath('userData')  + url});
	// 		}
	// 		else {
	// 			callback({ error: -324 }); // EMPTY_RESPONSE
	// 		}
	// 	});

	// protocol.registerStandardSchemes(['poster'])

	dataPath = app.getPath('userData')
	console.log(dataPath);

	// Main process

	function log_and_reply(event,msg) {
		console.log(msg)
		event.reply('refresh-data-updated', msg);
	}

	ipcMain.on('refresh-data-start', (event, arg) => {
		console.log(arg) // prints "ping"

//--------------------------------------------------------------------------------------------------------------
// download the data
		console.log("-----------------------------");
		log_and_reply(event,path.join(dataPath, "audio"));

		mkdirp(path.join(dataPath, "audio")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio") + " folder made"));

		mkdirp(path.join(dataPath, "audio" + path.sep + "tr")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio" + path.sep + "tr") + " made"));

		mkdirp(path.join(dataPath, "audio" + path.sep + "en")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio" + path.sep + "en") + " made"));

		mkdirp(path.join(dataPath, "audio" + path.sep + "ch")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio" + path.sep + "ch") + " made"));

		mkdirp(path.join(dataPath, "video")).then(made =>
			log_and_reply(event,path.join(dataPath, "video") + " folder made"));

		mkdirp(path.join(dataPath, "pictures")).then(made =>
			log_and_reply(event,path.join(dataPath, "pictures") + " folder made"));

		mkdirp(path.join(dataPath, "pictures" + path.sep + "svg")).then(made =>
			log_and_reply(event,path.join(dataPath, "pictures" + path.sep + "svg") + " folder made"));

		mkdirp(path.join(dataPath, "audio" + path.sep + "prepositions")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio" + path.sep + "prepositions") + " folder made"));

		mkdirp(path.join(dataPath, "audio" + path.sep + "opposites")).then(made =>
			log_and_reply(event,path.join(dataPath, "audio" + path.sep + "opposites") + " folder made"));

		log_and_reply(event,"try remove temp words2.json");
		try {
			fs.unlinkSync(path.join(dataPath, "words2.json"));
		} catch (err) {
			log_and_reply(event,err);
		}

		log_and_reply(event,"download words.json");

		// DownloadManager.register({downloadFolder: dataPath});


		download("https://elosoft.tw/picture-dictionary-editor/dictionary/data.php", path.join(dataPath, "words2.json"), function () {

			if (fs.existsSync(path.join(dataPath, "words2.json"))) {

				fs.copyFile(path.join(dataPath, "words2.json"), path.join(dataPath, "words.json"), (err) => {
					if (err) throw err;
					log_and_reply(event,'words2.json was copied to words.json');

					fs.readFile(path.join(dataPath, 'words.json'), 'utf-8', (err, data) => {
						if (err) throw err;
						wordsJSON = JSON.parse(data);

						async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {

							if (SingleWordsJSON.picture !== null && SingleWordsJSON.picture !== "") {

								if (fs.existsSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture))) {
									var file_data = fs.readFileSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture));
									var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
									if (file_hash !== SingleWordsJSON.picture_hash) {
										log_and_reply(event,SingleWordsJSON.picture + " changed. Downloading...");
										download("https://elosoft.tw/picture-dictionary-editor/pictures/" + SingleWordsJSON.picture, path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture), function (err) {
											if (err) {
												log_and_reply(event,err);
											}
											log_and_reply(event,SingleWordsJSON.picture + " downloaded.");
											callback();
										});
									}
									else {
										callback();
									}
								}
								else if (!fs.existsSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture))) {
									log_and_reply(event,SingleWordsJSON.picture + " not found. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/pictures/" + SingleWordsJSON.picture, path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture), function (err) {
										if (err) {
											log_and_reply(event,err);
										}
										log_and_reply(event,SingleWordsJSON.picture + " downloaded.");
										callback();
									});
								}
								else {
									callback();
								}
							}
							else {
								callback();
							}
						},function () {
							log_and_reply(event,"pictures download finished.");
						});


						async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
							if (SingleWordsJSON.audio_TR !== null && SingleWordsJSON.audio_TR !== "" && (1 === 1)) {

								if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR))) {
									var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR));
									var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
									if (file_hash !== SingleWordsJSON.audio_tr_hash) {
										log_and_reply(event,SingleWordsJSON.audio_TR + " changed. Downloading...");
										download("https://elosoft.tw/picture-dictionary-editor/audio/tr/" + SingleWordsJSON.audio_TR, path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR), function (err) {
											if (err) {
												log_and_reply(event,err);
											}
											log_and_reply(event,SingleWordsJSON.audio_TR + " downloaded.");
											callback();
										});
									}
									else {
										callback();
									}
								}
								else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR))) {
									log_and_reply(event,SingleWordsJSON.audio_TR + " not found. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/tr/" + SingleWordsJSON.audio_TR, path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR), function (err) {
										if (err) {
											log_and_reply(event,err);
										}
										log_and_reply(event,SingleWordsJSON.audio_TR + " downloaded.");
										callback();
									});
								}
								else {
									callback();
								}
							}
							else {
								callback();
							}
						},function () {
							log_and_reply(event,"audio tr download finished.");
						});

						async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
							if (SingleWordsJSON.audio_EN !== null && SingleWordsJSON.audio_EN !== "" && (1 === 1)) {
								if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN))) {
									var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN));
									var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
									if (file_hash !== SingleWordsJSON.audio_en_hash) {
										log_and_reply(event,SingleWordsJSON.audio_EN + " not found. Downloading...");
										download("https://elosoft.tw/picture-dictionary-editor/audio/en/" + SingleWordsJSON.audio_EN, path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN), function (err) {
											if (err) {
												log_and_reply(event,err);
											}
											log_and_reply(event,SingleWordsJSON.audio_EN + " downloaded.");
											callback();
										});
									}
									else {
										callback();
									}
								}
								else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN))) {
									log_and_reply(event,SingleWordsJSON.audio_EN + " not found. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/en/" + SingleWordsJSON.audio_EN, path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN), function (err) {
										if (err) {
											log_and_reply(event,err);
										}
										log_and_reply(event,SingleWordsJSON.audio_EN + " downloaded.");
										callback();
									});
								}
								else {
									callback();
								}
							}
							else {
								callback();
							}
						},function () {
							log_and_reply(event,"audio en download finished.");
						});

						async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
							if (SingleWordsJSON.audio_CH !== null && SingleWordsJSON.audio_CH !== "" && (1 === 1)) {
								if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH))) {
									var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH));
									var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
									if (file_hash !== SingleWordsJSON.audio_ch_hash) {
										log_and_reply(event,SingleWordsJSON.audio_CH + " changed. Downloading...");
										download("https://elosoft.tw/picture-dictionary-editor/audio/ch/" + SingleWordsJSON.audio_CH, path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH), function (err) {
											if (err) {
												log_and_reply(event,err);
											}
											log_and_reply(event,SingleWordsJSON.audio_CH + " downloaded.");
											callback();
										});
									}
									else {
										callback();
									}
								}
								else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH))) {
									log_and_reply(event,SingleWordsJSON.audio_CH + " not found. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/ch/" + SingleWordsJSON.audio_CH, path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH), function (err) {
										if (err) {
											log_and_reply(event,err);
										}
										log_and_reply(event,SingleWordsJSON.audio_CH + " downloaded.");
										callback();
									});
								}
								else {
									callback();
								}
							}
							else {
								callback();
							}
						},function () {
							log_and_reply(event,"audio ch download finished.");
						});
					});
				});
			}
			else {
				log_and_reply(event,path.join(dataPath, "words2.json") + " cant be read error.");
				// The check failed
			}
		});

		log_and_reply(event,"downloading categories...");

		log_and_reply(event,"try remove temp categories2.json");
		try {
			fs.unlinkSync(path.join(dataPath, "categories2.json"));
		} catch (err) {
			log_and_reply(event,err);
		}


		download("https://elosoft.tw/picture-dictionary-editor/categories/data.php", path.join(dataPath, "categories2.json"), function () {

			if (fs.existsSync(path.join(dataPath, "categories2.json"))) {

				fs.copyFile(path.join(dataPath, "categories2.json"), path.join(dataPath, "categories.json"), (err) => {
					if (err) throw err;
					log_and_reply(event,path.join(dataPath, 'categories2.json') + ' was copied to ' + path.join(dataPath, 'categories.json'));

					fs.readFile(path.join(dataPath, 'categories.json'), 'utf-8', (err, data) => {
						if (err) throw err;
						categoriesJSON = JSON.parse(data);
						log_and_reply(event,"categories download finished.");
//        console.log(categoriesJSON);
					});
				});
			}
			else {
				log_and_reply(event,path.join(dataPath, "categories2.json") + " cant be read error.");
				// The check failed
			}
		});

		log_and_reply(event,'data refresh initiated.');
	});

}

app.whenReady().then(createWindow)

//const content = new Buffer("you've been conned!");

ipcMain.on('get-lesson-parameters', (event, arg) => {
	event.returnValue = LesonParameters;
});

ipcMain.on('set-lesson-parameters', (event, arg) => {
	LesonParameters = arg;
});


ipcMain.on('load-lesson', (event, arg) => {
	createChildWindow(arg);
})


ipcMain.on('get-all-words', (event, arg) => {
	console.log(arg)
	event.returnValue = readWords()
})

ipcMain.on('get-all-opposites', (event, arg) => {
	console.log(arg)
	event.returnValue = readOpposites()
})


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
