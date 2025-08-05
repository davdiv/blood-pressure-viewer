import type { SvelteMap } from "svelte/reactivity";
import { Status, type BloodPressureMeasurement } from "./bluetooth/decoding";
import { Classification, classify } from "./classificationLogic";

export type Filter = (measure: BloodPressureMeasurement) => boolean;

const isInTimeRange = (
  timestamp: string | undefined,
  minHour: number,
  maxHour: number
) => {
  if (!timestamp) {
    return false;
  }
  const hour = new Date(timestamp).getHours();
  return hour >= minHour && hour < maxHour;
};

export const filters: { name: string; description: string; filter: Filter }[] =
  [
    {
      name: "Morning",
      description: "Morning measures (5-10 am)",
      filter: (measure) => isInTimeRange(measure.timestamp, 5, 10),
    },
    {
      name: "Evening",
      description: "Evening measures  (6-11 pm)",
      filter: (measure) => isInTimeRange(measure.timestamp, 18, 23),
    },
    {
      name: "Hypotension",
      description: "Measures showing hypotension",
      filter: (measure) => classify(measure) === Classification.HypoTension,
    },
    {
      name: "Normal tension",
      description: "Measures showing normal tension",
      filter: (measure) => {
        const value = classify(measure);
        return (
          value >= Classification.NormalOptimal &&
          value <= Classification.NormalHigh
        );
      },
    },
    {
      name: "Hypertension",
      description: "Measures showing hypertension",
      filter: (measure) =>
        classify(measure) >= Classification.HypertensionLight,
    },
    {
      name: "Irregular pulse",
      description: "Measures with irregular pulse",
      filter: (measure) => !!((measure.status ?? 0) & Status.IRREGULAR_PULSE),
    },
    {
      name: "Missing rest",
      description: "Measures detected as missing rest",
      filter: (measure) => !!((measure.status ?? 0) & Status.EXT_MISSING_REST),
    },
    {
      name: "x3",
      description: "Triple measures",
      filter: (measure) =>
        !!((measure.status ?? 0) & Status.EXT_TRIPLE_MEASURE),
    },
  ];

export const isFilterRelevant = (
  filter: Filter,
  measures: BloodPressureMeasurement[]
) => {
  let result = null;
  for (const measure of measures) {
    const newResult = !!filter(measure);
    if (result === null) {
      result = newResult;
    } else if (result !== newResult) {
      return true;
    }
  }
  return false;
};

export const relevantFilters = (measures: BloodPressureMeasurement[]) =>
  filters.filter(({ filter }) => isFilterRelevant(filter, measures));

export const applyFilters = (
  measures: BloodPressureMeasurement[],
  filters: SvelteMap<Filter, boolean>
) =>
  measures.filter((measure) => {
    for (const [filter, expectedFilterValue] of filters) {
      if (!!filter(measure) !== expectedFilterValue) {
        return false;
      }
    }
    return true;
  });
