import Fastify from "fastify";
import pino from "pino";
import protocolsHandler from "./protocolsHandler.js";
import path from "path";
import os from "os";
export default async function runDaemon() {
	const logger = pino(
		pino.destination(
			path.join(
				os.homedir(),
				"elymus",
				"logs",
				"elymus-fastify-log-" + Date.now() + ".txt"
			)
		)
	);
	// ^ Logging to file, as we not always have access to stdout
	let fastify = Fastify({ logger });
	fastify.addHook("preHandler", protocolsHandler);
	// ^ Check & handle custom protocols like repens (<resouce>.repens.localhost:1111) or ipfs (<cid>.ipfs.localhost:1111) or arweave (<tx id>.arweave.localhost:1111)
	fastify.listen({ port: 1111 });
}
