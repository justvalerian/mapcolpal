<script lang="ts">
    import {
        showTutorial,
        selectedOption,
        seedColorRangeMin,
        seedColorRangeMax,
        seedColorImportSuccess,
        seedColorImportError,
    } from "../../stores/settings";
    import { seedColors, basemapColors } from "../../stores/colors";
    import { currentBasemap, basemaps } from "../../stores/basemap";
    import HelpDropdown from "../elements/HelpDropdown.svelte";

    export let loadSeedColors;
    export let numberOfSeedColors;
    export let textInput;
    let loading = false;
    let loadingSuccess = false;

    import { fade } from "svelte/transition";
    import chroma from "chroma-js";
    import mergeImages from "merge-images";

    //basemap color extraction
    const extractColors = async (dataUrl) => {
        //return extracted colors from a given image served as a data url
        return new Promise<{ r: number; g: number; b: number }[]>((resolve) => {
            let extractedColors;
            //create canvas to be filled with the merged image to extract the color values
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            img.src = dataUrl;
            img.onload = () => {
                //to test ouput, put this here:
                // (document.querySelector("#test") as HTMLImageElement).src = dataUrl;
                // and this in the HTML:
                // <img id="test" src="" alt=""/>
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const rawData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                let rgbData = [];
                for (let i = 0; i < rawData.data.length; i += 4) {
                    rgbData.push({
                        r: rawData.data[i],
                        g: rawData.data[i + 1],
                        b: rawData.data[i + 2],
                    });
                }

                const findLargestRange = (rgbData) => {
                    let rMax,
                        gMax,
                        bMax = 0;
                    let rMin,
                        gMin,
                        bMin = 255;
                    rgbData.forEach((d) => {
                        rMax = Math.max(rMax, d.r);
                        gMax = Math.max(gMax, d.g);
                        bMax = Math.max(bMax, d.b);
                        rMin = Math.min(rMin, d.r);
                        gMin = Math.min(gMin, d.g);
                        bMin = Math.min(bMin, d.b);
                    });
                    const rRange = rMax - rMin;
                    const gRange = gMax - gMin;
                    const bRange = bMax - bMin;
                    const returnRange = Math.max(rRange, gRange, bRange);
                    if (returnRange == rRange) {
                        return "r";
                    } else if (returnRange == gRange) {
                        return "g";
                    } else {
                        return "b";
                    }
                };

                const quantize = (rgbData, depth): { r: number; g: number; b: number }[] => {
                    const MAX_DEPTH = 4;
                    if (depth == MAX_DEPTH || rgbData.length == 0) {
                        const color = rgbData.reduce(
                            (
                                previous: { r: any; g: any; b: any },
                                current: { r: any; g: any; b: any }
                            ) => {
                                previous.r += current.r;
                                previous.g += current.g;
                                previous.b += current.b;
                                return previous;
                            },
                            {
                                r: 0,
                                g: 0,
                                b: 0,
                            }
                        );

                        color.r = Math.round(color.r / rgbData.length);
                        color.g = Math.round(color.g / rgbData.length);
                        color.b = Math.round(color.b / rgbData.length);
                        return [color];
                    }
                    const componentToSortBy = findLargestRange(rgbData);
                    rgbData.sort((p1: { [x: string]: number }, p2: { [x: string]: number }) => {
                        return p1[componentToSortBy] - p2[componentToSortBy];
                    });
                    const mid = rgbData.length / 2;
                    return [
                        ...quantize(rgbData.slice(0, mid), depth + 1),
                        ...quantize(rgbData.slice(mid + 1), depth + 1),
                    ];
                };

                let quantizedColors = quantize(rgbData, 1);

                //delete duplicates
                extractedColors = quantizedColors.filter(
                    (v, i, a) =>
                        a.findIndex((v2) => ["r", "g", "b"].every((k) => v2[k] === v[k])) === i
                );

                resolve(extractedColors);
            };
        });
    };

    const extractTileColors = async () => {
        // function to merge all basemap tiles into a big image and then extract the most frequent colors from this image

        // add src links of tiles to array
        let tiles = document.getElementsByClassName(
            "leaflet-tile-loaded"
        ) as HTMLCollectionOf<HTMLImageElement>;
        let tilesSrc = [];
        let tilePosition = 0;
        //if actual tiles wanted: enter 256 or 512 depending on tiles used
        //smaller number to sample just a part of the tiles and keep the performance fast
        let tileSample = 75;
        for (const tile of tiles) {
            tilesSrc.push({ src: tile.src, x: 0, y: tilePosition });
            tilePosition += tileSample;
        }
        //merge the tile sources into one big image
        let tileImageDataUrl = await mergeImages(tilesSrc, {
            width: tileSample,
            height: tilePosition,
            crossOrigin: "Anonymous",
        });

        let extractedColors = await extractColors(tileImageDataUrl);

        let formattedColors = extractedColors.map((obj) => chroma(Object.values(obj)).hex());

        return formattedColors;
    };

    export const generateFromBasemap = async () => {
        loading = true;
        $basemapColors = await extractTileColors();
        let basemapAverage = chroma.average($basemapColors, "oklch");
        let basemapHue = basemapAverage.get("oklch.h");

        if (!isNaN(basemapHue)) {
            seedColors.generate(numberOfSeedColors, basemapAverage);
        } else {
            seedColors.generate(numberOfSeedColors);
        }
        loading = false;
        loadingSuccess = true;
        setTimeout(() => {
            loadingSuccess = false;
        }, 1500);
    };
