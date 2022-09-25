import CID from "cids";
import crypto from "crypto";
import Stream from "stream";
export default (cid, dataHash) => {
	return new Promise(async (resolve, reject) => {
		const dataContentStream = new Stream.PassThrough();
		ipfs.add({ content: dataContentStream }).then(finish);

		let hash = crypto.createHash("sha256");

		// console.log(ipfs.files.get(new CID(cid)));
		let filesize = 0;
		for await (let buf of ipfs.cat(new CID(cid))) {
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
