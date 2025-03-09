<template>
  <Disclosure as="nav" class="bg-white shadow" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex flex-grow">
          <div class="flex shrink-0 items-center transition" :class="[$route.path === '/' ? 'opacity-0' : 'opacity-100']">
            <NuxtLink to="/">
              <Logo class="h-11 w-auto" alt="Paper Authoring Tool PAT Logo" :fontControlled="false" filled />
            </NuxtLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:gap-x-3 items-center flex-grow justify-end">
            <DesktopNavItem v-for="navItem of navItems" :key="`desktop-nav-link-${navItem.linkText}`" v-bind="navItem.props">{{ navItem.linkText }}</DesktopNavItem>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Profile dropdown -->
          <Menu as="div" class="relative">
            <div>
              <MenuButton
                v-if="signedIn"
                class="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                :class="$route.path.startsWith('/account/') ? 'ring-2 ring-primary/50' : ''">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <Icon name="heroicons-solid:user-circle" class="!size-8 rounded-full text-primary" />
              </MenuButton>
            </div>
            <FadeScaleTransition>
              <MenuItems v-if="signedIn" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <NuxtLink v-for="linkItem of accountLinkItems" :key="`desktop-account-link-${linkItem.linkText}`" v-bind="linkItem.props" v-slot="{ isActive }">
                  <MenuItem>
                      <span :class="[isActive ? 'outline-none text-primary' : 'text-gray-700', 'block px-4 py-2 text-sm hover:text-primary']">
                        {{ linkItem.linkText }}
                      </span>
                  </MenuItem>
                </NuxtLink>
                <MenuItem v-if="hasRole('ROLE_ADMIN')" @click="downloadUsers">
                  <span :class="['text-gray-700 flex items-center gap-x-2 px-4 py-2 text-sm hover:text-primary cursor-pointer']">
                    <span>Download users</span>
                    <Icon name="heroicons-outline:arrow-top-right-on-square" class="!size-4" aria-hidden="true" />
                  </span>
                </MenuItem>
                <MenuItem>
                  <a @click.prevent="doSignOut" href="/api/auth/logout" class="block px-4 py-2 text-sm text-gray-500 hover:text-danger">Sign out</a>
                </MenuItem>
              </MenuItems>
            </FadeScaleTransition>
          </Menu>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Icon v-if="!open" name="heroicons-outline:bars-3" class="block !size-6" aria-hidden="true" />
            <Icon v-else name="heroicons-outline:x-mark" class="block !size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="gap-y-1 pb-3 pt-2">
        <MobileNavItem v-for="navItem of navItems"  :key="`mobile-nav-link-${navItem.linkText}`" v-bind="navItem.props">{{ navItem.linkText }}</MobileNavItem>
      </div>
      <div v-if="signedIn" class="border-t border-gray-200 pb-3 pt-4">
        <div class="flex items-center px-4">
          <div class="shrink-0">
            <Icon name="heroicons-solid:user-circle" class="!size-12 rounded-full text-primary" />
          </div>
          <div class="ml-2 font-medium">
            <div class="text-base text-gray-800">Your Name</div>
            <div class="text-sm text-gray-500">your@email.com</div>
          </div>
        </div>
        <div class="mt-3 gap-y-1">
          <NuxtLink v-for="linkItem of accountLinkItems" :key="`mobile-account-link-${linkItem.linkText}`" v-bind="linkItem.props" v-slot="{ isActive }">
            <DisclosureButton as="span" :class="['block px-4 py-2 text-base font-bold hover:bg-gray-100', isActive ? 'text-primary' : 'text-gray-500 hover:text-primary']">
              {{ linkItem.linkText }}
            </DisclosureButton>
          </NuxtLink>
          <DisclosureButton v-if="hasRole('ROLE_ADMIN')" @click="downloadUsers" as="span" :class="['flex items-center gap-x-2 px-4 py-2 text-base font-bold hover:bg-gray-100', 'text-gray-500 hover:text-primary']">
            <span>Download users</span>
            <Icon name="heroicons-outline:arrow-top-right-on-square" class="!size-4" aria-hidden="true" />
          </DisclosureButton>
          <DisclosureButton @click.prevent="doSignOut" href="/api/auth/logout" as="a" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-danger">Sign out</DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import DesktopNavItem from "~/components/Layout/PublicHeader/DesktopNavItem.vue";
import MobileNavItem from "~/components/Layout/PublicHeader/MobileNavItem.vue";
import type {RouterLinkProps} from "vue-router";
import {usePatUserSession} from "~/composables/usePatUserSession";
import {NuxtLink} from "#components";
import Logo from '~/assets/images/logo.svg'
import FadeScaleTransition from "~/components/FadeScaleTransition.vue";

const $route = useRoute()
const { status, signOut } = useAuth()
const { hasRole } = usePatUserSession()
const { $api } = useNuxtApp()

const signedIn = ref(false)
watch(status, (newStatus) => {
  if (newStatus === 'loading') {
    return
  }
  signedIn.value = newStatus === 'authenticated'
}, {
  immediate: true
})

type LinkItem = { linkText: string, props: RouterLinkProps & { target?: string } }

async function doSignOut () {
  await signOut({ callbackUrl: '/' })
}

const navItems = computed<LinkItem[]>(() => {
  const itemLinks: LinkItem[] = []
  if (signedIn.value) {
    return [
      ...itemLinks,
      {
        linkText: 'Your Papers',
        props: {
          to: '/papers'
        }
      }
    ]
  }
  return [
    ...itemLinks,
    {
      linkText: 'Home',
      props: {
        to: '/'
      }
    },
    {
      linkText: 'Sign In',
      props: {
        to: '/sign-in'
      }
    },
    {
      linkText: 'Get Started',
      props: {
        isCta: true,
        to: '/get-started'
      }
    }
  ]
})



const accountLinkItems = computed<LinkItem[]>(() => {
  return [
    {
      linkText: 'Your Author Details',
      props: {
        to: '/account/author'
      }
    },
    {
      linkText: 'Account Settings',
      props: {
        to: '/account/settings'
      }
    }
  ]
})

async function downloadUsers() {
  const anchor = document.createElement('a')
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  const filePath = '/download-users'
  const response = await $api<Blob>(filePath, {
    responseType: 'blob'
  })
  const objectUrl = window.URL.createObjectURL(response)
  anchor.href = objectUrl
  const date = new Date()
  anchor.download = `pat-users-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  anchor.click()
  window.URL.revokeObjectURL(objectUrl)
  anchor.remove()
}
</script>
