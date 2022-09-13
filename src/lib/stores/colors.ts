/* This store stores all values related to colors and palette generation relevant to more than one component */

//imports
import { derived, writable, readable, type Readable, type Writable } from "svelte/store";
import chroma from "chroma-js";
import blinder from "color-blind";

import { currentCvd } from "./colorvisiondeficiency";
import { seedColorImportSuccess, seedColorImportError } from "./settings";

//helper functions
// rescale values from one range to another
const rescale = (
    value: number,
    minAfter: number,
    maxAfter: number,
    minBefore = 0,
    maxBefore = 1
) => {
    let newValue =
        minAfter + ((value - minBefore) * (maxAfter - minAfter)) / (maxBefore - minBefore);
    return newValue;
};

//stores, in order of process flow
export const seedColors = (() => {
    const S = writable([{ color: "#000000", id: 0, pointInputIndex: 0, areaInputIndex: 0 }]);
    const { set, subscribe, update } = S;

    function generate(number: number, startColor = "none") {
        S.update((cols) => {
            //update input indices for colors that will be removed
            if (number < cols.length) {
                for (let i = number; i < cols.length; i++) {
                    seedColors.removeFromInput(true, cols[i].id);
                    seedColors.removeFromInput(false, cols[i].id);
                }
            }
            //set array to new length
            cols.length = number;

            let currentColor = chroma.random();
            currentColor = currentColor.set("oklch.l", "0.7");
            let hueShift = 360 / number;

            if (startColor != "none") {
                currentColor = chroma(startColor);
                hueShift = 360 / number + 1;
                currentColor = currentColor.set("oklch.h", "+" + hueShift.toString());
                currentColor = currentColor.set("oklch.c", rescale(Math.random(), 0.3, 1));
            }

            for (let i = 0; i < number; i++) {
                if (cols[i] == undefined) {
                    cols[i] = {
                        color: "",
                        id: i,
                        pointInputIndex: -1,
                        areaInputIndex: -1,
                    };
                }

                cols[i].color = currentColor.hex();

                currentColor = chroma(currentColor).set("oklch.h", "+" + hueShift.toString());
            }

            return cols;
        });
    }

    function generateRandom(number: number) {
        S.update((cols) => {
            //update input indices for colors that will be removed
            if (number < cols.length) {
                for (let i = number; i < cols.length; i++) {
                    seedColors.removeFromInput(true, cols[i].id);
                    seedColors.removeFromInput(false, cols[i].id);
                }
            }
            //set array to new length
            cols.length = number;

            for (let i = 0; i < number; i++) {
                if (cols[i] == undefined) {
                    cols[i] = {
                        color: "",
                        id: i,
                        pointInputIndex: -1,
                        areaInputIndex: -1,
                    };
                }

                cols[i].color = chroma.random().hex();
            }

            return cols;
        });
    }

    function load(colorArray: string[]) {
        S.update((cols) => {
            //update input indices for colors that will be removed
            if (colorArray.length < cols.length) {
                for (let i = colorArray.length; i < cols.length; i++) {
                    seedColors.removeFromInput(true, cols[i].id);
                    seedColors.removeFromInput(false, cols[i].id);
                }
            }
            //set array to new length
            cols.length = colorArray.length;

            for (let i = 0; i < colorArray.length; i++) {
                if (cols[i] == undefined) {
                    cols[i] = {
                        color: "",
                        id: i,
                        pointInputIndex: -1,
                        areaInputIndex: -1,
                    };
                }

                cols[i].color = colorArray[i];
            }

            return cols;
        });
    }

    function loadFromText(textInput: string) {
        //  regular expressions to find hexadecimal color codes
        const regEx = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

        let foundColorCodes = textInput.match(regEx);
        if (foundColorCodes != null) {
            seedColors.load(foundColorCodes);
            seedColorImportSuccess.set(true);
            setTimeout(() => {
                seedColorImportSuccess.set(false);
            }, 1500);
        } else {
            seedColorImportError.set(true);
            setTimeout(() => {
                seedColorImportError.set(false);
            }, 1500);
        }
    }

    function initialize(load: boolean, number?: number, textInput?: string) {
        load ? seedColors.loadFromText(textInput) : seedColors.generate(number);

        S.update((cols) => {
            //assign seed colors as input colors
            seedColors.setInputIndex(cols, 0, true, 0);
            seedColors.setInputIndex(cols, 0, false, 0);
            if (cols.length >= 2) {
                seedColors.setInputIndex(cols, 1, true, 1);
                seedColors.setInputIndex(cols, 1, false, 1);
            }
            if (cols.length >= 3) {
                seedColors.setInputIndex(cols, 2, true, 2);
                seedColors.setInputIndex(cols, 2, false, 2);
            }
            return cols;
        });
    }

    function setInputIndex(
        colors: { color: string; id: number; pointInputIndex: number; areaInputIndex: number }[],
        idOfColor: number,
        assignToPointIndex: boolean,
        newValue: number
    ) {
        //set an index for an element
        assignToPointIndex
            ? (colors[idOfColor].pointInputIndex = newValue)
            : (colors[idOfColor].areaInputIndex = newValue);
        return colors;
    }

    function rescaleHue(newMin: number, newMax: number) {
        S.update((cols) => {
            cols.forEach((obj) => {
                let hue: number = chroma(obj.color).get("oklch.h");

                if (newMin < newMax) {
                    hue = rescale(hue, newMin, newMax, 0, 360);
                } else {
                    hue = rescale(hue, newMin, 360 + newMax, 0, 360);

                    if (hue > 360) {
                        hue -= 360;
                    }
                }

                obj.color = chroma(obj.color).set("oklch.h", hue).hex();
            });

            return cols;
        });
    }

    function removeFromInput(assignToPointIndex: boolean, draggedId: number) {
        let indexProperty = assignToPointIndex ? "pointInputIndex" : "areaInputIndex";

        S.update((colors) => {
            let seedIndex = colors.findIndex((color) => color.id == draggedId);
            let inputIndex = colors[seedIndex][indexProperty];
            //if color not in input, then just return early
            if (inputIndex < 0) {
                return colors;
            }
            //if color in input, then remove and lower index of colors after by 1
            colors[seedIndex][indexProperty] = -1;
            colors.forEach((obj) => {
                if (obj[indexProperty] > inputIndex) {
                    obj[indexProperty] -= 1;
                }
            });
            return colors;
        });
    }

    function addToInputEnd(assignToPointIndex: boolean, draggedId: number) {
        let indexProperty = assignToPointIndex ? "pointInputIndex" : "areaInputIndex";

        S.update((colors) => {
            let seedIndex = colors.findIndex((color) => color.id == draggedId);
            let inputIndex = colors[seedIndex][indexProperty];
            //if element was in input, remove at old position
            if (inputIndex >= 0) {
                seedColors.removeFromInput(assignToPointIndex, draggedId);
            }
            //then add to end of input colors
            //test if Math.max(...colors.map(obj => obj[indexProperty])) to find the current maximum and add 1 to it is faster than current code
            let filtered = colors.filter((obj) => obj[indexProperty] !== -1);
            colors[seedIndex][indexProperty] = filtered.length;
            return colors;
        });
    }

    function addToInputPosition(assignToPointIndex: boolean, draggedId: number, targetId: number) {
        let indexProperty = assignToPointIndex ? "pointInputIndex" : "areaInputIndex";

        S.update((colors) => {
            let seedIndex = colors.findIndex((color) => color.id == draggedId);
            let seedIndexTarget = colors.findIndex((color) => color.id == targetId);
            //if element is dropped on itself, return early
            if (seedIndex == seedIndexTarget) {
                return colors;
            }
            let inputIndex = colors[seedIndex][indexProperty];
            let inputIndexTarget = colors[seedIndexTarget][indexProperty];
            //if element was in input, remove at old position
            if (inputIndex >= 0) {
                seedColors.removeFromInput(assignToPointIndex, draggedId);
            }
            //then raise indices of input colors at and after new position by 1 and then add at new position
            colors.forEach((obj) => {
                if (obj[indexProperty] >= inputIndexTarget) {
                    obj[indexProperty] += 1;
                }
            });
            colors[seedIndex][indexProperty] = inputIndexTarget;
            return colors;
        });
    }

    return {
        set,
        subscribe,
        update,
        generate,
        generateRandom,
        load,
        loadFromText,
        initialize,
        setInputIndex,
        rescaleHue,
        removeFromInput,
        addToInputEnd,
        addToInputPosition,
    };
})();

