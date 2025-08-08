import { formatISO } from "date-fns";

export enum Status {
  BODY_MOVEMENT = 1,
  CUFF_TOO_LOOSE = 0b10,
  IRREGULAR_PULSE = 0b100,
  IMPROPER_POSITION = 0b100000,

  // values found on Beurer BM64:
  EXT_TRIPLE_MEASURE = 0x1000,
  EXT_MISSING_REST = 0x4000,
  EXT_UNKNOWN_REST = 0x8000,
}

export interface BloodPressureMeasurement {
  systolic: number;
  diastolic: number;
  mean: number;
  timestamp?: string;
  pulseRate?: number;
  user?: number;
  status?: number;
}

export const fromMedFloat16 = (bytes: DataView, offset = 0) => {
  const all = bytes.getUint16(offset, true);
  if (all === 0x07ff || all === 0x0800 || all === 0x0801) return NaN;
  if (all === 0x07fe) return Infinity;
  if (all === 0x0802) return -Infinity;
  let exp = (all & 0x7000) >>> 12;
  if (all & 0x8000) {
    exp |= 0xfffffff8;
  }
  let base = all & 0x07ff;
  if (all & 0x0800) {
    base |= 0xfffff800;
  }
  return base * Math.pow(10, exp);
};

const kPaTommHg = 760000 / 101325;

export const decodeBloodPressureData = (
  bytes: DataView
): BloodPressureMeasurement => {
  // cf https://www.bluetooth.com/specifications/gss/
  const res: BloodPressureMeasurement = {
    systolic: 0,
    diastolic: 0,
    mean: 0,
  };
  let i = 0;
  const flags = bytes.getUint8(i);
  i += 1;
  res.systolic = fromMedFloat16(bytes, i);
  i += 2;
  res.diastolic = fromMedFloat16(bytes, i);
  i += 2;
  res.mean = fromMedFloat16(bytes, i);
  i += 2;
  if (flags & 0b1) {
    // unit = kPa
    res.systolic *= kPaTommHg;
    res.diastolic *= kPaTommHg;
    res.mean *= kPaTommHg;
  }
  if (flags & 0b10) {
    // timestamp
    res.timestamp = formatISO(
      new Date(
        bytes.getUint16(i, true),
        bytes.getUint8(i + 2) - 1,
        bytes.getUint8(i + 3),
        bytes.getUint8(i + 4),
        bytes.getUint8(i + 5),
        bytes.getUint8(i + 6)
      )
    );
    i += 7;
  }
  if (flags & 0b100) {
    // pulse rate
    res.pulseRate = fromMedFloat16(bytes, i);
    i += 2;
  }
  if (flags & 0b1000) {
    // user id
    res.user = bytes.getUint8(i);
    i += 1;
  }
  if (flags & 0b10000) {
    // measurement status
    res.status = bytes.getUint16(i, true);
    i += 2;
  }
  return res;
};
