import { supabase } from "../supabase.js";

// redirect if not logged in
const {
  data: { session },
} = await supabase.auth.getSession();
if (!session) {
  window.location.href = "../auth"; // or login.html, whichever your entry page is
}


//signout
async function signout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }
  toastMsg("Logged out successfully!", "success");

  setTimeout(() => {
    window.location.href = "/auth/";
  }, 3000);
}

 function attachSignoutEvents() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#logoutBtn");

    if (btn) {
      signout();

      window.location.href = "../auth"
    }
  });
}
attachSignoutEvents();