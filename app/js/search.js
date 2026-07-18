import { loadComponent } from "./components/loadComponent.js";
import { supabase } from "./supabase.js";

let onEntrySelected = null;

export function initSearch(onSelect) {
  onEntrySelected = onSelect;

  const searchBtn = document.getElementById("searchBtn");
  if (!searchBtn) return;

  const cancelSearchBarBtn = document.createElement("button");
  cancelSearchBarBtn.type = "button";
  cancelSearchBarBtn.classList.add("icon-btn", "cancel-search-btn");
  cancelSearchBarBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;

  function closeSearch() {
    const modalContainer = document.getElementById("modalContainer");
    modalContainer.innerHTML = "";
    cancelSearchBarBtn.replaceWith(searchBtn);
  }

  searchBtn.addEventListener("click", async () => {
    await loadComponent("../components/modals/search.html", "modalContainer");
    handleSearch(closeSearch);
    searchBtn.replaceWith(cancelSearchBarBtn);
  });

  cancelSearchBarBtn.addEventListener("click", closeSearch);
}

function handleSearch(closeSearch) {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");

  if (!searchInput || !resultsContainer) return;

  searchInput.focus();

  let debounceTimer;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (!query) {
      resultsContainer.innerHTML = "";
      return;
    }

    debounceTimer = setTimeout(
      () => runSearch(query, resultsContainer, closeSearch),
      300,
    );
  });
}

async function runSearch(query, resultsContainer, closeSearch) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .textSearch("fts", query, { type: "websearch" })
    .limit(20);

  if (error) {
    console.error(error);
    resultsContainer.innerHTML = `<p class="search-empty">Something went wrong.</p>`;
    return;
  }

  if (!data.length) {
    resultsContainer.innerHTML = `<p class="search-empty">No matches found.</p>`;
    return;
  }

  resultsContainer.innerHTML = "";
  data.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.innerHTML = `
      <span class="result-title">${entry.title}</span>
      <span class="result-type">${entry.type}</span>
    `;
    item.addEventListener("click", () => {
      onEntrySelected(entry);
      closeSearch();
    });
    resultsContainer.appendChild(item);
  });
}