export const paletteTypes = readable(["sequential", "diverging", "qualitative"]);
export const pointPaletteType = writable("sequential");
export const areaPaletteType = writable("sequential");
export const pointPaletteClasses = writable(9);
export const areaPaletteClasses = writable(9);

const deriveInputColors = (
    colors: Writable<
        { color: string; id: number; pointInputIndex: number; areaInputIndex: number }[]
    >,
    pointInput: boolean
) => {
    return derived(colors, ($colors) => {
        let filtered: {
            color: string;
            id: number;
            pointInputIndex: number;
            areaInputIndex: number;
        }[];
        if (pointInput) {
            filtered = $colors.filter((obj) => obj.pointInputIndex !== -1);
            filtered.sort((a, b) => a.pointInputIndex - b.pointInputIndex);
        } else {
            filtered = $colors.filter((obj) => obj.areaInputIndex !== -1);
            filtered.sort((a, b) => a.areaInputIndex - b.areaInputIndex);
        }
        return filtered;
    });
};

export const pointInputColors = deriveInputColors(seedColors, true);
export const areaInputColors = deriveInputColors(seedColors, false);

export const pointLightnessCorrection = writable(true);
export const areaLightnessCorrection = writable(true);

export const pointBezierInterpolation = writable(true);
export const areaBezierInterpolation = writable(true);

