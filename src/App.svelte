<script lang="ts">
    import Map from "./lib/components/Map.svelte";
    import SidePanel from "./lib/components/controls/SidePanel.svelte";
</script>

<!-- This is the main component which initializes the app -->
<main class="flex flex-col lg:flex-row">
    <SidePanel />

    <Map />
</main>
