import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";

// redirect if not logged in
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "../auth/";
}

// also catch session expiry mid-use, not just on load
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    window.location.href = "../auth/";
  }
});

// signout
async function signout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    await toastMsg(error.message, "error");
    return;
  }

  await toastMsg("Logged out successfully!", "success");

  setTimeout(() => {
    window.location.href = "../auth/";
  }, 3000);
}

function attachSignoutEvents() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#logoutBtn");

    if (btn) {
      signout(); 
    }
  });
}

attachSignoutEvents();