const deriveAdjustedInputColors = (
    colors: Readable<
        { color: string; id: number; pointInputIndex: number; areaInputIndex: number }[]
    >,
    lightnessMid: Writable<number>,
    lightnessRange: Readable<number>,
    paletteType: Readable<string>,
    classes: Writable<number>,
    lightnessCorrection: Writable<boolean>,
    adjustCvd: Writable<string>
) => {
    return derived(
        [
            colors,
            lightnessMid,
            lightnessRange,
            paletteType,
            classes,
            lightnessCorrection,
            adjustCvd,
        ],
        ([
            $colors,
            $lightnessMid,
            $lightnessRange,
            $paletteType,
            $classes,
            $lightnessCorrection,
            $adjustCvd,
        ]) => {
            //deep copy array of objects
            let adjusted = $colors.map((obj) => Object.assign({}, obj));

            //apply before-palette-generation adjustments
            switch ($paletteType) {
                case "sequential":
                    if ($lightnessCorrection) {
                        //handling for only one input color
                        if (adjusted.length < 2) {
                            adjusted.splice(1, 0, Object.assign({}, adjusted[0]));
                        }
                        //set first color darker
                        adjusted[0].color = chroma(adjusted[0].color)
                            .set("oklch.l", $lightnessMid - $lightnessRange)
                            .hex();
                        //set last color lighter
                        let lastIndex = adjusted.length - 1;
                        adjusted[lastIndex].color = chroma(adjusted[lastIndex].color)
                            .set("oklch.l", $lightnessMid + $lightnessRange)
                            .hex();
                    }
                    break;

                case "diverging":
                    if ($lightnessCorrection) {
                        //handling for only two input colors
                        if (adjusted.length == 2) {
                            adjusted.splice(1, 0, {
                                color: chroma.oklch(0.5, 0, NaN),
                                id: NaN,
                                pointInputIndex: NaN,
                                areaInputIndex: NaN,
                            });
                        } else if (adjusted.length == 1) {
                            //handling for only one input color
                            adjusted.splice(1, 0, {
                                color: chroma.oklch(0.5, 0, NaN),
                                id: NaN,
                                pointInputIndex: NaN,
                                areaInputIndex: NaN,
                            });
                            let complementaryColor = Object.assign({}, adjusted[0]);
                            complementaryColor.color = chroma(complementaryColor.color)
                                .set("oklch.h", "+180")
                                .hex();
                            adjusted.splice(2, 0, complementaryColor);
                        }
                        //set first element darker
                        adjusted[0].color = chroma(adjusted[0].color)
                            .set("oklch.l", $lightnessMid - $lightnessRange)
                            .hex();
                        //set middle element(s) lighter
                        if (adjusted.length >= 3) {
                            let middleIndex = Math.floor(adjusted.length / 2);
                            let middleIndices =
                                adjusted.length % 2 == 1
                                    ? [middleIndex]
                                    : [middleIndex, middleIndex - 1];
                            for (const i of middleIndices) {
                                adjusted[i].color = chroma(adjusted[i].color)
                                    .set("oklch.l", $lightnessMid + $lightnessRange)
                                    .hex();
                            }
                        }
                        //set last element darker
                        let lastIndex = adjusted.length - 1;
                        adjusted[lastIndex].color = chroma(adjusted[lastIndex].color)
                            .set("oklch.l", $lightnessMid - $lightnessRange)
                            .hex();
                    }
                    break;

                case "qualitative":
                    if ($lightnessCorrection) {
                        adjusted = adjusted.map((obj) => {
                            obj.color = chroma(obj.color).set("oklch.l", $lightnessMid).hex();
                            return obj;
                        });
                    }
                    break;

                default:
                    break;
            }

            /*             //apply global adjustments afterwards
                adjusted.forEach((obj) => {
                    let lightness = chroma(obj.color).get("oklch.l");
                    let newLightness = rescale(lightness, $lightnessMin, $lightnessMax);
                    let adjustedColor = chroma(obj.color).set("oklch.l", newLightness);
                    obj.color = adjustedColor.hex();
                }); */

            //apply CVD simulation
            if ($adjustCvd != "none") {
                adjusted.forEach((obj) => {
                    obj.color = blinder[$adjustCvd](obj.color);
                });
            }

            return adjusted;
        }
    );
};

