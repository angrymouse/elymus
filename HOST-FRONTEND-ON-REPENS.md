# Hosting static frontend on Repens
In this guide we will cover hosting site in way where it will be available via Elymus or any other implementation of Repens protocol.

## Description of Repens protocol
Firstly, we need to know what Repens protocol is.

Repens protocol is successor of [DNSLink](https://dnslink.dev/).

Main lacks of DNSLink are:
1. Usage of centralized (ICANN) DNS as content adressing system. It in some sense defeats purpose of DNSLink.
2. No browsers/resolvers for it. Most common usage is IPNS through IPFS gateway.
3. IPFS-only resolving. IPFS is great, but mostly as caching p2p network. It shouldn't be IPFS-only, or anchoring will be made through centralized services like Pinata, and it will be big problem for decentralization.

Repens protocol solves these problems. First problem is solved by usage of [Handshake](https://handshake.org) as content addressing system, which allows trustless and censorship-resistant resolving of domain names. 

Second problem is solved by Elymus, browser and development stack developed specially to support Repens in absolutely decentralized way.

Third problem is solved simply by letting websites to setup many ways of content resolving, allowing both effective p2p caching and effective decentralized content anchoring (or pinning, making content available when no peers seed it).

Repens content resource (Domain name in common internet) is root handshake name with special Repens-specific TXT records in root zone.

Handshake domain for Repens should contain following records:

1. Record that indicates that name supports Repens protocol

Type:`TXT`

Name:` ` (empty)

Content:`repensprotocol=enabled`

2. Record that tells hash of data, to avoid scenarios when some of ways is broken and serves incorrect info

Type:`TXT`

Name:` ` (empty)

Content:`data_hash=<sha256 hex>`

Where `<sha256 hex>` is sha256 of ZIP archive with site's content encoded in HEX encoding (e.g `02C29C6A6882222EF720E18D016D9ED52001AE3BA2552E2A7675F465C5012774`)

3. Ways to retrive data. (There can be multiple records of this type)

Type:`TXT`
Name:` ` (empty)

Content:`data_way=<way type>:<way content id>`

Where `<way type>` is way to retrive data, one of `ipfs`, `skynet`, `arweave`, `hyperdrive`, and `<way content id>` is where to locate ZIP archive through this way (it can be IPFS CID, arweave transaction ID, skynet's skylink or hyperdrive's swarm id). 

e.g `ipfs:QmWi2zXjqv3XZbjyNHXH8yWgqExa2vQ81n9hUJ51cYLBfd`.

Note: downloaded archive's sha256 hash should equal to hash specified in `data_hash` record
