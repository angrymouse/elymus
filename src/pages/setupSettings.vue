<template>
	<div>
		<h1 class="text-3xl font-bold text-center my-4">Set Elymus parameters</h1>
		<div class="form-control w-full flex flex-col justify-center items-center">
			<label class="label">
				<span class="label-text">Arweave gateway</span>
				<!-- <span class="label-text-alt">Alt label</span> -->
			</label>
			<input
				type="text"
				placeholder="Type here"
				v-model="arweaveGateway"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full flex flex-col justify-center items-center">
			<label class="label">
				<span class="label-text">Skynet portal</span>
				<!-- <span class="label-text-alt">Alt label</span> -->
			</label>
			<input
				type="text"
				placeholder="Type here"
				v-model="skynetPortal"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full flex flex-col justify-center items-center">
			<label class="label">
				<span class="label-text max-w-xs"
					>Handshake DNS root server (install impervious fingertip if didn't
					yet)</span
				>
				<!-- <span class="label-text-alt">Alt label</span> -->
			</label>
			<input
				type="text"
				placeholder="Type here"
				v-model="handshakeDns"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full flex flex-col justify-center items-center">
			<label class="label">
				<span class="label-text max-w-xs"
					>(IPFS) Amount of last visited sites to cache and seed</span
				>
				<!-- <span class="label-text-alt">Alt label</span> -->
			</label>
			<input
				type="number"
				placeholder="Type here"
				max="100"
				min="1"
				v-model="cacheSize"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div
			class="form-control w-full flex flex-col justify-center items-center mt-4"
		>
			<input
				type="button"
				placeholder="Type here"
				max="100"
				value="CONNECT TO YGGDRASIL OF DWEB!"
				min="1"
				class="btn btn-primary w-full max-w-xs"
				@click="finishSetup"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
const router = useRouter();
let arweaveGateway = ref("arweave.net");
let skynetPortal = ref("skynetpro.net");
let cacheSize = ref(20);
let handshakeDns = ref("127.0.0.1:9591");
async function finishSetup() {
	await elApi.kvSet({
		userSettings: {
			arweaveGateway: arweaveGateway.value,
			skynetPortal: skynetPortal.value,
			cacheSize: cacheSize.value,
			handshakeDns: handshakeDns.value,
		},
		setuped: true,
	});
	router.push({ path: "/home" });
}
</script>

<style>
</style>