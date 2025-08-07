import { formatISO } from "date-fns";
import type { BloodPressureMeasurement } from "./bluetooth/decoding";
import type { DataStructure } from "./bluetooth";

const removeDuplicates = (measures: BloodPressureMeasurement[]) => {
  const measuresSet = new Set();
  return measures.filter((measure) => {
    const key = `${
      measure.timestamp ? formatISO(new Date(measure.timestamp)) : ""
    },${measure.mean},${measure.systolic},${measure.diastolic},${
      measure.pulseRate ?? ""
    },${measure.status ?? ""},${measure.user ?? ""}`;
    if (!measuresSet.has(key)) {
      measuresSet.add(key);
      return true;
    }
    return false;
  });
};

const sortByDate = (
  { timestamp: t1 }: BloodPressureMeasurement,
  { timestamp: t2 }: BloodPressureMeasurement
) => {
  if (t1 && t2) {
    return new Date(t1).getTime() - new Date(t2).getTime();
  }
  return t1 ? -1 : t2 ? 1 : 0;
};

export const merge = (
  existingData: DataStructure | undefined,
  incomingData: DataStructure
): DataStructure => {
  if (!existingData) {
    return incomingData;
  }
  const device = existingData.device ?? incomingData.device;
  const timestamp =
    new Date(existingData.timestamp ?? 0).getTime() >
    new Date(incomingData.timestamp ?? 0).getTime()
      ? existingData.timestamp
      : incomingData.timestamp;
  const usersMap = new Map<number | undefined, BloodPressureMeasurement[]>();
  for (const user of [...existingData.users, ...incomingData.users]) {
    let measures = usersMap.get(user.user);
    if (!measures) {
      measures = [];
      usersMap.set(user.user, measures);
    }
    measures.push(...user.measures);
  }

  return {
    device,
    timestamp,
    users: [...usersMap.entries()].map(([user, measures]) => ({
      user,
      measures: removeDuplicates(measures).sort(sortByDate),
    })),
  };
};
