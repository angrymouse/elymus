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
