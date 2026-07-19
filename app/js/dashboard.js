import { toastMsg } from "./components/toast.js";
import { supabase } from "./supabase.js";
import { initSearch } from "./search.js";

let currentEntryId = null; // null = new entry, otherwise = editing existing

const entryTitle = document.getElementById("entryTitle");
const entryType = document.getElementById("entryType");
const contentInput = document.getElementById("contentInput");
const entryList = document.querySelector(".entry-list");
const saveBtn = document.getElementById("saveEntryBtn");
const newEntryBtn = document.getElementById("newEntry");

async function loadEntries() {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  entryList.innerHTML = "";

  if (data.length === 0) {
    entryList.innerHTML = `<p class="empty-state-text">You have no entries yet.</p>`;
    return;
  }

  data.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "entry-list-item";
    item.dataset.id = entry.id;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open entry: ${entry.title}`);

    const title = document.createElement("p");
    title.textContent = entry.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("icon-btn", "delete-btn");
    deleteBtn.title = "Delete entry";
    deleteBtn.setAttribute("aria-label", "Delete entry");
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    `;

    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const { error } = await supabase.from("entries").delete().eq("id", entry.id);

      if (error) {
        console.error(error);
        return;
      }

      if (currentEntryId === entry.id) clearEditor();
      loadEntries();
    });

    item.append(title, deleteBtn);

    item.addEventListener("click", () => loadEntryIntoEditor(entry));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadEntryIntoEditor(entry);
      }
    });

    entryList.appendChild(item);
  });
}

function loadEntryIntoEditor(entry) {
  currentEntryId = entry.id;
  entryTitle.value = entry.title;
  entryType.value = entry.type;
  contentInput.value = entry.content;
}

function clearEditor() {
  currentEntryId = null;
  entryTitle.value = "";
  entryType.value = "note";
  contentInput.value = "";
}

newEntryBtn.addEventListener("click", clearEditor);

saveBtn.addEventListener("click", async () => {
  const title = entryTitle.value.trim();
  const content = contentInput.value.trim();
  const type = entryType.value;

  if (!title || !content) {
    await toastMsg("You can't submit empty content", "error");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (currentEntryId) {
    const { error } = await supabase
      .from("entries")
      .update({ title, content, type, updated_at: new Date().toISOString() })
      .eq("id", currentEntryId);

    if (error) {
      console.error(error);
          await toastMsg(`Unable to update ${type}`, "error")
      return;
    }
    await toastMsg(`${type} updated!`, "success")
  } else {
    const { data, error } = await supabase
      .from("entries")
      .insert({ title, content, type, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error(error);
                await toastMsg(`Unable to save ${type}`, "error");
      return;
    }
    currentEntryId = data.id;
        await toastMsg(`${type} saved!`, "success");
  }

  loadEntries();
});

function sidebarToggle() {
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.getElementById("menuBtn");
  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expand-sidebar");
  });
}

// run once, not per-render
initSearch(loadEntryIntoEditor);
sidebarToggle();
loadEntries();