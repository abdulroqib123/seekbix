import { supabase } from "./supabase.js";

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
  data.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "entry-list-item";
    item.dataset.id = entry.id;
    item.textContent = entry.title;
    item.addEventListener("click", () => loadEntryIntoEditor(entry));
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
    // show a toast — you already have toast.css linked
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (currentEntryId) {
    // update existing
    const { error } = await supabase
      .from("entries")
      .update({ title, content, type, updated_at: new Date().toISOString() })
      .eq("id", currentEntryId);

    if (error) {
      console.error(error);
      return;
    }
  } else {
    // insert new
    const { data, error } = await supabase
      .from("entries")
      .insert({ title, content, type, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    currentEntryId = data.id; // now editing the entry we just created
  }

  loadEntries();
});

loadEntries();
