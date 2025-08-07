import { formatISO } from "date-fns";
import { importFromBluetooth } from "./connection";
import {
  decodeBloodPressureData,
  type BloodPressureMeasurement,
} from "./decoding";

export interface DataStructure {
  device?: string;
  timestamp?: string;
  users: { user?: number; measures: BloodPressureMeasurement[] }[];
}

export const readFromDevice = async (): Promise<DataStructure> => {
  const data = await importFromBluetooth();
  const importTime = formatISO(new Date());
  const users = [];
  const usersMap = new Map<number | undefined, BloodPressureMeasurement[]>();
  for (const measure of data.measures) {
    const { user, ...decoded } = decodeBloodPressureData(measure);
    let userMeasures = usersMap.get(user);
    if (!userMeasures) {
      userMeasures = [];
      users.push({ user, measures: userMeasures });
      usersMap.set(user, userMeasures);
    }
    userMeasures.push(decoded);
  }
  return {
    device: data.deviceName,
    timestamp: importTime,
    users,
  };
};
