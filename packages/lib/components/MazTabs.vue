<script lang="ts" setup>
import { computed, provide, type Ref, ref } from 'vue'

export interface Props {
  /** The the selected tab number */
  modelValue?: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  /**
   * Emitted when the selected tab change
   * @property {number} newValue new value set
   */
  (event: 'update:model-value', index: number): void
}>()

const localValue = ref(1)

const currentTab = computed({
  get: () => props.modelValue ?? localValue.value,
  set: (index: number) => {
    localValue.value = index
    emits('update:model-value', index)
  },
})

function updateCurrentTab(index: number) {
  currentTab.value = index

  return index
}

export interface MazTabsProvide {
  currentTab: Ref<number>
  updateCurrentTab: (index: number) => number
}

provide<MazTabsProvide>('maz-tabs', {
  currentTab,
  updateCurrentTab,
})
</script>

<template>
  <div class="m-tabs">
    <slot />
  </div>
</template>
