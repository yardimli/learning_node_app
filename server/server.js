#!/usr/bin/env node

var fs = require("fs"),
  os = require('os'),
  path = require('path'),
  http = require("http"),
  https = require("https"),
  url = require("url"),
  util = require("util"),
  qs = require("querystring");

var ifaces = os.networkInterfaces();


var log_filename = './logs/serial-server.log';

var robot_webserver_port = 8080;
var localIpAddress = "";
var boundaryID = "BOUNDARY";

var categoriesJSON;
var wordsJSON;

process.on('exit', (code) => {
  console.log('About to exit with code:', code);
});


function log_to_file(logstr) {
  fs.appendFile(log_filename, new Date().toString() + " " + logstr + "\r\n", function (err) {
    if (err) {
//      console.log(err);
    }
    else {
    }
  });
}


console.log("             ");
console.log("IP's available:");
console.log("---------------");

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family) { //} || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    }
    else {
      // this interface has only one ipv4 adress
      console.log("name:" + ifname + " address:" + iface.address);
      if (ifname === "Wi-Fi") {
        localIpAddress = iface.address;
      }
    }
    ++alias;
  });
});

console.log("=============");
console.log("             ");

log_to_file("===================================================================");
log_to_file("starting raspberry-pi-mjpeg-server.js");

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

var LastKeyPress = "";
var Keyboard_Keys = "";
var Correct_Key = "";
var Blink_Delay = 1000;

/**
 * create a server to serve out the motion jpeg images
 */
var server = http.createServer(function (req, res) {

  var queryData = url.parse(decodeURIComponent(req.url), true);

  const xpath = queryData.pathname, query = queryData.query;
  const method = req.method;

  log_to_file("Request received on: " + xpath + " method: " + method + " query: " + JSON.stringify(query));
//  console.log('query: ', query);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }


  var contentType = 'text/html';

  //classic web server
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  if (xpath === "/") {
    fs.readFile('./index.html', function (error, content) {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content, 'utf-8');
    });

  }
  else if (xpath === "/system.txt") {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8',
      'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET',
      'Access-Control-Allow-Headers': '*'
    });

    res.write('system check');
    res.end();
  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/surface_cmd") {

    var robot_cmd_result = [];

    //--------------------------------------------------------------------------------------------------------------
    if (query.cmd === "key_press") {
      console.log("got keypress " + query.key);
      LastKeyPress = query.key;
      robot_cmd_result.push(query.key);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
      });
      res.statusCode = 200;
      res.end(JSON.stringify(robot_cmd_result));
      return;

    }
    else

      //--------------------------------------------------------------------------------------------------------------
    if (query.cmd === "what_key") {
      let LastKeyPress2 = "";
      if (LastKeyPress !== "") {
        LastKeyPress2 = LastKeyPress;
        LastKeyPress = "";
        console.log("got keypress query");
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
      });
      res.statusCode = 200;
      res.end(JSON.stringify({"key": LastKeyPress2}));
      return;
    }
    else

      //--------------------------------------------------------------------------------------------------------------
    if (query.cmd === "what_keys") {

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
      });
      res.statusCode = 200;
      res.end(JSON.stringify({"keys": Keyboard_Keys, "correct_key": Correct_Key, "blink_delay": Blink_Delay}));
      return;
    }
    else

      //--------------------------------------------------------------------------------------------------------------
    if (query.cmd === "keyboard_keys") {

      Keyboard_Keys = query.keys;
      Correct_Key = query.correct_key;
      Blink_Delay = query.blink_delay;
      robot_cmd_result.push(query.keys);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
      });
      res.statusCode = 200;
      res.end(JSON.stringify({"keys": Keyboard_Keys, "correct_key": Correct_Key, "blink_delay": Blink_Delay}));
      return;
    }
    else

      //--------------------------------------------------------------------------------------------------------------
    if (query.cmd === "lookup_ch") {
      // db_ch.all("SELECT * FROM cidian WHERE traditional = '" + query.word + "'", function (err, rows, fields) {
    }

    else {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
      });
      res.statusCode = 200;
      res.end(JSON.stringify(robot_cmd_result));
      return;

    }


  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/download_all_table") {
    const file = fs.createWriteStream("words.json");
    const request = https.get("https://elosoft.tw/picture-dictionary-editor/dictionary/data.php", function (response) {
      response.pipe(file);
    });

    const file2 = fs.createWriteStream("categories.json");
    const request2 = https.get("https://elosoft.tw/picture-dictionary-editor/categories/data.php", function (response) {
      response.pipe(file);
    });
  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/get_all_table") {
    fs.readFile('./words.json', function (error, content) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(content, 'utf-8');
      return;
    });
  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/get_all_categories") {
    fs.readFile('./categories.json', function (error, content) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(content, 'utf-8');
      return;
    });
  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/get_all_opposites") {
    fs.readFile('./opposites.json', function (error, content) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(content, 'utf-8');
      return;
    });
  }

  //--------------------------------------------------------------------------------------------------------------
  else if (xpath === "/health_check") {
    res.statusCode = 200;
    res.end();
    return;
  }
  else {
    var filePath = "";

    if (xpath.indexOf(".") === -1) {
      filePath = ".." + xpath + "index.html";
    }
    else {
      filePath = '..' + xpath; // req.url;
    }

    if (!fs.existsSync(filePath) || (!fs.lstatSync(filePath).isFile())) {
      if (xpath.indexOf(".") === -1) {
        filePath = "." + xpath + "index.html";
      }
      else {
        filePath = "." + xpath; // req.url;
      }
    }

    var extname = path.extname(xpath);
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      case '.mp3':
        contentType = 'audio/mpeg';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.wav':
        contentType = 'audio/wav';
        break;
      case '.ttf':
        contentType = 'application/x-font-ttf';
        break;
      case '.otf':
        contentType = 'application/x-font-opentype';
        break;
      case '.woff':
        contentType = 'application/font-woff';
        break;
      case '.woff2':
        contentType = 'application/font-woff2';
        break;
      case '.eot':
        contentType = 'application/vnd.ms-fontobject';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.zip':
        contentType = 'application/zip';
        break;
    }

    if (!fs.existsSync(filePath) || (!fs.lstatSync(filePath).isFile())) {
      log_to_file(filePath + " doesnt exist.");
      console.log(filePath + " not found!");
      fs.readFile('./404.html', function (error, content) {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content, 'utf-8');
      });
    }

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          log_to_file(filePath + " doesnt exist (2).");
          fs.readFile('./404.html', function (error, content) {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf-8');
          });
        }
        else {
          log_to_file(filePath + " doesnt exist (3).");
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
          res.end();
        }
      }
      else {
        if (contentType === "text/html" || contentType === "text/javascript") {
          content = content.toString().replace(new RegExp("##MYIP##", 'g'), localIpAddress + ':' + robot_webserver_port);
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Expires': 'Mon, 10 Oct 1977 00:00:00 GMT',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Request-Method': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET',
          'Access-Control-Allow-Headers': '*'
        });
        res.end(content, 'utf-8');
      }
    });
  }
  //end classic static web server
  //--------------------------------------------------------------------------------------------------------------
});

