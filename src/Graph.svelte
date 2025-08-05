<script lang="ts" module>
  import Chart from "chart.js/auto";
  import { enUS } from "date-fns/locale";
  import "chartjs-adapter-date-fns";
  import zoom from "chartjs-plugin-zoom";
  import type { BloodPressureMeasurement } from "./bluetooth/decoding";

  Chart.register(zoom);
</script>

<script lang="ts">
  const { data }: { data: BloodPressureMeasurement[] } = $props();

  const chart = (dom: HTMLCanvasElement, data: BloodPressureMeasurement[]) => {
    const instance = new Chart(dom, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Systolic (mmHg)",
            data: data.map((item) => ({ x: item.timestamp, y: item.systolic })),
          },
          {
            label: "Diastolic (mmHg)",
            data: data.map((item) => ({
              x: item.timestamp,
              y: item.diastolic,
            })),
          },
          {
            label: "Pulse rate (beats/min)",
            data: data.map((item) => ({
              x: item.timestamp,
              y: item.pulseRate,
            })),
          },
        ],
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
            pan: {
              enabled: true,
              mode: "x",
            },
            limits: {
              x: { min: "original", max: "original" },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            adapters: {
              date: {
                locale: enUS,
              },
            },
          },
        },
      },
    });
    return {
      destroy() {
        instance.destroy();
      },
    };
  };
</script>

{#key data}
  <canvas use:chart={data}></canvas>
{/key}
