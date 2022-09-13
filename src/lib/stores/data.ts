import { writable, readable } from "svelte/store";
import * as d3 from "d3";

const createDataStore = () => {
    const D = writable([]);
    const { set, subscribe, update } = D;

    const loadJson = async (source: string) => {
        let json = await d3.json(source);
        let dataArray = [...json.features];
        D.set(dataArray);
    };

    const randomData = () => {
        D.update((data) => {
            for (let i in data) {
                data[i].properties.data = Math.random();
            }
            return data;
        });
    };

    return {
        subscribe,
        loadJson,
        randomData,
    };
};

export const countryPointData = createDataStore(),
    countryAreaData = createDataStore(),
    cityPointData = createDataStore(),
    cityAreaData = createDataStore();

export const cameraPositions = readable([
    {
        id: "city",
        center: [48.2, 16.37],
        zoom: 11,
    },
    { id: "country", center: [55, 10], zoom: 4 },
]);
