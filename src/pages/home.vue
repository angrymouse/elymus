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
				<h1 class="text-3xl my-2 font-bold mb-6">Elymus</h1>
				<div class="flex flex-row justify-center">
					<a class="btn btn-info m-1" href="/setupSettings">
						Set Preferences
					</a>
					<a class="btn btn-secondary m-1" href="/explore"> Browse dWeb </a>
					<button class="btn btn-error m-1" @click="stopApp">Stop App</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
async function stopApp() {
	elApi.stopApp();
}
</script>

<style>
</style>