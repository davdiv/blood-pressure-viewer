<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    children,
    open,
  }: { title: Snippet; children: Snippet; open?: boolean } = $props();
</script>

<details class="mt-3" {open}>
  <summary class="cursor-pointer">{@render title()}</summary>
  <div class="ms-3 mt-3">
    {@render children()}
  </div>
</details>

<style>
  @media print {
    details:not([open]) {
      display: none;
    }
  }
</style>
