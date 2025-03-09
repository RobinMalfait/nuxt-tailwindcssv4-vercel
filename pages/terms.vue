<template>
  <div class="py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 prose">
      <h1 class="text-primary">Terms and conditions, privacy and data notice</h1>
      <h2>Last updated 26th Feb 2024</h2>
      <p><strong>1. Eligibility and Participation</strong></p>
      <p>By using the Paper Authoring Tool (PAT), you agree to the terms set out below.</p>
      <p><strong>2. Beta version</strong></p>
      <p>The current version of PAT is a Beta version, meaning that it is still under development and we are collecting
        data on usage to help with this process. PAT is being provided on an “As Is” and may contain bugs, errors, and
        other problems. Users assume all risks associated with using a product and the PAT development team can take no
        responsibilities for any losses arising from use.</p>
      <p>Data loss is extremely unlikely but users are advised regularly to save the JSON file locally so that they can
        restore their paper should any data be lost from the server.</p>
      <p><strong>3. Feedback</strong></p>
      <p>PAT is made available for the purposes of evaluation and feedback without any compensation or reimbursement.
        Usage may be monitored and feedback requested to improve PAT.</p>
      <p><strong>4. Intellectual Property</strong></p>
      <p>PAT is the intellectual property of Silverback Internet Services Ltd.</p>
      <p><strong>5. Privacy and data usage</strong></p>
      <p>Information stored in PAT will be visible to its developers and may used to continue to develop and improve the
        website. Information will be held confidentially and only available to people designated by users as authors,
        contributors or reviewers until and unless users declare the paper as ‘published’ and ‘open access’.</p>
      <p>Information about users will be kept securely and only used for communications relating to PAT.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Terms & Privacy'
})
definePageMeta({
  auth: false
})
</script>
