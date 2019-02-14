// initialize
require("dotenv").config();

// environment variables
const apiClientId = process.env.NODE_COTOHA_API_CLIENT_ID;
const apiClientSecret = process.env.NODE_COTOHA_API_CLIENT_SECRET;
const apiTokenUrl = process.env.NODE_COTOHA_API_ACCESS_TOKEN_PUBLISH_URL;
const apiBaseUrl = process.env.NODE_COTOHA_API_BASE_URL;

// definitions
const excludePos = ["格助詞", "連用助詞", "引用助詞", "終助詞"];

// module import
const request = require("request");

// functions
const auth = async () => new Promise((resolve, reject) => {
	const options = {
		url: apiTokenUrl,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"charset": "UTF-8"
		},
		json: {
			"grantType": "client_credentials",
			"clientId": apiClientId,
			"clientSecret": apiClientSecret
		}
	};

	request(options, (error, response, body) => {
		resolve(body.access_token);
	});
});

const parse = async (accessToken, omaeSentence) => new Promise((resolve, reject) => {
	const options = {
		url: `${apiBaseUrl}v1/parse`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"charset": "UTF-8",
			"Authorization": `Bearer ${accessToken}`
		},
		json: {
			"sentence": omaeSentence,
			"type": "default"
		}
	}

	request(options, (error, response, body) => {
		resolve(body);
	});
});

const genshijin = async (omaeSentence) => {
	if (!omaeSentence) return;

	const accessToken = await auth();
	const parsedDocument = await parse(accessToken, omaeSentence);

	let result_list = [];

	parsedDocument["result"].forEach(chunks => {
		chunks["tokens"].forEach(token => {
			if (!excludePos.includes(token["pos"])) {
				result_list.push(token["kana"]);
			}
		});
	});

	return result_list.join(" ");
};


(async () => {
	const argv = process.argv;

	if(argv.length > 2) {
		const sentence = argv[2];
		const genshijinLanguage = await genshijin(sentence);

		console.log(genshijinLanguage);
		return;
	}

	module.exports = genshijin;
})();
