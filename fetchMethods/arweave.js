module.exports = (cid, dataHash,store) => {
	return new Promise(async (resolve, reject) => {

		const crypto = require("crypto");

		const Stream = require("node:stream");

		const dataContentStream = new Stream.PassThrough();
		ipfs.add({ content: dataContentStream }).then(finish);

		let hash = crypto.createHash("sha256");

		// console.log(ipfs.files.get(new CID(cid)));
		let filesize = 0;
		for await (const buf of await download(`http://${await store.get("userSettings.arweaveGateway")}/${cid}`)) {
			if (filesize >= 536870912) {
				break; //not gonna download something more than 512 mb
			}
			hash.update(Buffer.from(buf));
			dataContentStream.write(Buffer.from(buf));
			filesize += buf.length;
		}
		dataContentStream.end();
		async function finish(result) {
			if (hash.digest("hex").toLowerCase() == dataHash.toLowerCase()) {
				resolve(result.cid);
			} else {
				await ipfs.pin.rm(result.cid);
				resolve(null);
			}
		}
	});
};
async function* download(uri) {
	const { request } = require("undici");
	const { body, headers, statusCode, trailers } = await request(uri,{maxRedirections:3});
	body.on("data", (buf) => {
	  yield buf
  });
}
