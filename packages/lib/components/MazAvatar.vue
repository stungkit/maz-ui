<script lang="ts" setup>
import type { Color } from './types'

import { computed, defineAsyncComponent } from 'vue'

export type { Color }

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  caption: undefined,
  href: undefined,
  to: undefined,
  alt: 'avatar image',
  target: '_self',
  size: undefined,
  buttonColor: 'info',
  letterCount: undefined,
  roundedSize: 'full',
  fallbackSrc: undefined,
})
defineEmits<{
  (name: 'click', event: MouseEvent): void
  /** Emitted when the image is intersecting */
  (name: 'intersecting', el: Element): void
  /** Emitted when the image is loading */
  (name: 'loading', el: Element): void
  /** Emitted when the image is loaded */
  (name: 'loaded', el: Element): void
  /** Emitted when the image is in error */
  (name: 'error', el: Element): void
}>()
const MazLazyImg = defineAsyncComponent(() => import('./MazLazyImg.vue'))
const PencilIcon = defineAsyncComponent(() => import('./../icons/pencil.svg'))

export interface Props {
  /** The source of the image */
  src?: string | null
  /** The caption of the avatar */
  caption?: string | null
  /** The link of the avatar */
  href?: string
  /** The link (router-link) of the avatar */
  to?: string | Record<string, unknown>
  /** The alt of the image */
  alt?: string
  /** The target of the link */
  target?: string
  /** The size of the avatar */
  size?: string
  /** Add a border to the avatar */
  bordered?: boolean
  /** Make the avatar clickable */
  clickable?: boolean
  /** Make the avatar square */
  square?: boolean
  /** Remove the shadow */
  noElevation?: boolean
  /** Show the caption */
  showCaption?: boolean
  /** Make the image height full */
  imageHeightFull?: boolean
  /** Remove the loader */
  noLoader?: boolean
  /** The color of the clickable button */
  buttonColor?: Color
  /** Remove the icon on hover when component is clickable */
  noClickableIcon?: boolean
  /** Number of letters to display in the round text */
  letterCount?: number
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** The fallback src to replace the src on loading error */
  fallbackSrc?: string
  /** Load the fallback image by default */
  noPhoto?: boolean
}

const componentType = computed(() => (props.to ? 'RouterLink' : props.href ? 'a' : 'div'))
const isLink = computed(() => !!props.to || !!props.href)

function getInitials(name: string, lettersCount = props.letterCount) {
  const words = name.split(' ')

  const initials = words.map(word => word[0])

  const letters = initials.join('')

  return letters.slice(0, lettersCount)
}
</script>

<template>
  <Component
    :is="componentType"
    :style="{ fontSize: size }"
    class="m-avatar"
    :class="[
      {
        '--has-link': isLink,
      },
    ]"
    :href="href"
    :to="to"
    :target="isLink ? target : undefined"
  >
    <div
      class="m-avatar__wrapper"
      :tabindex="clickable ? 0 : -1"
      :class="[
        {
          '--has-shadow': !noElevation,
          '--bordered': bordered,
          '--clickable': clickable,
          '--has-initial': !src && caption,
        },
        `--rounded-${square ? 'none' : roundedSize}`,
      ]"
    >
      <MazLazyImg
        v-if="src || (!src && !caption)"
        class="m-avatar__picture maz-w-full maz-max-w-full"
        :image="src"
        :alt="alt"
        :no-photo="noPhoto"
        image-height-full
        :no-loader="noLoader"
        :fallback-src="fallbackSrc"
        @click="clickable ? $emit('click', $event) : null"
        @error="$emit('error', $event)"
        @loaded="$emit('loaded', $event)"
        @loading="$emit('loading', $event)"
        @intersecting="$emit('intersecting', $event)"
      />
      <slot v-if="caption && !src" name="round-text">
        <span class="m-avatar__initial"> {{ getInitials(caption) }} </span>
      </slot>

      <button
        v-if="clickable"
        type="button"
        tabindex="-1"
        class="m-avatar__button"
        :style="{
          backgroundColor: src
            ? `var(--maz-color-${buttonColor}-alpha)`
            : `var(--maz-color-${buttonColor})`,
        }"
        @click="$emit('click', $event)"
      >
        <slot v-if="!noClickableIcon" name="icon">
          <PencilIcon class="m-avatar__button__icon" />
        </slot>
      </button>
    </div>
    <slot name="caption">
      <p v-if="showCaption && caption" class="m-avatar__caption">
        {{ caption }}
      </p>
    </slot>
  </Component>
</template>

<style lang="postcss" scoped>
  .m-avatar {
  @apply maz-inline-flex maz-flex-col maz-gap-[0.5em] maz-align-top maz-flex-center;
  @apply !maz-no-underline;

  &__caption {
    @apply maz-w-full maz-truncate maz-text-center maz-font-medium maz-capitalize;
  }

  &__initial {
    @apply maz-text-[1.5em] maz-capitalize maz-text-white;
  }

  &__wrapper {
    @apply maz-relative maz-flex maz-h-[3em] maz-w-[3em] maz-flex-none maz-justify-center maz-overflow-hidden;

    &.--clickable {
      & .m-avatar__button {
        @apply maz-absolute maz-inset-0 maz-flex maz-w-full
            maz-cursor-pointer maz-border-none maz-bg-transparent
            maz-opacity-0 maz-transition-all maz-duration-200 maz-flex-center;

        transform: scale(0);

        &__icon {
          @apply maz-text-white;
        }
      }

      &:hover,
      &:focus {
        & .m-avatar__picture {
          filter: blur(1.5px);
        }

        & .m-avatar__button {
          @apply maz-opacity-100;

          transform: scale(1.05);
        }
      }
    }

    &.--bordered {
      @apply maz-border maz-border-solid maz-border-color-light dark:maz-border-color-lighter;
    }

    &.--rounded {
      &-none {
        @apply maz-rounded-none;

        .m-avatar__button {
          @apply maz-rounded-none;
        }
      }

      &-sm {
        @apply maz-rounded-sm;

        .m-avatar__button {
          @apply maz-rounded-sm;
        }
      }

      &-md {
        @apply maz-rounded-md;

        .m-avatar__button {
          @apply maz-rounded-md;
        }
      }

      &-lg {
        @apply maz-rounded;

        .m-avatar__button {
          @apply maz-rounded-lg;
        }
      }

      &-xl {
        @apply maz-rounded-xl;

        .m-avatar__button {
          @apply maz-rounded-xl;
        }
      }

      &-full {
        @apply maz-rounded-full;

        .m-avatar__button {
          @apply maz-rounded-full;
        }
      }
    }

    &.--has-shadow {
      @apply maz-shadow;
    }

    &.--has-initial {
      @apply maz-items-center maz-bg-primary;
    }
  }

  &.--has-link {
    @apply maz-cursor-pointer;
  }
}
</style>
