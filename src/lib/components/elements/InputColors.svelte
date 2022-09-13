<script lang="ts">
    import type { Readable } from "svelte/store";
    import { seedColors, paletteTypes } from "../../stores/colors";
    import { layersStore } from "../../stores/settings";
    import HelpDropdown from "./HelpDropdown.svelte";
    const { countryScale, pointsSizeFixed, pointsSizeValue } = layersStore;

    export let pointInput: boolean;
    export let showLayer;
    export let layerOpacity;
    export let inputColors: Readable<
        { color: string; id: number; pointInputIndex: number; areaInputIndex: number }[]
    >;
    export let paletteType;
    export let paletteClasses;
    export let paletteColors;
    export let countryData;
    export let cityData;
    export let lightnessCorrection;
    export let bezierInterpolation;
    export let lightnessMid;
    export let lightnessRange;
    export let invertLightness;

    let cardReference: HTMLElement[] = [];
    let inputContainer: HTMLElement;
    let draggedDOM: HTMLElement;

    const dragstart = (event, objId: number) => {
        event.dataTransfer.setData("id", objId);

        draggedDOM = event.target;
    };

    const dragover = (event) => {
        event.dataTransfer.dropEffect = "move";
    };

    const dropIn = (event) => {
        let draggedId = event.dataTransfer.getData("id");
        //update store
        seedColors.addToInputEnd(pointInput, draggedId);
        //update DOM as well
        event.target.parentNode.appendChild(draggedDOM);
    };

    const dropInOutElement = (event, targetDOM, targetId) => {
        let draggedId = event.dataTransfer.getData("id");
        if (targetDOM.parentNode == inputContainer) {
            //target element in input container
            seedColors.addToInputPosition(pointInput, draggedId, targetId);
        } else {
            //target element not in input container
            //      check for length 3 and not 2 because of drop area element
            if (inputContainer.children.length < 3) {
                return;
            }
            seedColors.removeFromInput(pointInput, draggedId);
        }

        //update DOM as well
        let draggedDOMIndex = [...targetDOM.parentNode.children].indexOf(draggedDOM);
        let targetDOMIndex = [...targetDOM.parentNode.children].indexOf(targetDOM);

        draggedDOMIndex < targetDOMIndex && draggedDOMIndex != -1
            ? targetDOM.insertAdjacentElement("afterend", draggedDOM)
            : targetDOM.insertAdjacentElement("beforebegin", draggedDOM);
    };

    const dropOut = (event) => {
        //      check for length 3 and not 2 because of drop area element
        if (inputContainer.children.length < 3) {
            return;
        }

        let draggedId = event.dataTransfer.getData("id");
        //update store
        seedColors.removeFromInput(pointInput, draggedId);
        //update DOM as well
        event.target.parentNode.appendChild(draggedDOM);
    };

    const updateDraggedInputs = () => {
        for (const obj of $inputColors) {
            inputContainer.appendChild(
                document.getElementById(pointInput ? "pointInput" + obj.id : "areaInput" + obj.id)
            );
        }
    };

    const reverseInputOrder = () => {
        for (let i = $inputColors.length - 2; i > -1; i--) {
            seedColors.addToInputEnd(pointInput, $inputColors[i].id);
        }
        updateDraggedInputs();
    };

    //when inputcontainer loaded, update dragged inputs
    $: inputContainer != undefined && $showLayer && updateDraggedInputs();
</script>

<!-- This component handles the input colors and the drag and drop functionality -->
<div
    class="p-2 rounded-lg bg-base-200 mb-2 border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300 relative"
