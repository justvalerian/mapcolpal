<script lang="ts">
    import {
        countryPointData,
        countryAreaData,
        cityAreaData,
        cityPointData,
    } from "../../stores/data";
    import { currentBasemap, basemaps } from "../../stores/basemap";
    import {
        pointPaletteType,
        areaPaletteType,
        backgroundColor,
        pointInputColors,
        areaInputColors,
        pointPaletteClasses,
        areaPaletteClasses,
        pointPaletteColors,
        areaPaletteColors,
        pointLightnessCorrection,
        pointBezierInterpolation,
        areaLightnessCorrection,
        areaBezierInterpolation,
        pointLightnessMid,
        pointLightnessRange,
        areaLightnessMid,
        areaLightnessRange,
        pointInvertLightness,
        areaInvertLightness,
    } from "../../stores/colors";
    import InputColors from "../elements/InputColors.svelte";
    import { layersStore } from "../../stores/settings";
    import HelpDropdown from "../elements/HelpDropdown.svelte";
    const {
        showPointLayer,
        showAreaLayer,
        showBasemapLayer,
        pointLayerOpacity,
        areaLayerOpacity,
        basemapLayerOpacity,
        countryScale,
    } = layersStore;
</script>

<!-- This panel houses the layer options -->
<div>
    <h2 class="text-lg font-semibold">Choose your layers</h2>
    <p class="pt-2">
        Adjust the zoom level of the map and the data type per layer to fit your use case. Then drag
        and drop seed colors to derive your palettes.
    </p>
    <h3 class="font-semibold pt-2">Show me...</h3>
    <div class="btn-group pl-2 pt-2">
        <input
            type="radio"
            name="map-scale"
            data-title="Country level data"
            bind:group={$countryScale}
            value={true}
            class="btn btn-sm btn-primary btn-outline"
        />
        <input
            type="radio"
            name="map-scale"
            data-title="City level data"
            bind:group={$countryScale}
            value={false}
            class="btn btn-sm btn-primary btn-outline"
        />
    </div>
    <h3 class="font-semibold pt-2 pb-2">Layers</h3>
    <div class="flex flex-col items-start">
        <InputColors
            pointInput={true}
            showLayer={showPointLayer}
            layerOpacity={pointLayerOpacity}
            inputColors={pointInputColors}
            paletteType={pointPaletteType}
            paletteClasses={pointPaletteClasses}
            paletteColors={pointPaletteColors}
            countryData={countryPointData}
            cityData={cityPointData}
            lightnessCorrection={pointLightnessCorrection}
            bezierInterpolation={pointBezierInterpolation}
            lightnessMid={pointLightnessMid}
            lightnessRange={pointLightnessRange}
            invertLightness={pointInvertLightness}
        />
        <InputColors
            pointInput={false}
            showLayer={showAreaLayer}
            layerOpacity={areaLayerOpacity}
            inputColors={areaInputColors}
            paletteType={areaPaletteType}
            paletteClasses={areaPaletteClasses}
            paletteColors={areaPaletteColors}
            countryData={countryAreaData}
            cityData={cityAreaData}
            lightnessCorrection={areaLightnessCorrection}
            bezierInterpolation={areaBezierInterpolation}
            lightnessMid={areaLightnessMid}
            lightnessRange={areaLightnessRange}
            invertLightness={areaInvertLightness}
        />
        <div
            class="flex flex-row items-center flex-wrap p-2 rounded-lg bg-base-200 mb-2 pr-8 relative border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
        >
            <label class="label cursor-pointer">
                <input
                    type="checkbox"
                    bind:checked={$showBasemapLayer}
                    class="toggle toggle-sm toggle-primary"
                />
                <h4 class="pl-2">Basemap</h4>
            </label>
            {#if $showBasemapLayer}
                <select
                    class="select select-primary select-xs max-w-xs ml-1"
                    bind:value={$currentBasemap}
                >
                    {#each $basemaps as basemap}
                        <option value={basemap.provider}>{basemap.label}</option>
                    {/each}
                </select>
                <div class="dropdown dropdown-end">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label tabindex="0" class="btn btn-xs btn-primary m-1">Opacity</label>
                    <div
                        tabindex="0"
                        class="relative top-8 dropdown-content menu p-2 bg-base-100 rounded-lg w-60 flex flex-row border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
                    >
                        <input
                            type="range"
                            bind:value={$basemapLayerOpacity}
                            min="0"
                            max="1"
                            step="0.01"
                            class="range range-sm range-primary"
                        />
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            bind:value={$basemapLayerOpacity}
                            class="input input-xs w-16"
                        />
                    </div>
                </div>
                <HelpDropdown title="Basemap" absolute={true} dropdownEnd={true} dropdownTop={true}
                    >Choose a basemap fitting to your deployment situation or deactivate this layer
                    and adjust the background color by clicking on it.<br />All basemaps used here
                    are freely available e.g. via
                    <a
                        class="link hover:text-secondary-focus"
                        target="_blank"
                        href="https://github.com/leaflet-extras/leaflet-providers"
                        >Leaflet-providers</a
                    >.</HelpDropdown
                >
            {/if}
        </div>
        <div
            class="flex flex-row items-center flex-wrap p-2 rounded-lg bg-base-200 mb-2 border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
        >
            <label class="label cursor-pointer">
                <input type="color" bind:value={$backgroundColor} class="w-8 h-5" />
                <h4 class="pl-2">Background</h4>
            </label>
        </div>
    </div>
</div>
