<script lang="ts">
  import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";
  import Collapse from "./Collapse.svelte";
  import FaIcon from "./FaIcon.svelte";
  import TransformMeasures from "./TransformMeasures.svelte";

  const { measures }: { measures: BloodPressureMeasurement[] } = $props();
  let counter = 1;
  let views = $state([{ title: "View 1", open: true }]);
</script>

{#each views as view, i (view)}
  <Collapse bind:open={view.open}>
    {#snippet title()}
      <input class="input input-ghost" bind:value={view.title} />
      <div class="join ms-3">
        <button
          class="join-item btn btn-outline btn-primary btn-sm print:hidden"
          onclick={() => {
            views.splice(i + 1, 0, { title: `View ${++counter}`, open: false });
          }}><FaIcon icon={faAdd} /></button
        >
        {#if views.length > 1}<button
            class="join-item btn btn-outline btn-primary btn-sm print:hidden"
            onclick={() => {
              views.splice(i, 1);
            }}><FaIcon icon={faRemove} /></button
          >{/if}
      </div>
    {/snippet}
    <TransformMeasures {measures} />
  </Collapse>
{/each}