>
    <div class="flex flex-row items-center flex-wrap pr-4">
        <label class="label cursor-pointer rounded-lg">
            <input
                type="checkbox"
                bind:checked={$showLayer}
                class="toggle toggle-sm toggle-primary"
            />
            <h4 class="pl-2">{pointInput ? "Points" : "Areas"}</h4>
        </label>
        {#if $showLayer}
            <select class="select select-primary select-xs max-w-xs ml-1" bind:value={$paletteType}>
                {#each $paletteTypes as palType}
                    <option value={palType}>{palType}</option>
                {/each}
            </select>
            <div class="dropdown">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label tabindex="0" class="btn btn-xs btn-primary m-1">Opacity</label>
                <div
                    tabindex="0"
                    class="dropdown-content menu p-2 bg-base-100 rounded-lg w-60 flex flex-row border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
                >
                    <input
                        type="range"
                        bind:value={$layerOpacity}
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
                        bind:value={$layerOpacity}
                        class="input input-xs w-16"
                    />
                </div>
            </div>

            <button
                class="btn btn-xs btn-accent"
                on:click={() => {
                    $countryScale ? countryData.randomData() : cityData.randomData();
                }}
                >New Data
            </button>

            {#if pointInput}
                <div class="dropdown dropdown-end">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label tabindex="0" class="btn btn-xs btn-accent m-1">Size</label>
                    <div
                        tabindex="0"
                        class="dropdown-content menu p-2 bg-base-100 rounded-lg w-fit min-w-[16rem] border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
                    >
                        <h5 class="font-semibold">Point size</h5>
                        <div class="pl-2 pt-2">
                            <div class="flex flex-row items-center">
                                <input
                                    type="range"
                                    bind:value={$pointsSizeValue}
                                    min="1"
                                    max="100"
                                    step="1"
                                    class="range range-sm range-primary"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    step="1"
                                    bind:value={$pointsSizeValue}
                                    class="input input-xs w-16"
                                />
                            </div>
                            <label class="cursor-pointer label w-fit py-2">
                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-accent"
                                    bind:checked={$pointsSizeFixed}
                                />
                                <span class="label-text pl-2">Same-sized points</span>
                            </label>
                        </div>
                    </div>
                </div>
            {/if}
            <HelpDropdown title="Layer controls" absolute={true} dropdownEnd={true}
                >The layer controls house a lot of powerful tools to derive palettes from seed colors and visualize them for easy testing.<br>Drag and drop seed color cards into the green drop zone to use them for palette derivation and rearrange freely.<br>On this screen, you can also still readjust the seed colors (by clicking on them) and see the changes live in the map.</HelpDropdown
            >
        {/if}
    </div>
    {#if $showLayer}
        <div class="flex flex-row flex-wrap">
            <label class="cursor-pointer label p-2">
                <input
                    type="checkbox"
                    class="checkbox checkbox-accent"
                    bind:checked={$lightnessCorrection}
                />
                <span class="label-text pl-2"
                    >Optimize lightness and map to {#if $paletteType != "qualitative"}
                        <label
                            class="label cursor-pointer inline btn btn-xs btn-accent p-1.5 bg-opacity-50 border-opacity-0"
                            ><input
                                type="checkbox"
                                class="hidden"
                                bind:checked={$invertLightness}
                            />{#if $invertLightness}
                                -/+{:else}+/-
                            {/if}</label
                        >
                        <input
                            type="number"
                            bind:value={$lightnessRange}
                            min="0"
                            max="1"
                            step="0.05"
                            class="input input-xs w-[4.5rem] label-text text-base"
                        />
                        around
                    {/if}<input
                        type="number"
                        bind:value={$lightnessMid}
                        min="0"
                        max="1"
                        step="0.05"
                        class="input input-xs w-[4.5rem] label-text text-base"
                    />
                </span>
            </label>
            {#if $paletteType != "qualitative"}
                <label class="cursor-pointer label px-2 py-0 pb-2">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-accent"
                        bind:checked={$bezierInterpolation}
                    />
                    <span class="label-text pl-2">Smooth with Bézier curve interpolation</span>
                </label>
            {/if}
        </div>
        <div class="">
            <div
                class="min-h-12 flex flex-row flex-wrap bg-base-300 border-4 border-opacity-75 border-b-white border-r-white border-l-gray-300 border-t-gray-300 relative p-2 mb-2 rounded-lg"
            >
                <div
                    class="z-10 absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                    on:drop|preventDefault={(event) => dropOut(event)}
                    on:dragover|preventDefault={(event) => dragover(event)}
                />
                {#each $seedColors as obj, i}
                    <div
                        draggable={true}
                        class="p-2 m-1 pb-4 bg-base-100 z-20 rounded-lg border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300 active:border-opacity-100"
                        id={pointInput ? "pointInput" + obj.id : "areaInput" + obj.id}
                        bind:this={cardReference[i]}
                        on:dragstart={(event) => dragstart(event, obj.id)}
                        on:drop|preventDefault={(event) =>
                            dropInOutElement(event, cardReference[i], obj.id)}
                        on:dragover|preventDefault={(event) => dragover(event)}
                    >
                        <input class="w-12 h-12" bind:value={obj.color} type="color" />
                        <p class="w-full text-center text-2xs">{obj.color}</p>
                    </div>
                {/each}
            </div>
            <div
                class="min-h-16 flex flex-row flex-wrap relative p-2 border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300 bg-success bg-opacity-25 rounded-lg"
                bind:this={inputContainer}
            >
                <div
                    class="z-10 absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                    on:drop|preventDefault={(event) => dropIn(event)}
                    on:dragover|preventDefault={(event) => dragover(event)}
                />
            </div>
        </div>
        <div class="w-full p-2 mt-2 rounded-lg">
            <p class="pl-2 pb-2 label-text">
                Palette with
                <input
                    type="number"
                    min="2"
                    max="100"
                    bind:value={$paletteClasses}
                    class="input input-xs w-16"
                />
                classes
                <button class="btn btn-xs btn-accent" on:click={() => reverseInputOrder()}
                    >reverse order</button
                >
            </p>
            <div
                class="h-12 flex flex-row w-full border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
            >
                {#each $paletteColors as color}
                    <div class="flex-grow" style="background-color: {color};" />
                {/each}
            </div>
        </div>
    {/if}
</div>
