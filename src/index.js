import HNSDResolver from "hnsd.js";
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { PassThrough } = require("stream");
const logger = pino(
	pino.destination(
		path.join(
			require("os").homedir(),
			"elymus-logs",
			"elymus-fastify-log-" + Date.now() + ".txt"
		)
	)
);
