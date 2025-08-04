import { importFromBluetooth } from "./connection";
import {
  decodeBloodPressureData,
  type BloodPressureMeasurement,
} from "./decoding";

export const readFromDevice = async () => {
  const data = await importFromBluetooth();
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
    users,
  };
};
