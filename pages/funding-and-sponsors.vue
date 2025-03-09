<script setup lang="ts">
definePageMeta({
  name: 'funding-and-sponsors',
  auth: false
})
</script>

<template>
  <PageSection>
    <PageContainer size="medium">
      <div class="prose max-w-none">
        <h2 class="text-primary">The Evolution of PAT</h2>
        <p>PAT has been created with the support and financial backing from key individuals and businesses...</p>
        <div class="flex justify-center logos">
          <div class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
            <div class="flex justify-center">
              <img
                src="~assets/images/logo-wellcome-trust.jpg"
                alt="Wellcome Trust Logo"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="~assets/images/logo-cancer-research-uk.jpg"
                alt="Cancer Research UK Logo"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="~assets/images/logo-addiction-journal.jpg"
                alt="Addiction Journal Logo"
              />
            </div>
            <div class="flex justify-center">
              <img src="~assets/images/logo-ssa.jpg" alt="SSA Logo"/>
            </div>
            <div class="flex justify-center">
              <img
                src="~assets/images/logo-northwell-health.jpg"
                alt="Northwell Logo"
              />
            </div>
            <div class="flex justify-center">
              <img src="~assets/images/logo-nia.jpg" alt="NIA Logo"/>
            </div>
          </div>
        </div>

        <h2 class="text-primary">History</h2>
        <p>A short history of PAT origins and importance. Machine learning, IBM AI unable to read papers, hard for journals, inconsistent terms etc.</p>

        <h2 class="text-primary">Sponsorship Options</h2>
        <p>A selection of sponsorship levels to help us maintain and continue building new features</p>

        <h2 class="text-primary">Fund a new feature</h2>
        <p>Instead of sponsoring us, you may wish to see a new feature or integration with your own systems... discuss with us etc. etc.</p>
      </div>
    </PageContainer>
  </PageSection>
</template>

<style>
.logos {
  img {
    max-width: 200px;
    max-height: 40px;
  }
}
</style>

