import { addWeeks, differenceInWeeks, formatISO } from "date-fns";
import { Status, type BloodPressureMeasurement } from "./bluetooth/decoding";

class Average {
  #count = 0;
  #value = 0;
  add(value: number | null | undefined, coef = 1) {
    if (value == null || isNaN(value)) {
      return;
    }
    this.#count += coef;
    this.#value += value * coef;
  }
  result() {
    return this.#value / this.#count;
  }
}

class BloodPressureAverage<T> {
  timestamp: string;
  systolic = new Average();
  diastolic = new Average();
  mean = new Average();
  pulseRate = new Average();
  sources: T[] = [];
  constructor(public date: Date) {
    this.timestamp = formatISO(date, { representation: "date" });
  }

  add(measure: BloodPressureMeasurement, source: T) {
    const coef = (measure.status ?? 0) & Status.EXT_TRIPLE_MEASURE ? 3 : 1;
    this.systolic.add(measure.systolic, coef);
    this.diastolic.add(measure.diastolic, coef);
    this.mean.add(measure.mean, coef);
    this.pulseRate.add(measure.pulseRate, coef);
    this.sources.push(source);
  }

  result(): BloodPressureMeasurement {
    return {
      systolic: this.systolic.result(),
      diastolic: this.diastolic.result(),
      mean: this.mean.result(),
      pulseRate: this.pulseRate.result(),
      timestamp: this.timestamp,
    };
  }
}

export const computeTimeBasedAverages = (
  measures: BloodPressureMeasurement[]
) => {
  let lastDate: Date | null = null;
  const dayMap = new Map<
    string,
    BloodPressureAverage<BloodPressureMeasurement>
  >();
  for (const measure of measures) {
    const timestamp = measure.timestamp;
    if (timestamp) {
      const timestampDate = new Date(timestamp);
      const date = new Date(
        timestampDate.getFullYear(),
        timestampDate.getMonth(),
        timestampDate.getDate(),
        12,
        0,
        0
      );
      if (!lastDate || date > lastDate) {
        lastDate = date;
      }
      const day = formatISO(date, { representation: "date" });
      let dayObject = dayMap.get(day);
      if (!dayObject) {
        dayObject = new BloodPressureAverage(date);
        dayMap.set(day, dayObject);
      }
      dayObject.add(measure, measure);
    }
  }
  if (!lastDate) {
    return null;
  }
  const dayMapValues = [...dayMap.values()];
  const allAverage = new BloodPressureAverage(lastDate);
  const weekMap = new Map<
    number,
    BloodPressureAverage<BloodPressureAverage<BloodPressureMeasurement>>
  >();
  for (const dayAverage of dayMapValues) {
    const weekNumber = differenceInWeeks(lastDate, dayAverage.date);
    let weekAverage = weekMap.get(weekNumber);
    if (!weekAverage) {
      weekAverage = new BloodPressureAverage(addWeeks(lastDate, -weekNumber));
      weekMap.set(weekNumber, weekAverage);
    }
    const dayAverageResult = dayAverage.result();
    allAverage.add(dayAverageResult, null);
    weekAverage.add(dayAverageResult, dayAverage);
  }
  const weekMapValues = [...weekMap.values()];
  return {
    average: allAverage.result(),
    sources: weekMapValues.map((value) => ({
      average: value.result(),
      sources: value.sources.map((value) => ({
        average: value.result(),
        sources: value.sources,
      })),
    })),
  };
};
