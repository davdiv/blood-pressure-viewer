export interface BloodPressureRawMeasures {
  deviceName?: string;
  measures: DataView[];
}

export const importFromBluetooth =
  async (): Promise<BloodPressureRawMeasures> => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ["blood_pressure"] }],
    });
    const deviceName = device.name;
    const server = await device.gatt!.connect()!;
    const service = await server.getPrimaryService("blood_pressure");
    const measurement = await service.getCharacteristic(
      "blood_pressure_measurement"
    );
    const measures: DataView<ArrayBufferLike>[] = [];
    measurement.addEventListener("characteristicvaluechanged", () => {
      const value = measurement.value!;
      measures.push(value);
    });
    await measurement.startNotifications();
    await new Promise((resolve) =>
      device.addEventListener("gattserverdisconnected", resolve)
    );
    return { deviceName, measures };
  };
