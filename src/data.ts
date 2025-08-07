import { computed, writable } from "@amadeus-it-group/tansu";
import { readFromDevice } from "./bluetooth";
import { resolveStorePromise, toBlobURL } from "./storeUtils";
import { merge } from "./merge";

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
        `Timestamp,Systolic,Diastolic,Pulse rate,Status,User\n${data$()
          ?.users.map(
            (user) =>
              user.measures
                .map(
                  (a) =>
                    `${a.timestamp},${a.systolic},${a.diastolic},${
                      a.pulseRate ?? ""
                    },${a.status?.toString(2).padStart(16, "0") ?? ""},${
                      user.user ?? ""
                    }`
                )
                .join("\n") ?? ""
          )
          .join("\n")}`,
      ],
      { type: "text/csv" }
    )
);
export const csvBlobURL$ = toBlobURL(csvBlob$);

const importFromDevice = async () => {
  return merge(await dataPromise$(), await readFromDevice());
};

export async function callReadFromDevice() {
  const promise = importFromDevice();
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

const importFromFile = async (file: File | null) =>
  merge(await dataPromise$(), await asyncOpenFile(file));

const importFromFileSystemHandle = async (file: FileSystemFileHandle) =>
  await importFromFile(await file.getFile());

export function callImportFromFile(file: File | null) {
  dataPromise$.set(importFromFile(file));
}

export function callImportFromFileSystemHandle(file: FileSystemFileHandle) {
  dataPromise$.set(importFromFileSystemHandle(file));
}

export function reset() {
  dataPromise$.set(undefined);
}
