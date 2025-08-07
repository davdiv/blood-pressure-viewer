import type { BloodPressureMeasurement } from "./bluetooth/decoding";
import "./classificationStyle.css";

export enum Classification {
  HypoTension,
  NormalOptimal,
  Normal,
  NormalHigh,
  HypertensionLight,
  HypertensionMedium,
  HypertensionSevere,
}

export const classify = ({
  systolic,
  diastolic,
}: BloodPressureMeasurement): Classification => {
  if (systolic >= 180 || diastolic >= 110) {
    return Classification.HypertensionSevere;
  }
  if (systolic >= 160 || diastolic >= 100) {
    return Classification.HypertensionMedium;
  }
  if (systolic < 90 || diastolic < 60) {
    return Classification.HypoTension;
  }
  if (systolic >= 140 || diastolic >= 90) {
    return Classification.HypertensionLight;
  }
  if (systolic >= 130 || diastolic >= 85) {
    return Classification.NormalHigh;
  }
  if (systolic >= 120 || diastolic >= 80) {
    return Classification.Normal;
  }
  return Classification.NormalOptimal;
};

export const classificationClasses: Record<Classification, string> = {
  [Classification.HypertensionSevere]: "bg-error",
  [Classification.HypertensionMedium]: "bg-warning",
  [Classification.HypertensionLight]: "bg-pre-warning",
  [Classification.NormalHigh]: "bg-success",
  [Classification.Normal]: "bg-success",
  [Classification.NormalOptimal]: "bg-success",
  [Classification.HypoTension]: "bg-warning",
};
