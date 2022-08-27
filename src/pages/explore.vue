<template>
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div
				class="
					max-w-md
					flex
					justify-center
					flex-col
					items-center
					align-items-center
				"
			>
				<img
					src="~/assets/elymus-01.png"
					class="w-60 d-flex justify-self-center"
				/>
				<h1 class="text-xl font-bold my-2">
					Enter Handshake name of Repens-based site
				</h1>
				<div
					class="form-control w-full flex flex-col justify-center items-center"
				>
					<div class="btn-group flex flex-row items-center justify-center">
						<label class="label w-full max-w-xs">
							<span class="label-text max-w-xs text-left w-full"
								>Try "repens://elymus"</span
							>
							<!-- <span class="label-text-alt">Alt label</span> -->
						</label>
						<form
							class="flex flex-row w-full max-w-xs"
							@submit.prevent="navig"
							method="GET"
						>
							<input
								type="text"
								placeholder="Enter Repens URL here"
								@input="setUrl($event.target.value)"
								class="input input-bordered w-full rounded-r-none"
							/>
							<button type="submit" class="btn btn-secondary rounded-l-none">
								I am free
							</button>
						</form>
					</div>
					<div class="btn-group flex flex-row items-center justify-center mt-4">
						<nuxt-link class="btn btn-sm btn-primary" to="/home"
							>Back</nuxt-link
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
let router = useRouter();
async function stopApp() {
	elApi.stopApp();
}
let url = ref("");
function setUrl(uri) {
	if (!["http://", "repens://", "https://"].find((e) => uri.startsWith(e))) {
		if (uri.split(".").length > 1) {
			uri = "http://" + uri;
		} else {
			uri = "repens://" + uri;
		}
	}
	url.value = `/view/#${uri}`;
}
function navig() {
	router.push(url.value);
}
</script>

<style>
</style>