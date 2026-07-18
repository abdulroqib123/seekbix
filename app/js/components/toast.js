import { loadComponent } from "../components/loadComponent.js";

let toastLoaded = false;

export async function toastMsg(message, typeClass) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  // Load the toast markup once, not on every call, avoids fetch races
  if (!toastLoaded) {
    await loadComponent("../components/toast.html", "toast");
    toastLoaded = true;
  }

  const msg = toast.querySelector(".modalMessage");
  if (!msg) return;

  toast.classList.remove("success", "error", "warning", "info");
  toast.classList.add(typeClass);

  toast.classList.remove("slideIn");
  void toast.offsetWidth; // reflow trick to restart the CSS transition
  toast.classList.add("slideIn");

  msg.textContent = message;

  if (toast._timeout) {
    clearTimeout(toast._timeout);
  }

  toast._timeout = setTimeout(() => {
    toast.classList.remove("slideIn");
  }, 5000);
}