import { mount } from "svelte";
import App from "./App.svelte";
import "bootstrap/dist/css/bootstrap.min.css";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" });
  });
}
