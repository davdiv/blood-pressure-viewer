<script lang="ts">
  import { Status, type BloodPressureMeasurement } from "./bluetooth/decoding";
  import FaIcon from "./FaIcon.svelte";
  import { faWarning, faBedPulse } from "@fortawesome/free-solid-svg-icons";
  import { classificationClasses, classify } from "./classificationLogic";

  const f2 = (a: number) => `${a}`.padStart(2, "0");
  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return `${f2(d.getDate())}/${f2(d.getMonth() + 1)}/${d.getFullYear()}${includeTime ? ` ${f2(d.getHours())}:${f2(d.getMinutes())}` : ""}`;
  };
  const {
    data,
    includeTime,
  }: { data: BloodPressureMeasurement[]; includeTime: boolean } = $props();
</script>

<div class="sm:columns-2 lg:columns-3 xl:columns-4">
  <table class="table text-center table-md">
    <thead>
      <tr
        ><th>Date</th><th title="Systolic (mmHg)">Sys</th><th
          title="Diastolic (mmHg)">Dia</th
        ><th title="Pulse rate (beats/min)">Pul</th><th></th></tr
      >
    </thead>
    <tbody>
      {#each data as measure}
        {@const classification = classify(measure)}
        {@const cssClassification = classificationClasses[classification]}
        <tr
          ><td class={cssClassification}>{formatDate(measure.timestamp)}</td><td
            class={cssClassification}>{Math.round(measure.systolic)}</td
          ><td class={cssClassification}>{Math.round(measure.diastolic)}</td><td
            class={cssClassification}
            >{measure.pulseRate != null
              ? Math.round(measure.pulseRate)
              : ""}</td
          ><td class={cssClassification}>
            {#if (measure.status ?? 0) & Status.IRREGULAR_PULSE}<span
                class="badge badge-warning cursor-default"
                title="Irregular pulse"><FaIcon icon={faWarning} /></span
              >{/if}
            {#if (measure.status ?? 0) & Status.EXT_TRIPLE_MEASURE}<span
                class="badge badge-info cursor-default"
                title="Average of 3 measures">&times;3</span
              >{/if}
            {#if (measure.status ?? 0) & Status.EXT_MISSING_REST}<span
                class="badge badge-warning cursor-default"
                title="Missing rest detected"><FaIcon icon={faBedPulse} /></span
              >{/if}
            {#if (measure.status ?? 0) & Status.EXT_UNKNOWN_REST}<span
                class="badge badge-warning cursor-default"
                title="Unknown rest status"><FaIcon icon={faBedPulse} /> ?</span
              >{/if}</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>

<style>
  td,
  th {
    padding-inline: 0.05em;
    padding-block: 0.5em;
  }

  .badge {
    padding-inline: 0.1em;
  }
</style>
