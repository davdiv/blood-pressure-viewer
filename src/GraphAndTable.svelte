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
    <div class="-ms-6">
      <Graph data={measures}></Graph>
    </div>
  </Collapse>
{/if}
<Collapse open>
  {#snippet title()}Table{/snippet}
  <div class="-ms-6">
    <Table data={[...measures].reverse()} {includeTime}></Table>
  </div>
</Collapse>
