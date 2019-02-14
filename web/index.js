// initialize
require("dotenv").config();

// definitions
const extensionToContentType = {
	'html': 'html',
	'js': 'javascript',
	'css': 'stylesheet'
};

// module import
const http = require('http');
const fs = require("fs");
const url = require("url");

const genshijin = require("../common/genshijin");

// http server
const server = http.createServer();
server.on("request", async (req, res) => {
	const reqUrl = url.parse(req.url, true);

	const pathname = (reqUrl.pathname === "/" ? "/index.html" : reqUrl.pathname);

	if(pathname === "/ajax.json") {
		res.writeHead(200, {
			"Content-Type": "application/json"
		});

		const omaeSentence = reqUrl.query.omaeSentence;

		const content = {
			genshijinSentence: await genshijin(omaeSentence)
		};

		res.end(JSON.stringify(content));

		return;
	}

	const fileExtension = pathname.match(/\.(.*)$/)[1].toLowerCase();

	const responseData = await new Promise((resolve, reject) => {
		fs.readFile(__dirname + pathname, "UTF-8", (error, data) => {
			if(error) {
				reject(data);
				return data;
			}
			resolve(data);
		});
	}).then((data) => {
		res.writeHead(200, {
			"Content-Type": extensionToContentType[fileExtension]
		});
		return data;
	}).catch((data) => {
		res.writeHead(404);
		return data;
	});

	res.end(responseData);
}).listen(3000);
