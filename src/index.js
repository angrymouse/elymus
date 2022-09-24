import HNSDResolver from "hnsd.js";
import * as IPFS from "ipfs-core";
import pino from "pino";
import fs from "fs";
import path from "path";
import { ClassicLevel } from "classic-level";
import os from "os";
import { PassThrough } from "stream";
import defaultPreferences from "./default-preferences.json" assert { type: "json" };
if (!fs.existsSync(path.join(os.homedir(), "elymus"))) {
	fs.mkdirSync(path.join(os.homedir(), "elymus"));
	fs.mkdirSync(path.join(os.homedir(), "elymus", "logs"));
}
// On first start we don't have folder for Elymus
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
async function start() {
	global.preferences = new ClassicLevel(
		path.join(os.homedir(), "elymus", "preferences-db"),
		{ valueEncoding: "json", createIfMissing: true }
	);
	// Initialize database for preferences
	let missingKeys = [];
	(await global.preferences.getMany(Object.keys(defaultPreferences))).forEach(
		(v, i) => {
			if (v == undefined) {
				missingKeys.push({
					type: "put",
					key: Object.keys(defaultPreferences)[i],
					value: Object.values(defaultPreferences)[i],
				});
			}
		}
	);
	await global.preferences.batch(missingKeys);
	//Record default preferences on cold start/when preferences are deleted
	if (fs.existsSync(path.join(os.homedir(), "elymus", "ipfs"))) {
		fs.rmSync(path.join(os.homedir(), "elymus", "ipfs"), {
			recursive: true,
			force: true,
		});
	}
	// Cleanup IPFS folder after previous run
	global.ipfs = await IPFS.create({
		repoAutoMigrate: true,
		repo: path.join(os.homedir(), "elymus", "ipfs"),
	});
	global.hnsd = new HNSDResolver();
	//Start required daemons
}
start();
