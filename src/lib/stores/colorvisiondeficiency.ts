import { writable, readable } from "svelte/store";

export const currentCvd = writable("none");

export const cvds = readable([
    { id: "none", label: "None - Pick a CVD to simulate" },
    { id: "deuteranomaly", label: "Deuteranomaly" },
    { id: "deuteranopia", label: "Deuteranopia" },
    { id: "protanomaly", label: "Protanomaly" },
    { id: "protanopia", label: "Protanopia" },
    { id: "tritanomaly", label: "Tritanomaly" },
    { id: "tritanopia", label: "Tritanopia" },
    { id: "achromatomaly", label: "Achromatomaly" },
    { id: "achromatopsia", label: "Achromatopsia" },
]);

export const pointScaleAbsolute = writable(true);
export const areaScaleAbsolute = writable(true);
