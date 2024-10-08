<script lang="ts">
export type { Color, Size } from './types'
</script>

<script lang="ts" setup generic="T extends string | number | boolean">
/* eslint-disable import/first */
import type { Color, Size } from './types'
import { computed, type HTMLAttributes, ref } from 'vue'
import { useInstanceUniqId } from '../modules/composables/useInstanceUniqId'

export interface Props<T = string | number | boolean> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the radio */
  id?: string
  /** @model The value of the radio */
  modelValue?: T
  /** The value of the radio */
  value: T
  /** The name of the radio */
  name: string
  /** The label of the radio */
  label?: string
  /** The color of the radio */
  color?: Color
  /** The size of the radio */
  size?: Size
  /** The disabled state of the radio */
  disabled?: boolean
  /** Whether there is an error with the input. */
  error?: boolean
  /** Whether the input is successful. */
  success?: boolean
  /** Whether there is a warning with the input. */
  warning?: boolean
  /** The hint text to display below the input. */
  hint?: string
}

const props = withDefaults(
  defineProps<Props<T>>(),
  {
    style: undefined,
    class: undefined,
    id: undefined,
    modelValue: undefined,
    label: undefined,
    color: 'primary',
    size: 'md',
    disabled: false,
  },
)

const emits = defineEmits<{
  /**
   * Event emitted when value change
   * @property {string | number | boolean} value - selected value
   */
  'update:model-value': [value: T]
  /**
   * Event emitted when value change
   * @property {string | number | boolean} value - selected value
   */
  'change': [value: T]
  /**
   * Emitted when the radio lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the radio is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

const instanceId = useInstanceUniqId({
  componentName: 'MazRadio',
  providedId: props.id,
})

const isSelected = computed(() => props.modelValue === props.value)

const radioSize = computed(() => {
  switch (props.size) {
    case 'xl': {
      return '2.25rem'
    }
    case 'lg': {
      return '2rem'
    }
    case 'sm': {
      return '1.425rem'
    }
    case 'xs': {
      return '1.325rem'
    }
    case 'mini': {
      return '1.2rem'
    }
    default: {
      return '1.625rem'
    }
  }
})

const radioSelectedColor = computed(() => `var(--maz-color-${props.color})`)
const radioBoxShadow = computed(() => {
  if (props.error) {
    return `var(--maz-color-danger)`
  }
  else if (props.warning) {
    return `var(--maz-color-warning)`
  }
  else if (props.success) {
    return `var(--maz-color-success)`
  }

  return ['black', 'transparent'].includes(props.color)
    ? `var(--maz-color-muted)`
    : `var(--maz-color-${props.color}-alpha)`
})

function keyboardHandler(event: KeyboardEvent) {
  if (['Space'].includes(event.code)) {
    event.preventDefault()
    emitValue()
  }
}

function emitValue() {
  emits('update:model-value', props.value)
  emits('change', props.value)
}

const inputRef = ref<HTMLInputElement>()

function onBlur(event: FocusEvent) {
  inputRef.value?.dispatchEvent(new Event('blur'))
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  inputRef.value?.dispatchEvent(new Event('focus'))
  emits('focus', event)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-radio"
    :class="[{ '--disabled': disabled, '--selected': isSelected, '--error': error, '--warning': warning, '--success': success }, props.class]"
    tabindex="0"
    role="radio"
    :style
    :aria-checked="isSelected"
    @blur="onBlur"
    @focus="onFocus"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      ref="inputRef"
      :value
      v-bind="$attrs"
      tabindex="-1"
      :disabled
      :name
      type="radio"
      :checked="isSelected"
      @change="emitValue()"
    >

    <span>
      <span class="round" />
    </span>

    <!--
      @slot Label of the radio
        @binding {Boolean} is-selected - If the radio is selected
        @binding {string | number | boolean} value - The value of the radio
    -->
    <div class="m-radio__text">
      <slot :is-selected="isSelected" :value="value as T">
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-radio__hint" :class="{
          '--error': error,
          '--success': success,
          '--warning': warning,
        }"
      >{{ hint }}</span>
    </div>
  </label>
</template>

<style lang="postcss" scoped>
  .m-radio {
  @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

  > span {
    @apply maz-relative maz-flex maz-rounded-full maz-border maz-border-border maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;

    width: v-bind('radioSize');
    height: v-bind('radioSize');

    .round {
      @apply maz-h-[50%] maz-w-[50%] maz-scale-0 maz-rounded-full maz-transition-transform maz-duration-300 maz-ease-in-out;

      background-color: v-bind('radioSelectedColor');
    }
  }

  &:not(.--selected) > span {
    @apply maz-bg-color dark:maz-bg-color-light;
  }

  &.--selected > span {
    border-color: v-bind('radioSelectedColor');

    .round {
      @apply maz-scale-100;
    }
  }

  &__text {
    @apply maz-flex maz-flex-col maz-gap-0;
  }

  input {
    @apply maz-hidden;
  }

  &.--disabled {
    @apply maz-cursor-not-allowed maz-text-muted;

    > span {
      @apply maz-bg-color-light dark:maz-bg-color-lighter;
    }

    &.--selected {
      > span {
        @apply maz-border-border dark:maz-border-color-lighter;

        .round {
          @apply maz-bg-muted;
        }
      }
    }
  }

  &__hint {
    @apply maz-text-sm maz-text-muted;

    &.--error {
      @apply maz-text-danger-600;
    }

    &.--success {
      @apply maz-text-success-600;
    }

    &.--warning {
      @apply maz-text-warning-600;
    }
  }

  &:not(.--disabled),
  &:not(.--selected) {
    @apply maz-cursor-pointer;

    &:hover > span,
    &:focus > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;

      box-shadow: 0 0 0 0.125rem v-bind('radioBoxShadow');
    }
  }

  &.--error,
  &.--warning,
  &.--success {
    > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;

      box-shadow: 0 0 0 0.125rem v-bind('radioBoxShadow');
    }
  }
}
</style>
