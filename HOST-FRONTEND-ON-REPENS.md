# Hosting static frontend on Repens
In this guide we will cover hosting site in way where it will be available via Elymus or any other implementation of Repens protocol.

Firstly, you need to know what Repens protocol is. To learn it, read [Repens protocol description](REPENS_PROTOCOL_SPEC.md)

## Getting static content

Repens protocol works with static-only websites. All "backend" should be done via smart contracts.

You can use both SPA (single page application, only 1 page exists, nothing is pre-generated) and SSG (SPA but with pre-generates routes) modes, although SPA mode shows to be more performant with Elymus.

You can get static content by developing it yourself, or clone/download [example static site](https://github.com/angrymouse/extremely-simple-site) for this guide.

Site's content (all pages, images, files, etc.) should be packed to ZIP folder. On Windows the easiest way is to send it to compressed (zipped) folder.
![image](https://user-images.githubusercontent.com/40735471/188281812-178b5b30-a2d9-4b46-b52a-f7dcead7d7c9.png)
After this, you should get zip file with contents of your site.
![image](https://user-images.githubusercontent.com/40735471/188281860-0e80e3a9-6081-4a45-be39-adbf94ff0755.png)
## Getting hash of ZIP archive
Now you need sha256 hash of archive (in hex encoding) that you got in previous step. Easiest way to get it is to upload archive to [this site](https://emn178.github.io/online-tools/sha256_checksum.html).

Put it somewhere (you can open notepad/notes app and insert it here, you will need it later).
## Uploading archive to various resources
Now you need to upload this archive to IPFS, for effective p2p caching, and to other resource (Arweave/skynet/somewhere else) for anchoring (pinning, making data available when no peers are online).

Uploading to IPFS is important: When person will visit your website via Elymus or other Repens protocol implementation, he will download archive and seed it to other users, making it more decentralized.

So, download [IPFS Desktop](https://github.com/ipfs/ipfs-desktop/releases), and add your ZIP archive here.

Then, copy CID that you got and write it somewhere (notes app/notepad). You will need it at the stage of setting records for your handshake name.

Now upload it to arweave/skynet. It is needed because sometimes there's no peers who will seed your ZIP archive, and we don't want to fallback to centralizing pinning like Pinata or instable solutions like Filecoin.

This step won't be detaily described in this guide: You can find bunch of resources in internet about how to upload data to arweave/skynet. Just remember that you need to write down content IDs for usage in next step (for arweave it's transaction ID, for skynet it's skylink).

## Getting Handshake name and setting records

Now get [Handshake](https://handshake.org) name. You can buy it on [Namebase](https://namebase.io), win on auction via [Bob Wallet](https://bobwallet.io) (or namebase), or get random one for free in one of Handshake communities. One of popular ones is here: https://discord.gg/vcM3bnhn2U

Now, after you have name, set root zone's records as described in [Repens protocol specification](REPENS_PROTOCOL_SPEC.md)
