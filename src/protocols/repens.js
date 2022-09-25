import CID from "cids";
import yauzl from "yauzl";
import mime from "mime";
import * as fetchMethods from "../fetchMethods/combine.js";
export default async function handleRepens(hnsName, request, reply, done) {
	if (!global.hnsd.synced) {
		reply
			.code(503)
			.send(
				"Handshake node isn't synchronized yet! Try in few minutes. (Height " +
					global.hnsd.height +
					")"
			);

		return;
	}

	let domainInfo = await global.hnsd.rootResolver.resolveRaw(hnsName, "TXT");
	let filepath;
	if (request.url == "/") {
		filepath = "/index.html";
	} else {
		filepath = request.url;
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

	if (!txtMap.repensprotocol || txtMap.repensprotocol[0] != "enabled") {
		reply.code(500).send("Repens protocol is not enabled on this domain!");
	} else {
		if (
			!txtMap.data_hash ||
			!txtMap.data_hash[0] ||
			!Buffer.from(txtMap.data_hash[0], "hex") ||
			Buffer.from(txtMap.data_hash[0], "hex").length != 32
		) {
			reply.code(500).send("Invalid data hash");

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

				for await (let bf of ipfs.cat(cid)) {
					rawArchiveChunks.push(bf);
				}

				yauzl.fromBuffer(
					Buffer.concat(rawArchiveChunks),
					{},
					async (err, zip) => {
						if (err) {
							reply.code(500).send("Failed parsing site archive");

							return;
						}
						let resEntry = null;
						let notFoundEntry = null;
						zip.on("entry", (entry) => {
							if (filepath.slice(1) == entry.fileName) {
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
								reply
									.code(404)
									.send("404: File not found in archive of the resource");

								return;
							}
							if (!resEntry) {
								zip.openReadStream(notFoundEntry, {}, (err, stream) => {
									if (err) {
										reply.code(404).send("Failed parsing site archive");

										return;
									}
									reply.raw.writeHead(200, {
										"content-type": mime.getType(notFoundEntry.fileName),
									});
									stream.on("data", (data) => {
										reply.raw.write(data);
									});
									stream.on("end", () => {
										reply.raw.end();
									});
									// stream.pipe(reply.raw);
								});
								return;
							} else {
								zip.openReadStream(resEntry, {}, (err, stream) => {
									if (err) {
										reply.code(571).send("Failed parsing site archive");

										return;
									}
									reply.raw.writeHead(200, {
										"content-type": mime.getType(resEntry.fileName),
									});
									stream.on("data", (data) => {
										reply.raw.write(data);
									});
									stream.on("end", () => {
										reply.raw.end();
									});
								});
								return;
							}
						});
					}
				);
			}
		}
	}
}
