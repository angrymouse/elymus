import HNSDResolver from "hnsd.js";
import * as IPFS from "ipfs-core";
import fs from "fs";
import path from "path";
import { ClassicLevel } from "classic-level";
import os from "os";
import { PassThrough } from "stream";
import defaultPreferences from "./default-preferences.json" assert { type: "json" };
import startServeDaemon from "./serveDaemon.js";
import { request } from "undici";
import open from "open";
if (!fs.existsSync(path.join(os.homedir(), "elymus"))) {
	fs.mkdirSync(path.join(os.homedir(), "elymus"));
	fs.mkdirSync(path.join(os.homedir(), "elymus", "logs"));
}
// ^ On first start we don't have folder for Elymus

async function checkDaemon() {
	try {
		let { body } = await request("http://localhost:1111/api/show");
		if ((await body.json()).okay) {
			console.log(
				"Elymus daemon is already running, opened homepage in default browser"
			);
			return process.exit();
		}
	} catch (e) {
		startDaemon();
	}
}

async function startDaemon() {
	global.preferences = new ClassicLevel(
		path.join(os.homedir(), "elymus", "preferences-db"),
		{ valueEncoding: "json", createIfMissing: true }
	);
	// ^ Initialize database for preferences
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
	// ^ Record default preferences on cold start/when preferences are deleted
	if (fs.existsSync(path.join(os.homedir(), "elymus", "ipfs"))) {
		fs.rmSync(path.join(os.homedir(), "elymus", "ipfs"), {
			recursive: true,
			force: true,
		});
	}
	// ^ Cleanup IPFS folder after previous run
	global.ipfs = await IPFS.create({
		repoAutoMigrate: true,
		repo: path.join(os.homedir(), "elymus", "ipfs"),
	});
	global.hnsd = new HNSDResolver();
	hnsd.launch();
	startServeDaemon();
	// ^ Start required services
}

checkDaemon();
// ^ Checking if Elymus daemon is already running, and running it if not running
