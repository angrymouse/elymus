const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	ipcMain,
	session,
	protocol,
} = require("electron");
const pino = require("pino");

const fs = require("fs");
const path = require("path");
const logger = pino(
	pino.destination(
		path.join(
			require("os").homedir(),
			"elymus-fastify-log-" + Date.now() + ".txt"
		)
	)
);
protocol.registerSchemesAsPrivileged([
	{
		scheme: "repens",
		privileges: {
			bypassCSP: true,
			secure: true,
			standard: true,
			supportFetchAPI: true,
			allowServiceWorkers: true,
		},
	},
]);
const serve = require("electron-serve");
const loadURL = serve({
	directory: path.join(__dirname, "ui-static", "public"),
});
const unhandled = require("electron-unhandled");

unhandled();
async function startup() {
	let IPFS = await import("ipfs");

	let mime = require("mime");
	let yauzl = require("yauzl");
	let fetchMethods = require("./fetchMethods/combine");
	if (fs.existsSync(path.join(require("os").homedir(), ".elymus-ipfs"))) {
		fs.rmSync(path.join(require("os").homedir(), ".elymus-ipfs"), {
			recursive: true,
			force: true,
		});
	}

	const { dns } = require("bns");

	const resolver = new dns.Resolver({
		tcp: true,
		inet6: true,
		edns: true,
		dnssec: true,
	});
	const util = require("util");

	let { request } = require("undici");

	const Store = require("electron-store");

	let win = null;
	let tray = null;

	let store = new Store({
		watch: true,
		defaults: {
			userSettings: {
				arweaveGateway: "arweave.net",
				skynetPortal: "siasky.net",
				cacheSize: 20,
				handshakeDns: "127.0.0.1:9591",
			},
			setuped: false,
		},
	});

	store.onDidChange("userSettings.handshakeDns", async (v) => {
		resolver.setServers([v]);
	});

	resolver.setServers([await store.get("userSettings.handshakeDns")]);
	const createWindow = () => {
		win = new BrowserWindow({
			title: "Elymus",

			width: 1000,
			height: 700,
			enableLargerThanScreen: true,
			icon: path.join(__dirname, "src", "assets", "logo-01.png"),
			webPreferences: {
				preload: path.join(__dirname, "preload.js"),
				webviewTag: true,
			},
		});
		win.on("close", () => {
			win = null;
		});

		loadURL(win);
	};

	app.on("window-all-closed", () => {
		win = null;
	});
	const fastify = require("fastify")({ logger });

	// Declare a route
	fastify.get("/show", async (request, reply) => {
		if (!win) {
			createWindow();
		} else {
			await win.show();

			await win.setAlwaysOnTop(true);
			win.setAlwaysOnTop(false);
		}
		return { okay: true };
	});

	// Run the server!
	const start = async (app) => {
		try {
			let { body } = await request("http://localhost:11984/show");
			if ((await body.json()).okay) {
				return app.exit();
			}
		} catch (e) {
			try {
				global.ipfs = await IPFS.create({
					repoAutoMigrate: true,
					repo: path.join(require("os").homedir(), ".elymus-ipfs"),
				});
				ipcMain.handle("get-store-value", (event, key) => {
					return store.get(key);
				});
				ipcMain.handle("set-store-values", (event, entries) => {
					return store.set(entries);
				});
				ipcMain.handle("stop-app", () => {
					app.quit();
				});

				protocol.registerBufferProtocol("repens", async (request, callback) => {
					let url = new URL(request.url);

					let domainInfo = await resolver.resolveRaw(url.hostname, "TXT");
					if (url.pathname == "/") {
						url.pathname = "/index.html";
					}
					let txtMap = domainInfo.answer
						.filter((rec) => {
							return (
								rec.type == 16 &&
								rec.data.txt.length > 0 &&
								rec.data.txt[0].split("=").length > 1
							);
						})
						.map((rec) => [
							rec.data.txt[0].split("=")[0],
							rec.data.txt[0].split("=").slice(1).join(""),
						])
						.reduce((pv, cv) => {
							if (pv[cv[0]]) {
								pv[cv[0]] = [...pv[cv[0]], cv[1]];
							} else {
								pv[cv[0]] = [cv[1]];
							}
							return pv;
						}, {});
					// console.log(domainInfo.authority, domainInfo.additional);
					// domainInfo.answer.forEach((e) => console.log(e));

					if (!txtMap.repensprotocol || txtMap.repensprotocol[0] != "enabled") {
						callback({
							statusCode: 850,
							data: Buffer.from(
								"Repens protocol is not enabled on this domain"
							),
						});
						return;
					}
					if (
						!txtMap.data_hash ||
						!txtMap.data_hash[0] ||
						!Buffer.from(txtMap.data_hash[0], "hex") ||
						Buffer.from(txtMap.data_hash[0], "hex").length != 32
					) {
						callback({
							statusCode: 851,
							data: Buffer.from("Invalid data hash"),
						});
						return;
					}
					let dataHash = txtMap.data_hash[0];
					if (!txtMap.data_way) {
						callback({
							statusCode: 404,
							data: Buffer.from("No ways to fetch content provided"),
						});
						return;
					}

					for (const way of txtMap.data_way) {
						if (way.split(":").length != 2) {
							continue;
						}
						let method = way.split(":")[0];
						let path = way.split(":")[1];

						if (!fetchMethods[method]) {
							continue;
						}
						let cid = await fetchMethods[method](path, dataHash);
						if (cid == null) {
							continue;
						} else {
							let rawArchiveChunks = [];
							console.log(cid);
							for await (bf of ipfs.cat(cid)) {
								rawArchiveChunks.push(bf);
							}

							yauzl.fromBuffer(
								Buffer.concat(rawArchiveChunks),
								{},
								async (err, zip) => {
									if (err) {
										callback({
											statusCode: 571,
											data: Buffer.from("Failed parsing site archive"),
										});
										return;
									}
									let resEntry = null;
									let notFoundEntry = null;
									zip.on("entry", (entry) => {
										if (url.pathname.slice(1) == entry.fileName) {
											resEntry = entry;
										}

										if (
											["404.html", "404/index.html", "404.txt"].includes(
												entry.fileName
											)
										) {
											notFoundEntry = entry;
										}
									});
									zip.once("end", async () => {
										if (!resEntry && !notFoundEntry) {
											callback({
												statusCode: 404,
												data: Buffer.from(
													"404: File not found in archive of the resource"
												),
											});
											return;
										}
										if (!resEntry) {
											zip.openReadStream(notFoundEntry, {}, (err, stream) => {
												if (err) {
													callback({
														statusCode: 571,
														data: Buffer.from("Failed parsing site archive"),
													});
													return;
												}
												let bufferChunks = [];
												stream.on("data", (fileData) =>
													bufferChunks.push(fileData)
												);
												stream.once("end", async () => {
													callback({
														statusCode: 404,
														data: Buffer.concat(bufferChunks),
														mimeType: mime.getType(notFoundEntry.fileName),
													});
													return;
												});
											});
											return;
										} else {
											zip.openReadStream(resEntry, {}, (err, stream) => {
												if (err) {
													callback({
														statusCode: 571,
														data: Buffer.from("Failed parsing site archive"),
													});
													return;
												}
												let bufferChunks = [];
												stream.on("data", (fileData) =>
													bufferChunks.push(fileData)
												);
												stream.once("end", async () => {
													callback({
														statusCode: 200,
														data: Buffer.concat(bufferChunks),
														mimeType: mime.getType(resEntry.fileName),
													});
													return;
												});
											});
											return;
										}
									});
								}
							);
						}
					}
				});

				createWindow();

				tray = new Tray(path.join(__dirname, "src", "assets", "logo-01.png"));
				const contextMenu = Menu.buildFromTemplate([
					{
						label: "Stop and close Elymus",
						type: "normal",
						role: "quit",
					},
				]);
				tray.setToolTip("Elymus Configuration");
				tray.setContextMenu(contextMenu);
				tray.on("click", () => {
					if (!win) {
						createWindow();
					} else {
						win.show();
					}
				});
				app.on("activate", () => {
					if (BrowserWindow.getAllWindows().length === 0) createWindow();
				});
				await fastify.listen({ port: 11984 });
			} catch (err) {
				fastify.log.error(err);
				process.exit(1);
			}
		}
	};

	app.whenReady().then(() => {
		start(app);
	});
}
startup();
