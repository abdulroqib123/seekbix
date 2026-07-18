export async function loadComponent(path, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="search-empty">Something went wrong loading this.</p>`;
  }
}

