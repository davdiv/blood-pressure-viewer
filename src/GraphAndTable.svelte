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
  <details open>
    <summary>Graph</summary>
    <Graph data={measures}></Graph>
  </details>
{/if}
<details open>
  <summary>Table</summary>
  <Table data={[...measures].reverse()} {includeTime}></Table>
</details>
