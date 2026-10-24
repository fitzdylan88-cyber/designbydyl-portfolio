/** Shared by the reading-mode toggle (client) and the root layout (server). */
export const READING_STORAGE_KEY = "reading-mode";

/** Applies the saved mode before first paint, so a quick reader never sees the full story flash. */
export const readingModeScript = `try{if(localStorage.getItem("${READING_STORAGE_KEY}")==="quick")document.documentElement.dataset.reading="quick"}catch(e){}`;
