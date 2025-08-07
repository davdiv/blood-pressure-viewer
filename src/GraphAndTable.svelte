<script lang="ts">
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";
  import Collapse from "./Collapse.svelte";
  import Graph from "./Graph.svelte";
  import Table from "./Table.svelte";

  const {
    measures,
    includeTime,
  }: { measures: BloodPressureMeasurement[]; includeTime: boolean } = $props();
</script>

{#if measures.length > 1}
  <Collapse open>
    {#snippet title()}Graph{/snippet}
    <Graph data={measures}></Graph>
  </Collapse>
{/if}
<Collapse open>
  {#snippet title()}Table{/snippet}
  <Table data={[...measures].reverse()} {includeTime}></Table>
</Collapse>
