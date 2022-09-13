<script lang="ts">
    import { onMount } from "svelte";
    import chroma from "chroma-js";
    import HelpDropdown from "../elements/HelpDropdown.svelte";
    import ExportedColors from "../elements/ExportedColors.svelte";
    import {
        seedColors,
        pointInputColors,
        areaInputColors,
        pointPaletteColors,
        areaPaletteColors,
    } from "../../stores/colors";
    import {
        format,
        notation,
        exportedSeedColors,
        exportedPointInputColors,
        exportedAreaInputColors,
        exportedPointPaletteColors,
        exportedAreaPaletteColors,
    } from "../../stores/settings";

    let seedColorsArray = ["#000000"];
    let pointInputColorsArray = ["#000000"];
    let areaInputColorsArray = ["#000000"];

    onMount(() => {
        // load which radio buttons are checked on mount of component
        let setEle = document.getElementsByTagName("input");
        for (let i = 0; i < setEle.length; i++) {
            if (setEle[i].value == $format || setEle[i].value == $notation) {
                setEle[i].checked = true;
            }
        }
    });

    const colorObjToArray = (
        colorObjects: {
            color: string;
            id: number;
            pointInputIndex: number;
            areaInputIndex: number;
        }[]
    ): string[] => {
        return colorObjects.map((obj) => obj.color);
    };

    const formatColorArray = (colors: string[]): string => {
        let input = colors;
        let output = "";

        //switch color notation
        switch ($notation) {
            case "rgb":
                input = input.map((current) => {
                    return chroma(current).css();
                });
                break;
            case "lab":
                input = input.map((current) => {
                    return chroma(current).lab();
                });
                break;
            case "lch":
                input = input.map((current) => {
                    return chroma(current).lch();
                });
                break;
            default:
                /*  input = input.map((current) => {
                    return chroma(current).hex();
                }); */
                break;
        }

        //add quote marks
        if ($format == "single") {
            input = input.map((current) => {
                return "'" + current + "'";
            });
        } else if ($format == "double") {
            input = input.map((current) => {
                return '"' + current + '"';
            });
        }

        //add commas and brackets for JS array
        output = "[" + input.join(", ") + "]";

        return output;
    };

    const exportColors = () => {
        // save currently selected radio buttons in state
        let ele = document.getElementsByTagName("input");
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].type == "radio") {
                if (ele[i].checked) {
                    switch (ele[i].name) {
                        case "format":
                            $format = ele[i].value;
                            break;
                        case "notation":
                            $notation = ele[i].value;
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        seedColorsArray = colorObjToArray($seedColors);
        pointInputColorsArray = colorObjToArray($pointInputColors);
        areaInputColorsArray = colorObjToArray($areaInputColors);

        $exportedSeedColors = formatColorArray(seedColorsArray);
        $exportedPointInputColors = formatColorArray(pointInputColorsArray);
        $exportedAreaInputColors = formatColorArray(areaInputColorsArray);
        $exportedPointPaletteColors = formatColorArray($pointPaletteColors);
        $exportedAreaPaletteColors = formatColorArray($areaPaletteColors);
    };

    exportColors();
</script>

<!-- This panel contains the export options -->
<div class="">
    <h2 class="text-lg font-semibold">Export</h2>

    <p class=" pb-4 pt-2">
        Copy palettes as JavaScript arrays.</p>

    <div class="flex flex-row flex-wrap items-baseline justify-between">
        <div class="flex flex-row">
            <h3 class="font-semibold pt-2">Exported colors</h3>
            <HelpDropdown title="Exported colors"
                >Palettes are exported with all applied modificators, so e.g. disable lightness
                correction or CVD simulation if unwanted.</HelpDropdown
            >
        </div>

        <div class="dropdown dropdown-end">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="btn btn-sm btn-primary btn-outline">Formatting options</label
            >
            <div
                tabindex="0"
                class="dropdown-content menu p-4 mt-2 bg-base-100 rounded-lg w-fit min-w-[18rem] border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
            >
                <div>
                    <h3 class="font-semibold">String format</h3>
                    <div class="btn-group pl-2 pb-4 pt-2">
                        <input
                            type="radio"
                            name="format"
                            data-title="&apos;"
                            value="single"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                        <input
                            type="radio"
                            name="format"
                            data-title="&quot;"
                            value="double"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                        <input
                            type="radio"
                            name="format"
                            data-title="no quote marks"
                            value="noquote"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                    </div>
                </div>
                <div>
                    <h3 class="font-semibold">Color notation</h3>

                    <div class="btn-group pl-2 pt-2">
                        <input
                            type="radio"
                            name="notation"
                            data-title="Hex"
                            value="hex"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                        <input
                            type="radio"
                            name="notation"
                            data-title="RGB"
                            value="rgb"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                        <input
                            type="radio"
                            name="notation"
                            data-title="Lab"
                            value="lab"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                        <input
                            type="radio"
                            name="notation"
                            data-title="LCH"
                            value="lch"
                            class="btn btn-primary btn-outline btn-sm"
                            on:click={exportColors}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ExportedColors
        title="Point palette"
        colors={$pointPaletteColors}
        colorsText={$exportedPointPaletteColors}
    />
    <ExportedColors
        title="Area palette"
        colors={$areaPaletteColors}
        colorsText={$exportedAreaPaletteColors}
    />

    <div
        tabindex="0"
        class="collapse collapse-arrow border-base-200 bg-base-100 rounded-lg border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
    >
        <input type="checkbox" />
        <h3 class="collapse-title font-semibold pt-4 bg-base-200">Other colors</h3>
        <div class="collapse-content">
            <ExportedColors
                title="Seed colors"
                colors={seedColorsArray}
                colorsText={$exportedSeedColors}
            />
            <ExportedColors
                title="Point input colors"
                colors={pointInputColorsArray}
                colorsText={$exportedPointInputColors}
            />
            <ExportedColors
                title="Area input colors"
                colors={areaInputColorsArray}
                colorsText={$exportedAreaInputColors}
            />
        </div>
    </div>
</div>
