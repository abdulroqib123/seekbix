import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";
import { loadComponent } from "../components/loadComponent.js";

//Signup funtion
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

//Signup form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupNameInput").value.trim();
    const email = document.getElementById("userSignupEmailInput").value.trim();
    const password = document
      .getElementById("userSignupPasswordInput")
      .value.trim();
    const confirmPassword = document
      .getElementById("userSignupConfirmPasswordInput")
      .value.trim();

    if (!name || !password || !email || !confirmPassword) {
      toastMsg("All fields must not be empty", "error");
      return;
    } else if (!email.includes("@")) {
      toastMsg("Please enter a valid email", "error");
      return;
    } else if (password != confirmPassword) {
      toastMsg("Passwords do not match", "error");
      return;
    } else if (password.length < 6) {
      toastMsg("Password must be at least 6 characters", "error");
      return;
    }

    //disable button
    const button = signupForm.querySelector("button");
    button.disabled = true;
    button.textContent = "signing up...";

    try {
      const success = await signup(name, email, password);

      if (success) {
        // After successful login/signup:
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("redirect");

        if (redirectTo) {
          // Send them back to the invite page with the token
          window.location.href = decodeURIComponent(redirectTo);
        } else {
          // Default behavior
          window.location.href = "../dashboard.html";
        }
      }
    } finally {
      button.disabled = false;
      button.textContent = "signup";
    }
  });
}
