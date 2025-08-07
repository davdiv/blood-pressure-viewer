import { mount } from "svelte";
import App from "./App.svelte";
import "bootstrap/dist/css/bootstrap.min.css";
import { callImportFromFileSystemHandle } from "./data";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" });
  });
}

if ("launchQueue" in window) {
  (window as any).launchQueue.setConsumer((launchParams: any) => {
    if (launchParams.files && launchParams.files.length) {
      callImportFromFileSystemHandle(launchParams.files[0]);
    }
  });
}
