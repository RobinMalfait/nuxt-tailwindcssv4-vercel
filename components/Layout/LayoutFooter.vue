<template>
  <div class="bg-gray-50 py-10 layout-footer">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col">
      <div>
        <p class="font-bold text-gray-500 mb-1.5">Meet our platinum sponsors:</p>
      </div>
      <div class="flex flex-col gap-y-8">
        <div class="flex justify-center">
          <div class="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-5">
            <div class="flex justify-center items-center">
              <img src="~assets/images/logo-nia.jpg" alt="NIA Logo"/>
            </div>
            <div class="flex justify-center">
              <NuxtLink :to="{ name: 'funding-and-sponsors' }" class="transition bg-black/5 hover:bg-white flex items-center justify-center py-2 px-4 font-bold rounded-md text-gray-500 text-sm border border-black/10 hover:border-primary hover:text-primary border-dashed">
                <div>
                  <div>
                    <Icon name="heroicons-solid:plus" class="!size-6" />
                  </div>
                  Add your logo
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="text-gray-600">
          <NuxtLink to="/contact">Contact</NuxtLink>
          .
          <NuxtLink to="/terms">Terms &amp; Privacy</NuxtLink>
        </div>

        <div class="text-sm text-gray-400 flex flex-col gap-y-2">
          <p>&copy;{{ new Date().getFullYear() }} Paper Authoring Tool</p>
          <p>
            <NuxtLink to="https://www.britishwebsites.co.uk/" target="_blank">Site By British Websites</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.layout-footer {
  img {
    max-width: 200px;
    max-height: 40px;
  }
}
</style>
