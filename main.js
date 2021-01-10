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

const DownloadManager = require("electron-download-manager");

// const {download} = require("electron-dl");

var dataPath;

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

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true
		}
	})
	// win.webContents.openDevTools({mode: 'bottom'})

	win.loadFile('index.html')

	win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
		console.log(url + "   === " + frameName);
		// if (frameName === 'modal') {
		// open window as modal
		event.preventDefault()
		Object.assign(options, {
			// modal: true,
			parent: win,
			width: 1280,
			height: 800,
			webPreferences: {
				nodeIntegration: true,
				nativeWindowOpen: true
			}
		})
		event.newGuest = new BrowserWindow(options)
		// event.newGuest.webContents.openDevTools({mode: 'bottom'})
		// }
	})

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

//--------------------------------------------------------------------------------------------------------------
// download the data
	console.log("-----------------------------");
	dataPath = app.getPath('userData')
	console.log(dataPath);
	console.log(path.join(dataPath, "audio"));

	mkdirp(path.join(dataPath, "audio")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "audio" + path.sep + "tr")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "audio" + path.sep + "en")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "audio" + path.sep + "ch")).then(made =>
		console.log(`made directories, starting with ${made}`));


	mkdirp(path.join(dataPath, "video")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "pictures")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "pictures" + path.sep + "svg")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "audio" + path.sep + "prepositions")).then(made =>
		console.log(`made directories, starting with ${made}`));

	mkdirp(path.join(dataPath, "audio" + path.sep + "opposites")).then(made =>
		console.log(`made directories, starting with ${made}`));

	console.log("try remove temp words2.json");
	try {
		fs.unlinkSync(path.join(dataPath, "words2.json"));
	} catch (err) {
		console.error(err);
	}

	console.log("download words.json");

	DownloadManager.register({downloadFolder: dataPath});


	download("https://elosoft.tw/picture-dictionary-editor/dictionary/data.php", path.join(dataPath, "words2.json"), function () {

		if (fs.existsSync(path.join(dataPath, "words2.json"))) {

			fs.copyFile(path.join(dataPath, "words2.json"), path.join(dataPath, "words.json"), (err) => {
				if (err) throw err;
				console.log('words2.json was copied to words.json');

				fs.readFile(path.join(dataPath, 'words.json'), 'utf-8', (err, data) => {
					if (err) throw err;
					wordsJSON = JSON.parse(data);

					async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {

						if (SingleWordsJSON.picture !== null && SingleWordsJSON.picture !== "") {

							if (fs.existsSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture))) {
								var file_data = fs.readFileSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture));
								var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
								if (file_hash !== SingleWordsJSON.picture_hash) {
									console.log(SingleWordsJSON.picture + " changed. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/pictures/" + SingleWordsJSON.picture, path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture), function (err) {
										if (err) {
											console.log(err);
										}
										callback();
									});
								}
								else {
									callback();
								}
							}
							else if (!fs.existsSync(path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture))) {
								console.log(SingleWordsJSON.picture + " not found. Downloading...");
								download("https://elosoft.tw/picture-dictionary-editor/pictures/" + SingleWordsJSON.picture, path.join(dataPath, "pictures" + path.sep + SingleWordsJSON.picture), function (err) {
									if (err) {
										console.log(err);
									}
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
					});


					async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
						if (SingleWordsJSON.audio_TR !== null && SingleWordsJSON.audio_TR !== "" && (1 === 1)) {

							if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR))) {
								var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR));
								var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
								if (file_hash !== SingleWordsJSON.audio_tr_hash) {
									console.log(SingleWordsJSON.audio_TR + " changed. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/tr/" + SingleWordsJSON.audio_TR, path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR), function (err) {
										if (err) {
											console.log(err);
										}
										callback();
									});
								}
								else {
									callback();
								}
							}
							else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR))) {
								console.log(SingleWordsJSON.audio_TR + " not found. Downloading...");
								download("https://elosoft.tw/picture-dictionary-editor/audio/tr/" + SingleWordsJSON.audio_TR, path.join(dataPath, "audio" + path.sep + "tr" + path.sep + SingleWordsJSON.audio_TR), function (err) {
									if (err) {
										console.log(err);
									}
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
					});

					async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
						if (SingleWordsJSON.audio_EN !== null && SingleWordsJSON.audio_EN !== "" && (1 === 1)) {
							if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN))) {
								var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN));
								var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
								if (file_hash !== SingleWordsJSON.audio_en_hash) {
									console.log(SingleWordsJSON.audio_EN + " not found. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/en/" + SingleWordsJSON.audio_EN, path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN), function (err) {
										if (err) {
											console.log(err);
										}
										callback();
									});
								}
								else {
									callback();
								}
							}
							else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN))) {
								console.log(SingleWordsJSON.audio_EN + " not found. Downloading...");
								download("https://elosoft.tw/picture-dictionary-editor/audio/en/" + SingleWordsJSON.audio_EN, path.join(dataPath, "audio" + path.sep + "en" + path.sep + SingleWordsJSON.audio_EN), function (err) {
									if (err) {
										console.log(err);
									}
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
					});

					async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {
						if (SingleWordsJSON.audio_CH !== null && SingleWordsJSON.audio_CH !== "" && (1 === 1)) {
							if (fs.existsSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH))) {
								var file_data = fs.readFileSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH));
								var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
								if (file_hash !== SingleWordsJSON.audio_ch_hash) {
									console.log(SingleWordsJSON.audio_CH + " changed. Downloading...");
									download("https://elosoft.tw/picture-dictionary-editor/audio/ch/" + SingleWordsJSON.audio_CH, path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH), function (err) {
										if (err) {
											console.log(err);
										}
										callback();
									});
								}
								else {
									callback();
								}
							}
							else if (!fs.existsSync(path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH))) {
								console.log(SingleWordsJSON.audio_CH + " not found. Downloading...");
								download("https://elosoft.tw/picture-dictionary-editor/audio/ch/" + SingleWordsJSON.audio_CH, path.join(dataPath, "audio" + path.sep + "ch" + path.sep + SingleWordsJSON.audio_CH), function (err) {
									if (err) {
										console.log(err);
									}
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
					});
				});
			});
		}
		else {
			console.log(path.join(dataPath, "words2.json") + " cant be read error.");
			// The check failed
		}
	});

	console.log("downloading categories...");

	console.log("try remove temp categories2.json");
	try {
		fs.unlinkSync(path.join(dataPath, "categories2.json"));
	} catch (err) {
		console.error(err);
	}


	download("https://elosoft.tw/picture-dictionary-editor/categories/data.php", path.join(dataPath, "categories2.json"), function () {

		if (fs.existsSync(path.join(dataPath, "categories2.json"))) {

			fs.copyFile(path.join(dataPath, "categories2.json"), path.join(dataPath, "categories.json"), (err) => {
				if (err) throw err;
				console.log(path.join(dataPath, 'categories2.json') + ' was copied to ' + path.join(dataPath, 'categories.json'));

				fs.readFile(path.join(dataPath, 'categories.json'), 'utf-8', (err, data) => {
					if (err) throw err;
					categoriesJSON = JSON.parse(data);
//        console.log(categoriesJSON);
				});
			});
		}
		else {
			console.log(path.join(dataPath, "categories2.json") + " cant be read error.");
			// The check failed
		}
	});
}

app.whenReady().then(createWindow)

//const content = new Buffer("you've been conned!");

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
