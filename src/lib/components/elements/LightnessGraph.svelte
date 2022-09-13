<script lang="ts">
    import * as d3 from "d3";
    import chroma from "chroma-js";
    import { onMount } from "svelte";
    import HelpDropdown from "./HelpDropdown.svelte";

    export let scaleAbsolute;
    export let paletteColors;
    export let paletteClasses;
    let initialized = false;

    const getData = (paletteColors: string[]): { color: string; lightness: number }[] => {
        return paletteColors.map((col) => {
            return { color: col, lightness: chroma(col).get("oklch.l") };
        });
    };

    $: data = getData(paletteColors);

    let width;
    let height;
    const margin = { top: 35, bottom: 15, left: 50, right: 10 };

    $: innerWidth = width - margin.left - margin.right;
    $: innerHeight = height - margin.top - margin.bottom;

    $: xScale = d3.scaleLinear().domain([0, paletteClasses]).range([0, innerWidth]);
    $: yScaleRelative = d3
        .scaleLinear()
        .domain(d3.extent(data.map((obj) => obj.lightness)))
        .range([innerHeight, 0]);
    $: yScaleAbsolute = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    onMount(() => {
        initialized = true;
    });
</script>

<!-- This panel houses the palette testing options -->
<div>
    <div class="flex flex-row flex-wrap items-center justify-between relative">
        <h5 class="pl-2">
            Lightness graph <HelpDropdown title="Lightness graph"
                >Charting lightness steps within a color palette (in a perceptually uniform color space) can be a great help in testing a color palette.<br>See the tutorial for more advice.</HelpDropdown
            >
        </h5>
        <label class="label cursor-pointer justify-start items-center">
            <input
                type="checkbox"
                bind:checked={$scaleAbsolute}
                class="toggle toggle-sm toggle-accent"
            />
            <span class="pl-2 text-sm">Absolute scale</span>
        </label>
    </div>
    <div class="bg-base-100 rounded-lg border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300" bind:clientWidth={width} bind:clientHeight={height}>
        <svg class="w-full min-h-[10rem]" {height}>
            {#if initialized}
                <g transform={`translate(0,${margin.top})`}>
                    {#each $scaleAbsolute ? yScaleAbsolute.ticks(3) : yScaleRelative.ticks(4) as y}
                        <text
                            class="fill-base-content"
                            text-anchor="middle"
                            x={25}
                            y={$scaleAbsolute ? yScaleAbsolute(y) - 5 : yScaleRelative(y) - 5}
                            >{(y * 100).toFixed(0) + "%"}</text
                        >
                    {/each}
                </g>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {#each data as obj, i}
                        <rect
                            fill={obj.color}
                            y={$scaleAbsolute
                                ? yScaleAbsolute(obj.lightness)
                                : yScaleRelative(obj.lightness)}
                            x={xScale(i)}
                            width={innerWidth / data.length}
                            height={10}
                        />
                        {#if data.length < 10 || (i % 2 == 1 && data.length < 20) || i % 4 == 1}
                            <text
                                class="fill-base-content"
                                text-anchor="middle"
                                x={xScale(i) + innerWidth / data.length / 2}
                                y={$scaleAbsolute
                                    ? yScaleAbsolute(obj.lightness) - 5
                                    : yScaleRelative(obj.lightness) - 5}
                                >{(obj.lightness * 100).toFixed(0) + "%"}</text
                            >
                        {/if}
                    {/each}
                </g>
            {/if}
        </svg>
    </div>
</div>
