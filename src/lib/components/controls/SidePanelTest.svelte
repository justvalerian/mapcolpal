<script lang="ts">
    import {
        pointPaletteColors,
        areaPaletteColors,
        pointPaletteClasses,
        areaPaletteClasses,
    } from "../../stores/colors";
    import { layersStore } from "../../stores/settings";
    const { showPointLayer, showAreaLayer } = layersStore;
    import {
        currentCvd,
        cvds,
        pointScaleAbsolute,
        areaScaleAbsolute,
    } from "../../stores/colorvisiondeficiency";
    import LightnessGraph from "../elements/LightnessGraph.svelte";
    import HelpDropdown from "../elements/HelpDropdown.svelte";
</script>

<!-- This panel houses the palette testing options -->
<div>
    <h2 class="text-lg font-semibold">Test your palettes</h2>
    <h3>
        Apply a color vision deficiency simulation <HelpDropdown
            title="CVD simulation"
            dropdownEnd={true}>Color vision deficiencies (CVDs) can lead to distorted and obstructed understanding of data if they are not considered in choosing a color palette.<br>The most common one is deuteranomaly which reduces discrimination of reddish and greenish contents of colors.</HelpDropdown
        > and check the lightness graphs.
    </h3>
    <select bind:value={$currentCvd} class="m-2 select select-sm select-primary w-full max-w-xs">
        {#each $cvds as cvd}
            <option value={cvd.id}>{cvd.label}</option>
        {/each}
    </select>

    <div
        class="bg-base-200 rounded-lg p-2 mt-2 mb-2 border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
    >
        <label class="label cursor-pointer rounded-lg">
            <h4 class="font-semibold">Point palette</h4>
            <input
                type="checkbox"
                bind:checked={$showPointLayer}
                class="toggle toggle-sm toggle-primary"
            />
        </label>
        {#if $showPointLayer}
            <div
                class="h-12 ml-[50px] mr-[10px] mt-2 mb-1 flex flex-row border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
            >
                {#each $pointPaletteColors as color}
                    <div class="flex-grow" style="background-color: {color};" />
                {/each}
            </div>
            <LightnessGraph
                scaleAbsolute={pointScaleAbsolute}
                paletteColors={$pointPaletteColors}
                paletteClasses={$pointPaletteClasses}
            />
        {/if}
    </div>

    <div
        class="bg-base-200 rounded-lg p-2 mb-2 border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
    >
        <label class="label cursor-pointer rounded-lg">
            <h4 class="font-semibold">Area palette</h4>
            <input
                type="checkbox"
                bind:checked={$showAreaLayer}
                class="toggle toggle-sm toggle-primary"
            />
        </label>
        {#if $showAreaLayer}
            <div
                class="h-12 ml-[50px] mr-[10px] mt-2 mb-1 flex flex-row border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
            >
                {#each $areaPaletteColors as color}
                    <div class="flex-grow" style="background-color: {color};" />
                {/each}
            </div>
            <LightnessGraph
                scaleAbsolute={areaScaleAbsolute}
                paletteColors={$areaPaletteColors}
                paletteClasses={$areaPaletteClasses}
            />
        {/if}
    </div>
</div>
