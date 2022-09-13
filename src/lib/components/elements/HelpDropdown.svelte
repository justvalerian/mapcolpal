<script lang="ts">
    export let title = "Help";
    export let absolute = false;
    export let dropdownTop = false;
    export let dropdownEnd = false;
    export let minWidth = "min-w-[16rem]";
</script>

<!-- Help dropdown for additional information -->
<div
    class="dropdown"
    class:dropdown-top={dropdownTop}
    class:dropdown-end={dropdownEnd}
    class:absolute
    class:top-2={absolute}
    class:right-2={absolute}
>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label tabindex="0" class="btn btn-circle rounded-lg btn-ghost btn-xs text-info">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-4 h-4 stroke-current"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
        >
    </label>
    <div
        tabindex="0"
        class="card compact dropdown-content bg-base-100 rounded-lg w-fit {minWidth} border-4 border-opacity-75 border-l-white border-t-white border-b-gray-300 border-r-gray-300"
    >
        <div class="card-body">
            <h2 class="card-title">{title}</h2>
            <p>
                <slot>Help content</slot>
            </p>
        </div>
    </div>
</div>
