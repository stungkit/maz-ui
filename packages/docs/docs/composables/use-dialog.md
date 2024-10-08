---
title: useDialog
description: Vue composable for handling dialog plugin in your components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install [dialog plugin](./../plugins/dialog.md#install) before use it
:::

::: tip
More info about [dialog plugin](./../plugins/dialog.md) in its documentation
:::

## Usage

<ComponentDemo>
  <MazBtn
    @click="openDialog"
  >
    Open Dialog
  </MazBtn>

  <template #code>

  ```vue
  <template>
    <MazBtn @click="openDialog">
      Open Dialog
    </MazBtn>
  </template>

  <script lang="ts" setup>
    import { useDialog } from 'maz-ui'

    const dialog = useDialog()

    function openDialog() {
      dialog.open({
        title: 'Dialog title',
        message: 'Dialog message',
      })
    }
  </script>
  ```

  </template>

</ComponentDemo>

<script lang="ts" setup>
  import { useDialog } from 'maz-ui'

  const dialog = useDialog()

  function openDialog() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
    })
  }
</script>
