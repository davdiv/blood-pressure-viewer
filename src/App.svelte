<script lang="ts">
  import {
    callReadFromDevice,
    callImportFromFile,
    csvBlobURL$,
    data$,
    dataPromise$,
    jsonBlobURL$,
    reset,
  } from "./data";
  import TransformMeasures from "./TransformMeasures.svelte";

  const onFileChange = (event: any) => {
    callImportFromFile(event.target.files[0]);
    event.target.value = null;
  };
</script>

<div class="container">
  <!-- svelte-ignore a11y-missing-attribute -->
  <h2 class="mt-3">
    <img class="logo" src="./logo.svg" /> Blood Pressure Viewer
  </h2>
  <details open={!$dataPromise$}>
    <summary>Presentation</summary>
    <div class="ms-3">
      <p>
        This web application allows to extract blood pressure measures from a
        bluetooth blood pressure monitor, to show them graphically and as a
        list, and to save them in a BPV (JSON-based) or CSV file. It is also
        possible to load a previously saved BPV file.
      </p>
      <p>
        Data is processed directly in the local web browser and is not sent to
        any remote server.
      </p>
    </div>
  </details>
  <details open={!$dataPromise$}>
    <summary>Import data</summary>
    <div class="ms-3">
      {#if $dataPromise$}
        <div class="alert alert-info mt-3">
          Unless you click on the reset button, importing data now from a file
          or a bluetooth device will result in a merge of the current data with
          the newly imported data.
        </div>
      {/if}
      {#if navigator.bluetooth}
        <button
          type="button"
          class="btn btn-primary mt-3"
          on:click={callReadFromDevice}
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
        <label for="formFile" class="form-label">Import file</label>
        <input
          class="form-control"
          type="file"
          id="formFile"
          on:change={onFileChange}
        />
      </div>
    </div>
  </details>
  {#if $dataPromise$}
    <button
      type="button"
      class="btn btn-outline-secondary mt-3"
      on:click={reset}>Reset</button
    >
  {/if}
  {#await $dataPromise$}
    <div class="alert alert-info mt-3">Loading...</div>
  {:catch error}
    <div class="alert alert-danger mt-3">
      An error occurred :<br />
      <pre>{error}</pre>
    </div>
  {/await}
  {#if $data$}
    <a
      class="btn btn-outline-secondary mt-3"
      download={`blood-pressure-data.bpv`}
      href={$jsonBlobURL$}>Save in BPV format</a
    >
    <a
      class="btn btn-outline-secondary mt-3"
      download={`blood-pressure-data.csv`}
      href={$csvBlobURL$}>Save in CSV format</a
    >

    {#if $data$.device}
      <div class="my-3">
        <strong>Device:</strong>
        {$data$.device}
      </div>
    {/if}
    {#each $data$.users as user}
      <details open>
        <summary>User {user.user ?? ""}</summary>
        <div class="ms-4">
          <TransformMeasures measures={user.measures} />
        </div>
      </details>
    {/each}
  {/if}
  <div class="my-3 text-body-secondary">
    <small
      >The <a
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