export const pointLightnessMid = writable(0.5);
export const pointLightnessRange = writable(0.2);
export const areaLightnessMid = writable(0.7);
export const areaLightnessRange = writable(0.2);

export const pointInvertLightness = writable(false);
export const areaInvertLightness = writable(false);

const deriveInvertedRange = (
    range: Readable<number>,
    invert: Readable<boolean>
): Readable<number> => {
    return derived([range, invert], ([$range, $invert]) => {
        let result = $invert ? -$range : $range;
        return result;
    });
};

const pointLightnessRangeInverted = deriveInvertedRange(pointLightnessRange, pointInvertLightness);
const areaLightnessRangeInverted = deriveInvertedRange(areaLightnessRange, areaInvertLightness);

const adjustedPointInputColors = deriveAdjustedInputColors(
    pointInputColors,
    pointLightnessMid,
    pointLightnessRangeInverted,
    pointPaletteType,
    pointPaletteClasses,
    pointLightnessCorrection,
    currentCvd
);
const adjustedAreaInputColors = deriveAdjustedInputColors(
    areaInputColors,
    areaLightnessMid,
    areaLightnessRangeInverted,
    areaPaletteType,
    areaPaletteClasses,
    areaLightnessCorrection,
    currentCvd
);

const derivePalette = (
    adjustedColors: Readable<
        { color: string; id: number; pointInputIndex: number; areaInputIndex: number }[]
    >,
    paletteType: Readable<string>,
    classes: Writable<number>,
    lightnessCorrection: Writable<boolean>,
    bezierInterpolation: Writable<boolean>
) => {
    return derived(
        [adjustedColors, paletteType, classes, lightnessCorrection, bezierInterpolation],
        ([$adjustedColors, $paletteType, $classes, $lightnessCorrection, $bezierInterpolation]) => {
            let colorsArray = $adjustedColors.map((obj) => obj.color);

            //for diverging palettes apply lightness correction for each half of the palette and then merge back together
            if ($lightnessCorrection && $paletteType == "diverging") {
                let firstHalf = colorsArray.slice(0, Math.floor(colorsArray.length / 2) + 1);
                let secondHalf = colorsArray.slice(
                    Math.floor(colorsArray.length / 2),
                    colorsArray.length
                );
                let firstPalette = chroma.scale(firstHalf).mode("oklch").correctLightness();
                let secondPalette = chroma.scale(secondHalf).mode("oklch").correctLightness();
                let correctedHalves = [
                    ...firstPalette.colors($classes),
                    ...secondPalette.colors($classes),
                ];
                colorsArray = correctedHalves;
            }

            //build palette
            let palette = chroma.scale(colorsArray);
            //build from bezier interpolation
            if ($paletteType == "sequential" || $paletteType == "diverging") {
                if ($bezierInterpolation && colorsArray.length > 1) {
                    palette = chroma.bezier(colorsArray).scale();
                }
            }
            //create classed palette and use oklch as interpolation colorspace
            palette.classes($classes).mode("oklch");

            //apply after-palette-generation adjustments
            switch ($paletteType) {
                case "sequential":
                    if ($lightnessCorrection) {
                        palette = palette.correctLightness();
                    }
                    break;

                case "diverging":
                    break;

                case "qualitative":
                    break;

                default:
                    break;
            }

            return palette;
        }
    );
};

export const pointPalette = derivePalette(
    adjustedPointInputColors,
    pointPaletteType,
    pointPaletteClasses,
    pointLightnessCorrection,
    pointBezierInterpolation
);
export const areaPalette = derivePalette(
    adjustedAreaInputColors,
    areaPaletteType,
    areaPaletteClasses,
    areaLightnessCorrection,
    areaBezierInterpolation
);

export const basemapColors = writable(["#000000"]);

export const backgroundColor = writable("#FFFFFF");

const derivePaletteColors = (
    palette: Readable<any>,
    classes: Writable<number>
): Readable<string[]> => {
    return derived([palette, classes], ([$palette, $classes]) => {
        return $palette.colors($classes);
    });
};

export const pointPaletteColors = derivePaletteColors(pointPalette, pointPaletteClasses);
export const areaPaletteColors = derivePaletteColors(areaPalette, areaPaletteClasses);
