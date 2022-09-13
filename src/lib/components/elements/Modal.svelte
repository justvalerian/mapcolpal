<script lang="ts">
    import { fade, scale } from "svelte/transition";

    export let show = false;
    export let title = "Modal";
</script>

<!-- Modal window with button -->
<button class="btn btn-ghost" on:click={() => (show = true)}>{title}</button>
{#if show}
    <div
        transition:fade={{ duration: 300 }}
        class="z-[1010] fixed left-0 top-0 w-screen h-screen flex items-center justify-center"
    >
        <div
            class="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-25 cursor-pointer"
            on:click={() => (show = false)}
        />
        <div
            transition:scale
            class="card w-[90%] h-[90%] 2xl:w-[75%] 2xl:h-[75%] bg-base-100 rounded-lg border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300
        "
        >
            <button
                class="btn btn-secondary btn-sm btn-circle rounded-lg absolute right-2 top-2"
                on:click={() => (show = false)}>✕</button
            >
            <div class="card-body h-full">
                <h2 class="card-title">{title}</h2>
                <slot>
                    <p>Modal content</p>
                </slot>
            </div>
        </div>
    </div>
{/if}
