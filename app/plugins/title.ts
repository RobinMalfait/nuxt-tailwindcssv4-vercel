export default defineNuxtPlugin(() => {
  useHead({
    titleTemplate: (titleChunk) => {
      const postfix = 'Paper Authoring Tool (PAT)'
      return titleChunk ? `${titleChunk} - ${postfix}` : postfix;
    },
  });
});
