import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";

// only allow internal, relative redirect targets
function getSafeRedirect(redirectTo) {
  if (!redirectTo) return null;

  const decoded = decodeURIComponent(redirectTo);

  if (decoded.startsWith("/") && !decoded.startsWith("//")) {
    return decoded;
  }

  return null;
}

// Signup function
async function signup(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    toastMsg(error.message, "error");
    return false;
  }

  toastMsg("Account created successfully!", "success");
  return true;
}

// Signup form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupNameInput").value.trim();
    const email = document.getElementById("userSignupEmailInput").value.trim();
    const password = document.getElementById("userSignupPasswordInput").value;
    const confirmPassword = document.getElementById(
      "userSignupConfirmPasswordInput",
    ).value;

    if (!name || !password || !email || !confirmPassword) {
      toastMsg("All fields must not be empty", "error");
      return;
    } else if (!email.includes("@")) {
      toastMsg("Please enter a valid email", "error");
      return;
    } else if (password !== confirmPassword) {
      toastMsg("Passwords do not match", "error");
      return;
    } else if (password.length < 6) {
      toastMsg("Password must be at least 6 characters", "error");
      return;
    }

    const button = signupForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Signing up...";

    try {
      const success = await signup(name, email, password);

      if (success) {
        const params = new URLSearchParams(window.location.search);
        const safeRedirect = getSafeRedirect(params.get("redirect"));

        window.location.href = safeRedirect || "../pages/dashboard.html";
      }
    } finally {
      button.disabled = false;
      button.textContent = "Signup";
    }
  });
}
