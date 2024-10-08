<script lang="ts" setup>
import type { Color } from './types'
import { computed, type SVGAttributes, useSlots } from 'vue'
import { useInstanceUniqId } from '../modules/composables/useInstanceUniqId'
import MazAnimatedCounter from './MazAnimatedCounter.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The percentage value of the progress bar
     */
    percentage: number
    /**
     * The size of the progress bar
     * @default '10em' (equal 80px for a font-size of 16px)
     */
    size?: string
    /**
     * Duration of the animation in milliseconds
     * @default 1000
     */
    duration?: number
    /**
     * The color of the progress bar
     */
    color?: Color
    /**
     * Auto color based on the count (danger, warning, success)
     * @default false
     */
    autoColor?: boolean
    /**
     * Suffix to display next to the number
     */
    prefix?: string
    /**
     * Suffix to display next to the number
     */
    suffix?: string
    /**
     * The stroke-linecap style
     * @default 'round'
     * @values 'butt', 'round', 'square', 'inherit'
     */
    strokeLinecap?: SVGAttributes['stroke-linecap']
    /**
     * The stroke width
     * @default 6
     */
    strokeWidth?: SVGAttributes['width']
    /**
     * The stroke color
     * Use this prop to override the gradient color
     * You can use a color name or a color code
     */
    stroke?: SVGAttributes['stroke']
  }>(),
  {
    percentage: 0,
    size: '10em',
    duration: 1000,
    color: undefined,
    prefix: undefined,
    suffix: undefined,
    strokeLinecap: 'round',
    strokeWidth: 6,
    stroke: undefined,
  },
)

const slots = useSlots()

const hasPrefix = computed(() => !!props.prefix || !!slots.prefix)
const hasSuffix = computed(() => !!props.suffix || !!slots.suffix)

const id = useInstanceUniqId({
  componentName: 'MazCircularProgressBar',
})

const adjustedPercentage = computed<number>(() => {
  return props.percentage > 100 ? 100 : props.percentage <= 0 ? 0.5 : props.percentage
})

const currentColor = computed<Color | undefined>(() =>
  props.autoColor ? getStatusColor(props.percentage) : props.color,
)

function getStatusColor(percent: number): Color {
  return percent < 50 || percent > 100 ? 'danger' : percent < 100 ? 'warning' : 'success'
}

const animationDuration = computed<string>(() => `${props.duration}ms`)
const dashoffset = computed<number>(() => {
  return Math.round(290 - 290 * (adjustedPercentage.value / 100))
})
</script>

<template>
  <div
    class="m-circular-progress-bar"
    :style="[
      {
        fontSize: size,
      },
    ]"
  >
    <div class="outer">
      <div class="inner">
        <span v-if="slots.default">
          <!-- @slot Default slot - Replace the percaentage value -->
          <slot />
        </span>
        <MazAnimatedCounter v-else :count="percentage" :duration="duration">
          <template v-if="hasPrefix" #prefix>
            <!-- @slot Prefix slot - Add a prefix next to the number (e.g: "$") -->
            <slot name="prefix">
              {{ prefix }}
            </slot>
          </template>
          <template v-if="hasSuffix" #suffix>
            <!-- @slot Suffix slot - Add a suffix next to the number (e.g: "%") -->
            <slot name="suffix">
              {{ suffix }}
            </slot>
          </template>
        </MazAnimatedCounter>
      </div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 100 100">
      <defs>
        <linearGradient :id="`${id}-gradient`" x1="0" x2="0" y1="1" y2="0">
          <stop
            offset="0%"
            :stop-color="
              currentColor ? `var(--maz-color-${currentColor}-400)` : `var(--maz-color-primary)`
            "
          />
          <stop
            offset="100%"
            :stop-color="
              currentColor ? `var(--maz-color-${currentColor}-700)` : `var(--maz-color-secondary)`
            "
          />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="46"
        :stroke-width="strokeWidth"
        stroke-dasharray="290"
        stroke-dashoffset="290"
        :stroke="stroke ? stroke : `url(#${id}-gradient)`"
        fill="none"
        :stroke-linecap="strokeLinecap"
      />
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
  .m-circular-progress-bar {
  @apply maz-relative maz-inline-flex maz-h-[1em] maz-w-[1em] maz-flex-center;

  .outer {
    @apply maz-flex maz-h-full maz-w-full maz-rounded-full maz-flex-center;
  }

  .inner {
    @apply maz-flex maz-h-[0.85em] maz-w-[0.85em] maz-rounded-full maz-flex-center;

    :deep(> *) {
      @apply maz-text-[0.25em];
    }
  }

  svg {
    @apply maz-absolute -maz-rotate-90;

    circle {
      animation: animate v-bind(animationDuration) linear forwards;
    }
  }
}

@keyframes animate {
  to {
    stroke-dashoffset: v-bind(dashoffset);
  }
}
</style>
