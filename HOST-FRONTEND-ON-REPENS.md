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

