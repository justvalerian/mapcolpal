<script lang="ts">
    import Modal from "./Modal.svelte";
</script>

<!-- 'About' window -->
<Modal title="About">
    <div class="overflow-auto">
        <p>
            MapColPal was originally created as part of a thesis within the <a
                href="https://cartographymaster.eu/"
                target="_blank"
                class="link hover:text-secondary-focus">Cartography M.Sc.</a
            >
            programme by me, Valerian Lange, and is currently maintained as a personal project. Feel
            free to reach out if you want to get involved! Via
            <a
                href="https://www.linkedin.com/in/valerianlange/"
                target="_blank"
                class="link hover:text-secondary-focus">LinkedIn</a
            >,
            <a
                href="https://github.com/justvalerian"
                target="_blank"
                class="link hover:text-secondary-focus">github</a
            >
            or via
            <a
                href="mailto:mapcolpal@justvalerian.com"
                target="_blank"
                class="link hover:text-secondary-focus">e-mail</a
            >.
        </p>
        <p class="pt-4">
            You can find the source code
            <a
                href="https://github.com/justvalerian/mapcolpal"
                class="link hover:text-secondary-focus"
                target="_blank">here</a
            >. Links to the thesis and the abstract will be added in October 2022.
        </p>
        <h3 class="font-semibold pt-4">Technical aspects</h3>
        <p>
            Made with Svelte, vite, TypeScript, postCSS, tailwindCSS and daisyUI via <a
                href="https://github.com/svelte-add/svelte-add"
                target="_blank"
                class="link hover:text-secondary-focus">svelte-add</a
            >.<br />The user interface uses flat shading inspired by and loosely designed after the
            classic Tanaka contours.<br />Using the following npm packages: d3, chroma-js, leaflet,
            leaflet-providers, merge-images, and color-blind.
        </p>
        <h3 class="font-semibold pt-4">Sources</h3>
        <p>The data used is open data from the following sources:</p>
        <ul class="list-[square] pl-4 marker:text-secondary">
            <li>
                Small scale: European Union country polygons and capital city points from <a
                    href="https://www.naturalearthdata.com/"
                    target="_blank"
                    class="link hover:text-secondary-focus">Natural Earth</a
                > (public domain)
            </li>
            <li>
                Large scale: <a
                    href="https://www.data.gv.at/katalog/dataset/2ee6b8bf-6292-413c-bb8b-bd22dbb2ad4b"
                    target="_blank"
                    class="link hover:text-secondary-focus">Vienna districts</a
                >
                as polygons and
                <a
                    href="https://www.data.gv.at/katalog/dataset/898afe8c-0297-45d6-b4b5-0cb9e632094b"
                    target="_blank"
                    class="link hover:text-secondary-focus">Vienna public swimming pools</a
                >
                as points (both licensed under
                <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    class="link hover:text-secondary-focus">CC BY 4.0</a
                >), data source: Stadt Wien –
                <a
                    href="https://data.wien.gv.at"
                    target="_blank"
                    class="link hover:text-secondary-focus">data.wien.gv.at</a
                >.
            </li>
        </ul>
        <h3 class="font-semibold pt-4">License</h3>
        <p>
            MapColPal © Valerian Lange under the MIT license. See <a
                href="https://github.com/justvalerian/mapcolpal"
                class="link hover:text-secondary-focus"
                target="_blank">code repository</a
            > for details.
        </p>
    </div>
    <div class="grow flex flex-row justify-end items-end">
        <p class="flex-none">
            Code with 💜 by <a
                href="https://justvalerian.com/"
                class="hover:text-secondary-focus"
                target="_blank">justvalerian</a
            >.
        </p>
    </div>
</Modal>
