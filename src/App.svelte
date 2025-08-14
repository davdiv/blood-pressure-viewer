<script lang="ts">
  import { faClose, faDownload } from "@fortawesome/free-solid-svg-icons";
  import Collapse from "./Collapse.svelte";
  import {
    callImportFromFile,
    callReadFromDevice,
    csvBlobURL$,
    data$,
    dataPromise$,
    fileName$,
    jsonBlobURL$,
    reset,
  } from "./data";
  import TransformMeasures from "./TransformMeasures.svelte";
  import FaIcon from "./FaIcon.svelte";

  const onFileChange = (event: any) => {
    callImportFromFile(event.target.files[0]);
    event.target.value = null;
  };
  const uid = $props.id();
</script>

<div class="navbar bg-base-100 shadow-sm gap-3 items-center">
  <div class="flex-1 flex items-center">
    <img class="logo" src="./logo.svg" alt="Blood Pressure Viewer logo" />
    <span class={{ "max-sm:hidden": !!$data$ }}>Blood Pressure Viewer</span>
  </div>
  {#if $data$?.device}
    <div class="max-sm:hidden">
      <strong>Device:</strong>
      {$data$.device}
    </div>
  {/if}
  <div class="join">
    {#if $data$}
      <a
        class="join-item btn btn-outline btn-primary print:hidden"
        download={`${fileName$()}.bpv`}
        title="Save in BPV format"
        href={$jsonBlobURL$}><FaIcon icon={faDownload} /> BPV</a
      >
      <a
        class="join-item btn btn-outline btn-primary print:hidden"
        download={`${fileName$()}.csv`}
        title="Save in CSV format"
        href={$csvBlobURL$}><FaIcon icon={faDownload} /> CSV</a
      >
    {/if}
    {#if $dataPromise$}
      <button
        type="button"
        class="join-item btn btn-outline btn-primary print:hidden"
        title="Close"
        onclick={reset}><FaIcon icon={faClose} /></button
      >
    {/if}
  </div>
</div>
<div class="m-3">
  <Collapse open={!$dataPromise$}>
    {#snippet title()}Presentation{/snippet}
    <p>
      This web application allows to extract blood pressure measures from a
      bluetooth blood pressure monitor, to show them graphically and as a list,
      and to save them in a BPV (JSON-based) or CSV file. It is also possible to
      load a previously saved BPV file.
    </p>
    <p>
      Data is processed directly in the local web browser and is not sent to any
      remote server.
    </p>
  </Collapse>
  <Collapse open={!$dataPromise$}>
    {#snippet title()}Import data{/snippet}
    {#if $dataPromise$}
      <div class="alert alert-info mt-3">
        Unless you click on the close button, importing data now from a file or
        a bluetooth device will result in a merge of the current data with the
        newly imported data.
      </div>
    {/if}
    {#if navigator.bluetooth}
      <button
        type="button"
        class="btn btn-primary mt-3"
        onclick={callReadFromDevice}
        >Import from bluetooth blood pressure monitor</button
      >
    {:else}
      <div class="alert alert-warning mt-3">
        Your web browser is not able to connect to a bluetooth blood pressure
        monitor. Check the <a href="https://caniuse.com/web-bluetooth"
          >compatible browsers here</a
        >.
      </div>
    {/if}
    <div class="mt-3">
      <label for={`${uid}-formFile`} class="me-3">Import file</label>
      <input
        class="file-input"
        type="file"
        id={`${uid}-formFile`}
        onchange={onFileChange}
      />
    </div>
  </Collapse>
  {#await $dataPromise$}
    <div class="alert alert-info mt-3">Loading...</div>
  {:catch error}
    <div class="alert alert-error mt-3">
      An error occurred :<br />
      <pre>{error}</pre>
    </div>
  {/await}
  {#if $data$}
    {#each $data$.users as user}
      <Collapse open>
        {#snippet title()}
          User {user.user ?? ""}
        {/snippet}
        <TransformMeasures measures={user.measures} />
      </Collapse>
    {/each}
  {/if}
  <div class="my-3 text-body-primary print:hidden">
    <small
      >The <a
        class="link"
        target="_blank"
        href="https://github.com/davdiv/blood-pressure-viewer">source code</a
      > of this web application is available.</small
    >
  </div>
</div>

<style>
  .logo {
    width: 3em;
    height: 3em;
  }
</style>
