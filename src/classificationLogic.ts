import type { BloodPressureMeasurement } from "./bluetooth/decoding";
import "./classificationStyle.css";

export enum Classification {
  HypertensionSevere,
  HypertensionMedium,
  HypertensionLight,
  NormalHigh,
  Normal,
  NormalOptimal,
  HypoTension,
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
  [Classification.HypertensionSevere]: "text-bg-danger",
  [Classification.HypertensionMedium]: "text-bg-warning",
  [Classification.HypertensionLight]: "text-bg-pre-warning",
  [Classification.NormalHigh]: "text-bg-success",
  [Classification.Normal]: "text-bg-success",
  [Classification.NormalOptimal]: "text-bg-success",
  [Classification.HypoTension]: "text-bg-warning",
};