//--------------------------------------------------------------------------------------------------------------
server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('http port already in use');
    log_to_file('http port already in use');
  }
  else if (e.code == "EACCES") {
    console.log("Illegal port");
    log_to_file('http Illegal port');
  }
  else {
    console.log("Unknown error");
    log_to_file('http Unknown error');
  }
  process.exit(1);
});


//--------------------------------------------------------------------------------------------------------------
// download the data
if (1===2) {
  console.log("try remove temp words2.json");
  try {
    fs.unlinkSync("words2.json");
  } catch (err) {
    console.error(err);
  }

  console.log("try remove temp categories2.json");
  try {
    fs.unlinkSync("categories2.json");
  } catch (err) {
    console.error(err);
  }

  console.log("download words.json");

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

  download("https://elosoft.tw/picture-dictionary-editor/dictionary/data.php", "words2.json", function () {

    if (fs.existsSync("words2.json")) {

      fs.copyFile("words2.json", "words.json", (err) => {
        if (err) throw err;
        console.log('words2.json was copied to words.json');

        fs.readFile('words.json', 'utf-8', (err, data) => {
          if (err) throw err;
          wordsJSON = JSON.parse(data);

          for (var i = 0; i < wordsJSON.length; i++) {

            if (wordsJSON[i].picture !== null) {
              if (!fs.existsSync("../pictures/" + wordsJSON[i].picture)) {
                console.log(wordsJSON[i].picture + " not found. Downloading...");
                download("https://elosoft.tw/picture-dictionary-editor/pictures/" + wordsJSON[i].picture, "../pictures/" + wordsJSON[i].picture, function () {});
              }
            }


            if (wordsJSON[i].audio_TR !== null) {
              if (!fs.existsSync("../audio/tr/" + wordsJSON[i].audio_TR)) {
                console.log(wordsJSON[i].audio_TR + " not found. Downloading...");
                download("https://elosoft.tw/picture-dictionary-editor/audio/tr/" + wordsJSON[i].audio_TR, "../audio/tr/" + wordsJSON[i].audio_TR, function () {});
              }
            }

            if (wordsJSON[i].audio_EN !== null) {
              if (!fs.existsSync("../audio/en/" + wordsJSON[i].audio_EN)) {
                console.log(wordsJSON[i].audio_EN + " not found. Downloading...");
                download("https://elosoft.tw/picture-dictionary-editor/audio/en/" + wordsJSON[i].audio_EN, "../audio/en/" + wordsJSON[i].audio_EN, function () {});
              }
            }

            if (wordsJSON[i].audio_CH !== null) {
              if (!fs.existsSync("../audio/ch/" + wordsJSON[i].audio_CH)) {
                console.log(wordsJSON[i].audio_CH + " not found. Downloading...");
                download("https://elosoft.tw/picture-dictionary-editor/audio/ch/" + wordsJSON[i].audio_CH, "../audio/ch/" + wordsJSON[i].audio_CH, function () {});
              }
            }
          }
        });

      });

    }
    else {
      console.log("words2.json cant be read error.");
      // The check failed
    }
  });


  console.log("downloading categories...");
  download("https://elosoft.tw/picture-dictionary-editor/categories/data.php", "categories2.json", function () {

    if (fs.existsSync("categories2.json")) {

      fs.copyFile("categories2.json", "categories.json", (err) => {
        if (err) throw err;
        console.log('categories2.json was copied to categories.json');

        fs.readFile('categories.json', 'utf-8', (err, data) => {
          if (err) throw err;
          categoriesJSON = JSON.parse(data);
//        console.log(categoriesJSON);
        });

      });

    }
    else {
      console.log("categories2.json cant be read error.");
      // The check failed
    }
  });
}

//--------------------------------------------------------------------------------------------------------------
// start the server
server.listen(robot_webserver_port);
console.log(" started on http://" + localIpAddress + ":" + robot_webserver_port);
console.log('');



