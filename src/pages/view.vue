<template>
	<div
		class="w-full flex flex-col justify-items-stretch items-start min-h-screen"
	>
		<div class="bg-neutral navbar">
			<div class="flex-1 flex-row items-center">
				<div class="navbar-start">
					<a class="btn btn-ghost normal-case text-xl">Elymus </a>
					<div class="badge badge-warning">alpha</div>
				</div>
				<div class="form-control navbar-center">
					<form class="input-group" @submit.prevent="navig">
						<input
							type="text"
							placeholder="Enter Repens or usual URL"
							v-model="uri"
							class="input input-bordered"
						/>
						<button
							class="btn btn-square rounded-none btn-primary"
							type="submit"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</form>
				</div>
				<div class="navbar-end"></div>
			</div>
		</div>
		<webview
			id="site"
			:src="actualNavigatedAddress"
			class="bg-white w-full h-full flex-grow"
		></webview>
	</div>
</template>

<script setup>
let route = useRoute();
let router = useRouter();
let uri = ref(route.hash.slice(1));
let actualNavigatedAddress = ref(ref(route.hash.slice(1)));
watchEffect(() => {
	uri.value = route.hash.slice(1);
	actualNavigatedAddress.value = route.hash.slice(1);
});
function navig() {
	router.replace({ hash: "#" + uri.value });
}
</script>

<style>
</style>