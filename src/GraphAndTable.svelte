<script lang="ts">
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";
  import Graph from "./Graph.svelte";
  import Table from "./Table.svelte";

  const {
    measures,
    includeTime,
  }: { measures: BloodPressureMeasurement[]; includeTime: boolean } = $props();
</script>

{#if measures.length > 1}
  <Graph data={measures}></Graph>
{/if}
<Table data={[...measures].reverse()} {includeTime}></Table>
