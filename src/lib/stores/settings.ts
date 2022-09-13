import { writable } from "svelte/store";

//tutorial
export const showTutorial = writable(false);

//start panel
export const selectedOption = writable("template");
export const seedColorRangeMin = writable(120);
export const seedColorRangeMax = writable(300);
export const seedColorImportSuccess = writable(false);
export const seedColorImportError = writable(false);

// layers panel
class LayersStore {
    constructor(
        public showPointLayer = writable(true),
        public showAreaLayer = writable(true),
        public showBasemapLayer = writable(true),
        public pointLayerOpacity = writable(1),
        public areaLayerOpacity = writable(1),
        public basemapLayerOpacity = writable(1),
        public countryScale = writable(true),
        public pointsSizeFixed = writable(false),
        public pointsSizeValue = writable(25)
    ) {}
}
export const layersStore = new LayersStore();

// export panel
export const format = writable("single");
export const notation = writable("hex");
export const exportedSeedColors = writable("");
export const exportedPointInputColors = writable("");
export const exportedAreaInputColors = writable("");
export const exportedPointPaletteColors = writable("");
export const exportedAreaPaletteColors = writable("");