</script>

<!-- This panel is displayed on website start -->

<div class="flex flex-col items-start">
    <h2 class="text-lg font-semibold">Welcome!</h2>

    <p class="pt-2">
        This tool is here to help you work with color palettes for thematic maps.<br />
        First time here? Check out the
        <button class="link hover:text-secondary-focus" on:click={() => showTutorial.set(true)}
            >tutorial</button
        >.
    </p>

    <h3 class="font-semibold pt-2">I want to...</h3>
    <div class="form-control items-start w-full">
        <label class="label cursor-pointer">
            <input
                type="radio"
                name="seed"
                value={false}
                bind:group={loadSeedColors}
                class="radio checked:bg-secondary"
            />
            <span class="label-text text-base pl-2"
                >generate <input
                    type="number"
                    bind:value={numberOfSeedColors}
                    min="1"
                    max="20"
                    class="input input-xs w-14 label-text text-base"
                /> seed colors</span
            >
        </label>
        <div class="form-control items-start pl-10" class:hidden={loadSeedColors}>
            <label class="cursor-pointer label">
                <input
                    type="radio"
                    class="radio radio-accent"
                    value="template"
                    bind:group={$selectedOption}
                />
                <span class="label-text pl-2">with harmoniously spread hues</span>
            </label>
            <label class="cursor-pointer label">
                <input
                    type="radio"
                    class="radio radio-accent"
                    value="filter"
                    bind:group={$selectedOption}
                />
                <span class="label-text pl-2"
                    >with hues ranging from <input
                        type="number"
                        bind:value={$seedColorRangeMin}
                        min="0"
                        max="360"
                        step="1"
                        class="input input-xs w-[4.5rem] label-text text-base"
                    />
                    to
                    <input
                        type="number"
                        bind:value={$seedColorRangeMax}
                        min="0"
                        max="360"
                        step="1"
                        class="input input-xs w-[4.5rem] label-text text-base"
                    /> degrees</span
                >
            </label>
            <label class="cursor-pointer label">
                <input
                    type="radio"
                    class="radio radio-accent"
                    value="basemap"
                    bind:group={$selectedOption}
                />
                <span class="label-text pl-2"
                    >fitted to this basemap:<select
                        class="select select-accent select-xs max-w-xs ml-1"
                        bind:value={$currentBasemap}
                    >
                        {#each $basemaps as basemap}
                            <option value={basemap.provider}>{basemap.label}</option>
                        {/each}
                    </select>
                </span>
            </label>
            <label class="cursor-pointer label">
                <input
                    type="radio"
                    class="radio radio-accent"
                    value="random"
                    bind:group={$selectedOption}
                />
                <span class="label-text pl-2">randomly</span>
            </label>
        </div>
        <label class="label cursor-pointer">
            <input
                type="radio"
                name="seed"
                value={true}
                bind:group={loadSeedColors}
                class="radio checked:bg-secondary"
            />
            <span class="label-text text-base pl-2">load seed colors</span>
        </label>
        <textarea
            bind:value={textInput}
            class:hidden={!loadSeedColors}
            class="textarea textarea-accent w-full"
            placeholder="Paste an array with seed colors here. &#13;Example: #7fc97f, #beaed4, #fdc086"
        />
    </div>
    {#if loadSeedColors}
        <button
            class="btn btn-secondary self-end mt-2"
            on:click={() => seedColors.loadFromText(textInput)}>Load</button
        >
        {#if $seedColorImportError}
            <div
                transition:fade={{ duration: 300 }}
                class="z-10 absolute bottom-20 w-fit alert alert-error p-4 self-center border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
            >
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        /></svg
                    >
                    <span>Error! Try importing actual hex color codes!</span>
                </div>
            </div>
        {/if}
        {#if $seedColorImportSuccess}
            <div
                transition:fade={{ duration: 300 }}
                class="z-10 absolute bottom-20 w-fit alert alert-success p-4 self-center border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
            >
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        /></svg
                    >
                    <span>Successfully loaded {$seedColors.length} seed colors!</span>
                </div>
            </div>
        {/if}
    {:else}
        <button
            class="btn btn-secondary self-end mt-2"
            class:loading
            on:click={() => {
                switch ($selectedOption) {
                    case "template":
                        seedColors.generate(numberOfSeedColors);
                        break;
                    case "filter":
                        seedColors.generate(numberOfSeedColors);
                        seedColors.rescaleHue($seedColorRangeMin, $seedColorRangeMax);
                        break;
                    case "basemap":
                        generateFromBasemap();
                        break;
                    case "random":
                        seedColors.generateRandom(numberOfSeedColors);
                        break;

                    default:
                        break;
                }
            }}>Generate</button
        >
        {#if loadingSuccess}
            <div
                transition:fade={{ duration: 300 }}
                class="z-10 absolute bottom-20 w-fit alert alert-success p-4 self-center border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
            >
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        /></svg
                    >
                    <span>Successfully generated {$seedColors.length} seed colors!</span>
                </div>
            </div>
        {/if}
    {/if}
    <div
        class="w-full bg-base-200 p-4 my-2 relative rounded-lg border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
    >
        <div class="flex flex-row items-baseline justify-between">
            <h3 class="font-semibold">Current seed colors</h3>
            <HelpDropdown dropdownTop={true} dropdownEnd={true} absolute={true} title="Seed colors"
                >Seed colors are the basis for the palette derivation on the next page. <br />
                <br />Whenever the seed colors are displayed you can click on them to adjust them
                further.</HelpDropdown
            >
        </div>
        <div class="flex flex-row flex-wrap pt-2">
            {#each $seedColors as obj}
                <div class="relative">
                    <label
                        class="w-full text-center text-2xs absolute bottom-0 hover:cursor-pointer"
                        for={obj.color}>{obj.color}</label
                    >
                    <input
                        class="w-12 h-12 mb-4 mx-1 hover:cursor-pointer"
                        bind:value={obj.color}
                        id={obj.color}
                        type="color"
                    />
                </div>
            {/each}
        </div>
    </div>
</div>
