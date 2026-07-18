import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";

// login function
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toastMsg(error.message, "error");
    return false;
  }

  return true;
}

// only allow internal, relative redirect targets
function getSafeRedirect(redirectTo) {
  if (!redirectTo) return null;

  const decoded = decodeURIComponent(redirectTo);

  // must start with a single "/" (relative path), never "//" or a full URL
  if (decoded.startsWith("/") && !decoded.startsWith("//")) {
    return decoded;
  }

  return null;
}

// Login form
export function loginFunction() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("userLoginEmailInput").value.trim();
      const password = document.getElementById("userLoginPasswordInput").value;

      if (!password || !email) {
        toastMsg("All fields must not be empty", "error");
        return;
      }

      const button = document.getElementById("loginBtn");
      button.disabled = true;
      button.textContent = "Logging in...";

      try {
        const success = await login(email, password);

        if (success) {
          const params = new URLSearchParams(window.location.search);
          const safeRedirect = getSafeRedirect(params.get("redirect"));

          window.location.href = safeRedirect || "../pages/dashboard.html";
        }
      } finally {
        button.disabled = false;
        button.textContent = "Login";
      }
    });
  }
}

loginFunction();
