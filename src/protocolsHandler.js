import fs from "fs";
import * as url from "url";
import path from "path";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
export default function protocolsHandler(request, reply, done) {
	reply.header("Access-Control-Allow-Origin", "*");
	if (!request.hostname.endsWith(".localhost:1111")) {
		return done();
	}
	let normalizedHost = request.hostname.slice(0, -".localhost:1111".length);
	if (normalizedHost.split(".").length != 2) {
		return done();
	}
	let [additionalData, protocol] = normalizedHost.split(".");
	if (!fs.existsSync(path.join(__dirname, "protocols", protocol + ".js"))) {
		return reply.code(406).send('Unsupported protocol, "' + protocol + '"');
	}
	import(path.join("file://", __dirname, "protocols", protocol + ".js")).then(
		(protocolHandler) => {
			protocolHandler = protocolHandler.default;
			protocolHandler(additionalData, request, reply, done);
		}
	);
}
