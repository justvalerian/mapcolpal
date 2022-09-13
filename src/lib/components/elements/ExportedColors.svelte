<script lang="ts">
    import { fade } from "svelte/transition";

    export let colors;
    export let colorsText;
    export let title;
    let thisElement: HTMLElement;
    let exportCopied = false;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(thisElement.innerText);
        exportCopied = true;
        setTimeout(() => {
            exportCopied = false;
        }, 1500);
    };
</script>

<!-- Exported colors component -->
<div
    class="my-2 bg-base-200 rounded-lg py-2 border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
>
    <div class="flex flex-row flex-wrap items-center justify-between pl-4 pr-2 pb-2">
        <h4 class="font-semibold">{title}</h4>
        <button class="btn btn-sm btn-secondary" on:click={() => copyToClipboard()}>Copy</button>
    </div>
    <div
        class="h-8 mx-8 mb-2 flex flex-row border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
    >
        {#each colors as color}
            <div class="flex-grow" style="background-color: {color};" />
        {/each}
    </div>
    <p
        class="mx-8 px-2 overflow-x-auto bg-base-100 rounded-lg border-4 border-opacity-75 border-r-white border-b-white border-l-gray-300 border-t-gray-300"
        bind:this={thisElement}
    >
        {colorsText}
    </p>

    {#if exportCopied}
        <div
            transition:fade={{ duration: 300 }}
            class="z-[1010] fixed bottom-10 left-20 right-20 m-auto w-fit alert alert-success p-4 self-center border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
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
                <span>Successfully copied {thisElement.innerText} to the clipboard!</span>
            </div>
        </div>
    {/if}
</div>
