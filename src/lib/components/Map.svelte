<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import * as d3 from "d3";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
    import "leaflet-providers";

    import { backgroundColor, pointPalette, areaPalette } from "../stores/colors";
    import { currentBasemap } from "../stores/basemap";
    import {
        countryPointData,
        countryAreaData,
        cityPointData,
        cityAreaData,
        cameraPositions,
    } from "../stores/data";
    import { layersStore } from "../stores/settings";
    const {
        showPointLayer,
        showAreaLayer,
        showBasemapLayer,
        pointLayerOpacity,
        areaLayerOpacity,
        basemapLayerOpacity,
        countryScale,
        pointsSizeFixed,
        pointsSizeValue,
    } = layersStore;

    //initialize variables
    let initialized = false;
    let map: L.map;
    let svg;
    let areasGroup;
    let areas;
    let pointsGroup;
    let points;
    let basemapLayer = L.tileLayer.provider($currentBasemap);
    let lastBasemap = "";

    //function definitions

    const setBackground = (color: string) => {
        let leafletContainer = <HTMLElement>document.getElementsByClassName("leaflet-container")[0];
        leafletContainer.style.background = color;
    };

    //functions regarding leaflet
    const setBasemap = () => {
        //check if basemap should be displayed
        if ($showBasemapLayer) {
            //check if basemap changed
            if ($currentBasemap !== lastBasemap) {
                //remove old basemap
                if (map.hasLayer(basemapLayer)) {
                    map.removeLayer(basemapLayer);
                }
                //add new basemap
                basemapLayer = L.tileLayer.provider($currentBasemap);
                map.addLayer(basemapLayer);
                //set changed basemap value
                lastBasemap = $currentBasemap;
            }
        } else {
            //remove old basemap
            lastBasemap = "";
            if (map.hasLayer(basemapLayer)) {
                map.removeLayer(basemapLayer);
            }
        }
    };

    const setBasemapOpacity = (opacity: string) => {
        let leafletLayer = <HTMLElement>document.getElementsByClassName("leaflet-layer")[0];
        leafletLayer.style.opacity = opacity;
    };

    //functions regarding d3
    const setElements = (groupElement, dataSource: any[]) => {
        return groupElement.selectAll("path").data(dataSource).join("path");
    };

    const setColor = (elements, palette) => {
        elements.attr("fill", (d) => palette(d.properties.data));
    };

    const calculatePointPaths = (elements, path, fixedSize, sizeValue) => {
        elements.attr("d", (d) => {
            fixedSize
                ? path.pointRadius(sizeValue)
                : path.pointRadius(d.properties.data * sizeValue);
            return path(d.geometry);
        });
    };

    const setPaths = (pointElements, areaElements, path, fixedSize, sizeValue) => {
        calculatePointPaths(pointElements, path, fixedSize, sizeValue);
        areaElements.attr("d", path);
    };

    function pointToLeaflet(x, y) {
        let point = map.latLngToLayerPoint([y, x]);
        this.stream.point(point.x, point.y);
    }

    const path = d3.geoPath().projection(d3.geoTransform({ point: pointToLeaflet }));

    const setMapScale = () => {
        map.setView(
            $cameraPositions[$countryScale ? 1 : 0].center,
            $cameraPositions[$countryScale ? 1 : 0].zoom
        );
    };

    const setDataForCurrentScale = () => {
        areas = $countryScale
            ? setElements(areasGroup, $countryAreaData)
            : setElements(areasGroup, $cityAreaData);
        points = $countryScale
            ? setElements(pointsGroup, $countryPointData)
            : setElements(pointsGroup, $cityPointData);
        setPaths(points, areas, path, $pointsSizeFixed, $pointsSizeValue);
    };

    //lifecycle function calls
    //first initialization on map component mount
    onMount(async () => {
        // initialize the map
        map = L.map("leafletmap", {
            zoomControl: false,
        });
        setMapScale();

        //add svg layer in leaflet and then select this layer with d3 and store in variable
        L.svg().addTo(map);
        svg = d3.select(map.getPanes().overlayPane).select("svg");
        //initiate svg groups to house areas and points
        areasGroup = svg.append("g").attr("id", "areas");
        pointsGroup = svg.append("g").attr("id", "points");
        //load data
        await countryPointData.loadJson("data/naturalearth_europe_capitals.geojson");
        await countryAreaData.loadJson("data/naturalearth_europe.geojson");
        await cityPointData.loadJson("data/vienna_swimmingpools.json");
        await cityAreaData.loadJson("data/vienna_districts.json");
        //add random data values
        countryPointData.randomData();
        countryAreaData.randomData();
        cityPointData.randomData();
        cityAreaData.randomData();

        initialized = true;

        //rerender the position of the elements after zoom
        map.on("zoomend", function () {
            setPaths(points, areas, path, $pointsSizeFixed, $pointsSizeValue);
        });
    });

    afterUpdate(() => {});

    //reactive declarations: run functions on specific store value changes, not in afterUpdate() to not run on every data change of any kind
    //update background color
    $: $backgroundColor, initialized && setBackground($backgroundColor);
    //set map scale and data based on countryScale
    $: $countryScale, initialized && setMapScale();
    $: $countryScale, initialized && setDataForCurrentScale();
    //set basemap
    $: $showBasemapLayer, $currentBasemap, initialized && setBasemap();
    //update hidden status of layers
    $: $showAreaLayer, initialized && areasGroup.classed("hidden", !$showAreaLayer);
    $: $showPointLayer, initialized && pointsGroup.classed("hidden", !$showPointLayer);
    //update opacity of layers
    $: $basemapLayerOpacity, initialized && setBasemapOpacity($basemapLayerOpacity.toString());
    $: $areaLayerOpacity, initialized && areasGroup.style("opacity", $areaLayerOpacity);
    $: $pointLayerOpacity, initialized && pointsGroup.style("opacity", $pointLayerOpacity);
    //update color of elements on palette change or data change
    $: $areaPalette, $countryAreaData, $cityAreaData, initialized && setColor(areas, $areaPalette);
    $: $pointPalette,
        $countryPointData,
        $cityPointData,
        initialized && setColor(points, $pointPalette);
    //update circle size on data change
    $: $countryPointData, $cityPointData, initialized && calculatePointPaths(points, path, $pointsSizeFixed, $pointsSizeValue);
</script>

<!-- This is the map component to display the leaflet map with the d3 overlays -->
<div id="leafletmap" class="h-screen lg:w-1/2 2xl:w-2/3" />
