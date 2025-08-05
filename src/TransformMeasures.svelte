<script lang="ts">
  import { computeTimeBasedAverages } from "./average";
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";
  import GraphAndTable from "./GraphAndTable.svelte";

  const { measures }: { measures: BloodPressureMeasurement[] } = $props();
  let averageMode: "measure" | "day" | "week" | "all" = $state("measure");

  const averages = $derived(computeTimeBasedAverages(measures));
  const measuresToDisplay = $derived(
    averageMode === "measure" ? measures : averages?.[averageMode]
  );
</script>

<div class="mb-3">
  <label for="averageMode" class="form-label">Average mode</label>
  <select id="averageMode" class="form-select" bind:value={averageMode}>
    <option value={"measure"}>Measure (no average)</option>
    <option value={"day"}>Day</option>
    <option value={"week"}>Week</option>
    <option value={"all"}>All</option>
  </select>
</div>

{#if measuresToDisplay}
  <GraphAndTable
    measures={measuresToDisplay}
    includeTime={averageMode === "measure"}
  />
{/if}
