// Fungsi untuk mengganti tema
export type theme = "theme1" | "theme2" | "theme3";

export function setTheme(themeName: theme) {
    document.body.setAttribute("data-theme", themeName);

    localStorage.setItem("selectedTheme", themeName);
}

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("selectedTheme");
    const savedTheme: theme = saved === "theme1" || saved === "theme2" || saved === "theme3" ? saved : "theme1";
    setTheme(savedTheme);
});
