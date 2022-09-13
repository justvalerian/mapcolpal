<script lang="ts">
    import { onMount } from "svelte";
    import SidePanelStart from "./SidePanelStart.svelte";
    import SidePanelLayers from "./SidePanelLayers.svelte";
    import SidePanelTest from "./SidePanelTest.svelte";
    import SidePanelExport from "./SidePanelExport.svelte";
    import Tutorial from "../elements/ModalTutorial.svelte";
    import About from "../elements/ModalAbout.svelte";
    import { seedColors } from "../../stores/colors";

    //initialize variables for color loading from URL
    let loadSeedColors = false;
    let numberOfSeedColors = 6;
    let textInput = "";

    //variables and methods for panel handling
    let panels = [
        { id: 0, name: "start", component: SidePanelStart },
        { id: 1, name: "generate", component: SidePanelLayers },
        { id: 2, name: "test", component: SidePanelTest },
        { id: 3, name: "export", component: SidePanelExport },
    ];

    let activePanel = panels[0];

    const panelForward = () => {
        if (activePanel.id < panels.length - 1) {
            activePanel = panels[activePanel.id + 1];
        }
    };
    const panelBack = () => {
        if (activePanel.id > 0) {
            activePanel = panels[activePanel.id - 1];
        }
    };
    const handle_keydown = (e) => {
        if (e.key === "ArrowLeft") {
            panelBack();
            return;
        } else if (e.key === "ArrowRight") {
            panelForward();
            return;
        }
    };

    //variables and functions for URL color loading and inserting
    //regular expression to find hexadecimal color codes
    let regExUrl = /([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

    const loadFromUrl = () => {
        const params = new URLSearchParams(document.location.search);
        let seed = params.get("seed");
        if (seed !== null) {
            let split = seed.split("-");
            for (const i in split) {
                split[i] = "#" + split[i];
            }
            return split.join(", ");
        } else {
            return "";
        }
    };

    const updateUrl = (colors) => {
        const url = new URL(window.location.href);
        let colorsArray = colors.map((obj) => obj.color.slice(1));
        url.searchParams.set("seed", colorsArray.join("-"));
        window.history.pushState(null, "", url.toString());
    };

    //run initial methods on app startup
    //check URL for parameters
    if (regExUrl.test(window.location.search)) {
        loadSeedColors = true;
        textInput = loadFromUrl();
    }

    onMount(() => {
        seedColors.initialize(loadSeedColors, numberOfSeedColors, textInput);
    });

    //update URL with debounce to not produce too many API calls on color interaction
    let timer;
    const debounceUrl = (colors) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            updateUrl(colors);
        }, 250);
    };

    $: debounceUrl($seedColors);
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- This side panel houses the main user controls -->
<div class="h-screen lg:w-1/2 2xl:w-1/3 flex flex-col">
    <div class="p-4">
        <h1 class="text-2xl font-bold text-primary">MapColPal</h1>
        <h2>your pal for map color palettes</h2>
        <ul class="steps w-full pt-4">
            <li class="step step-success">Start</li>
            <li
                class="step before:transition after:transition"
                class:step-success={activePanel.id > 0}
            >
                Layers
            </li>
            <li
                class="step before:transition after:transition"
                class:step-success={activePanel.id > 1}
            >
                Test
            </li>
            <li
                class="step before:transition after:transition"
                class:step-success={activePanel.id > 2}
            >
                Export
            </li>
        </ul>
    </div>

    <div class="overflow-hidden hover:overflow-y-auto px-4">
        <!-- Call the different control element panels/components -->
        {#if activePanel.id == panels[0].id}
            <svelte:component
                this={activePanel.component}
                bind:loadSeedColors
                bind:numberOfSeedColors
                bind:textInput
            />
        {:else}
            <svelte:component this={activePanel.component} />
        {/if}
    </div>

    <div class="w-full p-4 flex-grow flex items-end flex-row justify-between">
        <button
            class="btn btn-primary"
            class:invisible={activePanel.name == "start"}
            on:click={panelBack}
            >Back
        </button>
        <div class="btn-group">
            <Tutorial />
            <About />
        </div>
        <button
            class="btn btn-primary"
            class:invisible={activePanel.name == "export"}
            on:click={panelForward}
            >Next
        </button>
    </div>
</div>
