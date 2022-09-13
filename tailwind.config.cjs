const daisyui = require("daisyui");

const config = {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    plugins: [daisyui],

    daisyui: {
        themes: [
            {
                cupcake: {
                    ...require("daisyui/src/colors/themes")["[data-theme=cupcake]"],
                    "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
                },
            },
        ],
    },
};

module.exports = config;
