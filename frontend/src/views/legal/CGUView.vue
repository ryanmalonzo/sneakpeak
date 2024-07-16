<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { marked } from 'marked'
import BasePage from '@/components/BasePage.vue'

const markdown: Ref<string> = ref<string>('')

const fetchMarkdown = async () => {
  const res = await fetch('/legal/cgu.md')
  const text = await res.text()
  markdown.value = marked(text) as string
}

const mdToHtml = computed(() => {
  const html = marked.parse(markdown.value)
  console.log(html)
  return html
})

fetchMarkdown()
</script>

<template>
  <BasePage>
    <div id="legal" v-html="mdToHtml" />
  </BasePage>
</template>

<style scoped>
/* Remove Tailwind CSS normalization */
#legal,
#legal * {
  all: revert;
}

#legal {
  padding: 1rem 2rem;
}
</style>
