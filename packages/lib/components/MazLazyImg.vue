<script lang="ts" setup>
import type { vLazyImgOptions } from './../modules/directives/v-lazy-img/types'
import type { Image } from './types'
import { computed, defineAsyncComponent, type HTMLAttributes } from 'vue'

import { vLazyImg } from './../modules/directives/v-lazy-img/lazy-img.directive'

export type { Image }

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  style: undefined,
  class: undefined,
  image: undefined,
  src: undefined,
  alt: undefined,
  observerOptions: undefined,
  fallbackSrc: undefined,
})

defineEmits<{
  /** Emitted when the image is intersecting */
  (name: 'intersecting', el: Element): void
  /** Emitted when the image is loading */
  (name: 'loading', el: Element): void
  /** Emitted when the image is loaded */
  (name: 'loaded', el: Element): void
  /** Emitted when the image is in error */
  (name: 'error', el: Element): void
}>()

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export interface Props {
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /** @deprecated Use `src` instead */
  image?: Image | null
  /**
   * The source of the image
   * @type {string | Image | null}
   */
  src?: Image | null
  /** The alt of the image */
  alt?: string
  /** Display the fallback image */
  noPhoto?: boolean
  /** Remove the loader */
  noLoader?: boolean
  /** Remove the observer once the image is loaded */
  noObserverOnce?: boolean
  /** Remove the observer once the image is loaded */
  loadOnce?: boolean
  /** Make the image height full */
  imageHeightFull?: boolean
  /** The options of the observer */
  observerOptions?: vLazyImgOptions['observerOptions']
  /** The fallback src to replace the src on loading error */
  fallbackSrc?: string
}

const src = computed(() => props.image || props.src)

const sources = computed(() => {
  return typeof src.value === 'string' ? [{ srcset: src.value }] : src.value?.sources
})
</script>

<template>
  <picture
    v-lazy-img="{
      noPhoto,
      loadOnce,
      observerOptions,
      fallbackSrc,
      observerOnce: !noObserverOnce,
      onIntersecting: (el) => $emit('intersecting', el),
      onLoading: (el) => $emit('loading', el),
      onLoaded: (el) => $emit('loaded', el),
      onError: (el) => $emit('error', el),
    }"
    class="m-lazy-img-component"
    :class="[{ '--use-loader': !noLoader, '--height-full': imageHeightFull }, props.class]"
    :style="style"
  >
    <source
      v-for="({ srcset, media }, sourceIndex) in sources"
      :key="sourceIndex"
      :data-lazy-srcset="srcset"
      :media="media"
    >
    <img
      v-bind="$attrs"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      loading="lazy"
      :alt="alt"
    >
    <div v-if="!noLoader" class="m-lazy-img-component-loader">
      <MazSpinner size="2em" />
    </div>
    <slot />
  </picture>
</template>

<style lang="postcss" scoped>
  .m-lazy-img-component {
  @apply maz-relative maz-inline-flex maz-align-top maz-flex-center;

  &-loader {
    @apply maz-absolute maz-inset-0 maz-hidden maz-flex-center;
  }

  &:not(.m-lazy-error, .m-lazy-no-photo) img {
    @apply maz-h-full maz-w-full;
  }

  &.--height-full img {
    @apply maz-max-h-full maz-w-min maz-max-w-min !important;
  }

  &.m-lazy-error:not(.m-lazy-no-photo) {
    img {
      @apply maz-h-1/2 maz-w-1/2;
    }
  }

  &.m-lazy-loading {
    & .m-lazy-img-component-loader {
      @apply maz-flex;
    }
  }
}
</style>
