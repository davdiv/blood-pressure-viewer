import { computed, writable } from "@amadeus-it-group/tansu";
import { readFromDevice } from "./bluetooth";
import { resolveStorePromise, toBlobURL } from "./storeUtils";

export const dataPromise$ = writable<
  ReturnType<typeof readFromDevice> | undefined
>(undefined);

export const data$ = resolveStorePromise(dataPromise$);
export const jsonBlob$ = computed(
  () =>
    new Blob([JSON.stringify(data$(), null, " ")], {
      type: "application/json",
    })
);
export const jsonBlobURL$ = toBlobURL(jsonBlob$);
export const csvBlob$ = computed(
  () =>
    new Blob(
      [
        `Timestamp\tSystolic\tDiastolic\tPulse rate\tStatus\tUser\n${data$()?.users.map(
          (user) =>
            user.measures
              .map(
                (a) =>
                  `${a.timestamp}\t${a.systolic}\t${a.diastolic}\t${
                    a.pulseRate ?? ""
                  }\t${a.status ?? ""}\t${user.user ?? ""}`
              )
              .join("\n") ?? ""
        )}`,
      ],
      { type: "text/csv" }
    )
);
export const csvBlobURL$ = toBlobURL(csvBlob$);

export async function callReadFromDevice() {
  const promise = readFromDevice();
  dataPromise$.set(promise);
  try {
    await promise;
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      if (dataPromise$() === promise) {
        dataPromise$.set(undefined);
      }
    }
  }
}

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  });

const asyncOpenFile = async (file: File | null) => {
  if (!file) {
    return null;
  }
  const fileContent = await readFile(file);
  return JSON.parse(fileContent);
};

export function callReadFromFile(file: File | null) {
  dataPromise$.set(asyncOpenFile(file));
}

export function reset() {
  dataPromise$.set(undefined);
}
