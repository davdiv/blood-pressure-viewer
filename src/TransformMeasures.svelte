<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import { computeTimeBasedAverages } from "./average";
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";
  import { applyFilters, type Filter, relevantFilters } from "./filters";
  import GraphAndTable from "./GraphAndTable.svelte";
  import Ban from "./icons/Ban.svelte";
  import Check from "./icons/Check.svelte";

  const { measures }: { measures: BloodPressureMeasurement[] } = $props();
  const filters = $derived(relevantFilters(measures));
  const filtersValue = new SvelteMap<Filter, boolean>();
  const filteredMeasures = $derived(applyFilters(measures, filtersValue));

  let averageMode: "measure" | "day" | "week" | "all" = $state("measure");

  const averages = $derived(computeTimeBasedAverages(filteredMeasures));
  const measuresToDisplay = $derived(
    averageMode === "measure" ? filteredMeasures : averages?.[averageMode]
  );

  const toggleFilter = (filter: Filter) => {
    const currentValue = filtersValue.get(filter);
    if (currentValue === true) {
      filtersValue.set(filter, false);
    } else if (currentValue === false) {
      filtersValue.delete(filter);
    } else {
      filtersValue.set(filter, true);
    }
  };
</script>

{#if filters.length > 0}
  <details>
    <summary>Filters ({filtersValue.size})</summary>
    <div class="btn-group-vertical mb-3" role="group" aria-label="Filters">
      {#each filters as filter}
        {@const active = filtersValue.get(filter.filter)}
        <button
          title={filter.description}
          class={["btn btn-outline-primary", { active: active != null }]}
          onclick={() => toggleFilter(filter.filter)}
        >
          {#if active === true}<Check />{:else if active === false}<Ban
            />{:else}{/if}
          {filter.name}</button
        >
      {/each}
    </div>
  </details>
{/if}

<div class="mb-3">
  <label for="averageMode" class="form-label">Average mode</label>
  <select id="averageMode" class="form-select" bind:value={averageMode}>
    <option value={"measure"}>Measure (no average)</option>
    <option value={"day"}>Day</option>
    <option value={"week"}>Week</option>
    <option value={"all"}>All</option>
  </select>
</div>

{#if measuresToDisplay && measuresToDisplay.length > 0}
  <GraphAndTable
    measures={measuresToDisplay}
    includeTime={averageMode === "measure"}
  />
{:else}
  <div class="alert alert-info">
    There is no measure matching current filters.
  </div>
{/if}
