<script lang="ts">
  import { Status, type BloodPressureMeasurement } from "./bluetooth/decoding";
  import Warning from "./icons/Warning.svelte";
  import BedPulse from "./icons/BedPulse.svelte";
  const f2 = (a: number) => `${a}`.padStart(2, "0");
  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return `${f2(d.getDate())}/${f2(d.getMonth() + 1)}/${d.getFullYear()} ${f2(d.getHours())}:${f2(d.getMinutes())}`;
  };
  const { data }: { data: BloodPressureMeasurement[] } = $props();
</script>

<table class="table">
  <thead>
    <tr
      ><th>Date</th><th title="Systolic (mmHg)">Sys</th><th
        title="Diastolic (mmHg)">Dia</th
      ><th title="Pulse rate (/min)">Pul</th></tr
    >
  </thead>
  <tbody class="table-group-divider">
    {#each data as measure}
      <tr
        ><td>{formatDate(measure.timestamp)}</td><td>{measure.systolic}</td><td
          >{measure.diastolic}</td
        ><td
          >{measure.pulseRate ??
            ""}{#if (measure.status ?? 0) & Status.IRREGULAR_PULSE}<span
              title="Irregular pulse"><Warning /></span
            >{/if}
          {#if (measure.status ?? 0) & Status.EXT_TRIPLE_MEASURE}<span
              class="badge text-bg-secondary"
              title="Mean of 3 measures">&times;3</span
            >{/if}
          {#if (measure.status ?? 0) & Status.EXT_MISSING_REST}<span
              title="Missing rest detected"><BedPulse /></span
            >{/if}</td
        ></tr
      >
    {/each}
  </tbody>
</table>
