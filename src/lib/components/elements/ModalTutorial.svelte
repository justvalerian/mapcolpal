<script lang="ts">
    import { onMount } from "svelte";
    import chroma from "chroma-js";
    import Modal from "./Modal.svelte";
    import { showTutorial } from "../../stores/settings";
    import HelpDropdown from "./HelpDropdown.svelte";
    let page = 0;
    let oklchHues = [];
    //calculate equally spread hues for display in tutorial
    let number = 9;
    let hueStep = 360 / number;
    let currentHue = 0;
    for (let i = 0; i < number + 1; i++) {
        oklchHues.push({ hue: currentHue, color: chroma.oklch(0.7, 0.2, currentHue).hex() });
        currentHue += hueStep;
    }
</script>

<!-- 'Settings' window -->
<Modal title="Tutorial" bind:show={$showTutorial}>
    <div class="flex lg:flex-row flex-col h-full">
        <ul class="steps h-32 lg:h-auto lg:steps-vertical lg:w-64 p-4 flex-shrink-0">
            <li
                data-content="⭐"
                class="step step-info"
                class:font-semibold={page == 0}
                class:text-lg={page == 0}
            >
                <p class="text-start">Introduction</p>
            </li>
            <li
                data-content="🌱"
                class="step before:transition after:transition"
                class:step-info={page > 0}
                class:font-semibold={page == 1}
                class:text-lg={page == 1}
            >
                <p class="text-start">1. Generate seed colors</p>
            </li>
            <li
                data-content="🧅"
                class="step before:transition after:transition"
                class:step-info={page > 1}
                class:font-semibold={page == 2}
                class:text-lg={page == 2}
            >
                <p class="text-start">2. Adjust layers</p>
            </li>
            <li
                data-content="🎯"
                class="step before:transition after:transition"
                class:step-info={page > 2}
                class:font-semibold={page == 3}
                class:text-lg={page == 3}
            >
                <p class="text-start">3. Test palettes</p>
            </li>
            <li
                data-content="📦"
                class="step before:transition after:transition"
                class:step-info={page > 3}
                class:font-semibold={page == 4}
                class:text-lg={page == 4}
            >
                <p class="text-start">4. Export them!</p>
            </li>
        </ul>
        <div class="flex flex-col flex-1">
            <div
                class="h-10 flex-shrink flex-grow overflow-auto p-2 rounded-lg border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
            >
                {#if page == 0}
                    <h3 class="font-semibold text-lg">Welcome to MapColPal!</h3>
                    <div class="ml-4">
                        <p class="pt-4">
                            MapColPal is a tool to ease working with color palettes for thematic
                            maps.
                        </p>
                        <p class="pt-4">
                            This app is color coded in the following way: Important user interface
                            elements are marked <span class="text-primary">blue</span> and minor
                            elements are <span class="text-accent">yellow</span>. The most important
                            actions are highlighted in <span class="text-secondary">pink</span>.
                        </p>
                        <p class="pt-4">
                            Tip: You can also navigate the side panels pressing <kbd class="kbd"
                                >◀︎</kbd
                            >
                            and
                            <kbd class="kbd">▶︎</kbd> on your keyboard.
                        </p>
                        <p class="pt-4">
                            The next sections of this tutorial lead you through each of the screens
                            of the app and there are also info icons <HelpDropdown title="Info icon"
                                >You will find these all over the app!</HelpDropdown
                            > placed throughout the website with more concise information!
                        </p>
                    </div>
                {:else if page == 1}
                    <h3 class="font-semibold text-lg">Start panel</h3>
                    <div class="ml-4">
                        <p class="pt-4">
                            On the start panel, you create seed colors which are the basis for the
                            palette derivation in the next step and allow to derive multiple related
                            color palettes based on the same shared set of colors.
                        </p>
                        <p class="pt-4">
                            You can choose either to generate or load seed colors (Hint: When you
                            copy-paste a MapColPal URL with seed colors in it, they will be loaded
                            automatically!), when you choose to generate them, you have the
                            following options:
                        </p>
                        <ul class="list-[square] pl-4 marker:text-secondary">
                            <li>
                                Generating them harmoniously spread out: With this option, MapColPal
                                will generate a random color and then generate the rest of them
                                according to a hue template (complementary, triadic, and so on;
                                based on the number of colors to generate)
                            </li>
                            <li>
                                Generate them in the same fashion, but then mapped to a certain
                                range of hues only.
                            </li>
                            <li>
                                Fitted to a basemap, this also works following the same principle,
                                but a start color is derived from the currently visible map tiles of
                                the chosen basemap. Then the seed colors are chosen relative to this
                                start color.
                            </li>
                            <li>Random generation</li>
                        </ul>
                        <p class="pt-4">
                            If you want to use the hue filter, the hues are distributed from 0 to
                            360 degrees in the following way:
                        </p>
                        <div class="h-10 flex flex-row flex-wrap pt-2 pr-4">
                            {#each oklchHues as obj}
                                <p
                                    class="flex-grow text-base-100 text-center"
                                    style="background-color: {obj.color};"
                                >
                                    {obj.hue}
                                </p>
                            {/each}
                        </div>
                        <p class="pt-4">
                            Wherever in MapColPal seed colors are displayed, you can click on them
                            to adjust them and see the changes applied in realtime!
                        </p>
                        <p class="pt-4">
                            MapColPal uses the oklch color space (which is a polar conversion of <a
                                href="https://bottosson.github.io/posts/oklab/"
                                target="_blank"
                                class="link hover:text-secondary-focus">oklab</a
                            >). More color spaces will be added as options in the future.
                        </p>
                    </div>
                {:else if page == 2}
                    <h3 class="font-semibold text-lg">Layers panel</h3>
                    <div class="ml-4">
                        <p class="pt-4">
                            On the layers panel, you can adjust the zoom level of the map and the
                            example data to be displayed, as well as change the data type per layer
                            to fit your use case. Then, you drag and drop seed colors into the drop
                            zone highlighted in green to derive your palettes.
                        </p>
                        <p class="pt-4">
                            There are also a lot of more detailed options to choose from. It is
                            recommended to just try them out, as all changes in MapColPal are
                            instantly applied and visualized, so you can easily learn their usage by
                            just toggling options on and off.
                        </p>
                        <p class="pt-4">
                            The main idea of palette derivation in MapColPal is to adjust color
                            parameters (in oklch, these are lightness, chroma and hue) purposefully
                            following the concept of visual variables depending on the type of data
                            to be displayed. Depending on the chosen data type (sequential,
                            diverging or qualitative), MapColPal changes the lightness optimization
                            (more on this on the next page about testing palettes):
                        </p>
                        <ul class="list-[square] pl-4 marker:text-secondary">
                            <li>
                                For sequential palettes, lightness is adjusted to range from dark to
                                light or vice versa in equally sized steps. When only one seed color
                                is placed in the drop zone, lightness steps of this color are
                                generated automatically.
                            </li>
                            <li>
                                For diverging palettes, lightness is adjusted to range from dark to
                                light to dark or vice versa in equally sized steps. If only one
                                color is placed in the drop zone, the opposing color is chosen to be
                                complementary to it and the middle is a neutral grey, for two
                                colors, the middle color is automatically set to a neutral grey as
                                well.
                            </li>
                            <li>
                                For qualitative palettes, lightness is adjusted to be the same for
                                every color. Here, hue is the defining difference between colors,
                                therefore it is recommended to generate enough seed colors to have
                                one for each palette class to use the full range of available hues
                                to make them as noticeably different as possible.
                            </li>
                        </ul>
                    </div>
                {:else if page == 3}
                    <h3 class="font-semibold text-lg">Test panel</h3>
                    <div class="ml-4">
                        <p class="pt-4">
                            On the test panel, you can apply a color vision deficiency (CVD)
                            simulation and check the lightness graphs for your palettes.
                        </p>
                        <p class="pt-4">
                            If CVDs are not considered in palette creation, they can lead to
                            obstructed understanding of data for some viewers. The most common one
                            is deuteranomaly, followed by deuteranopia, protanomaly, and protanopia.
                            So testing a palette against deuteranomaly is recommended as a bare
                            minimum. For more comprehensive testing, at least testing against
                            deuteranopia and protanopia is recommended.
                        </p>
                        <ul class="list-[square] pl-4 marker:text-secondary">
                            <li>
                                Deuteranomaly: reduced distinction of reddish and greenish contents
                                of colors
                            </li>
                            <li>
                                Deuteranopia: no distinction of reddish and greenish contents of
                                colors
                            </li>
                            <li>
                                Protanomaly: similar to deuteranomaly, reddish colors also more dim
                            </li>
                            <li>
                                Protanopia: similar to deuteranopia, reddish colors also more dim
                            </li>
                        </ul>
                        <p class="pt-4">
                            Charting lightness steps within a color palette (in a perceptually uniform color space) can be a great help in testing a color palette.
                        </p>
                        <ul class="list-[square] pl-4 marker:text-secondary">
                            <li>
                                For sequential data, aim for a straight line with equal steps from
                                dark to light or vice versa.
                            </li>
                            <li>
                                For diverging data, aim for a V or U shaped lightness graph from
                                dark to light to dark or vice versa.
                            </li>
                            <li>
                                For qualitative data, aim for the same lightness all over
                                the palette.
                            </li>
                        </ul>
                    </div>
                {:else if page == 4}
                    <h3 class="font-semibold text-lg">Export panel</h3>
                    <div class="ml-4">
                        <p class="pt-4">On the export panel, you can copy the colors of your palettes (as well as seed and input colors) as JavaScript arrays.</p>
                        <p class="pt-4">Palettes can be formatted as hexcodes (supported by any major software dealing with colors and used in web programming), RGB components (as used in CSS) or as CIE Lab and Lch components for more specific applications.</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="card-actions justify-end">
        <button class="btn btn-primary" class:invisible={page == 0} on:click={() => page--}
            >Back
        </button>
        <button class="btn btn-primary" class:invisible={page == 4} on:click={() => page++}
            >Next
        </button>
    </div>
</Modal>
