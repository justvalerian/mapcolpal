import { writable, readable } from "svelte/store";

export const currentBasemap = writable("CartoDB.PositronNoLabels");

export const basemaps = readable([
    {
        id: "darkmatter",
        label: "Dark Matter",
        provider: "CartoDB.DarkMatterNoLabels",
    },
    { id: "imagery", label: "Imagery", provider: "USGS.USImagery" },
    { id: "osm", label: "OpenStreetMap", provider: "OpenStreetMap.Mapnik" },
    { id: "positron", label: "Positron", provider: "CartoDB.PositronNoLabels" },
    { id: "terrain", label: "Terrain", provider: "Stamen.TerrainBackground" },
    { id: "toner", label: "Toner", provider: "Stamen.TonerBackground" },
    { id: "voyager", label: "Voyager", provider: "CartoDB.VoyagerNoLabels" },
]);
