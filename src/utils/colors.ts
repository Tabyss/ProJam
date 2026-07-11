export type ThemeColor =
    | "primary"
    | "secondary"
    | "accent"
    | "background"
    | "text";

export type ColorShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const THEME_COLORS: ThemeColor[] = [
    "primary",
    "secondary",
    "accent",
    "background",
    "text",
];

export const COLOR_SHADES: ColorShade[] = [
    100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export interface PaletteColor {
    id: string;
    label: string;
    cssValue: string;
    tailwindClass: string;
}

export const getThemePalette = (): PaletteColor[] => {
    const palette: PaletteColor[] = [];

    THEME_COLORS.forEach((color) => {
        COLOR_SHADES.forEach((shade) => {
            palette.push({
                id: `${color}-${shade}`,
                label: `${color} ${shade}`,
                cssValue: `var(--color-${color}-${shade})`,
                tailwindClass: `bg-${color}-${shade}`,
            });
        });
    });

    return palette;
};

export const getSpecificColor = (
    color: ThemeColor,
    shade: ColorShade,
): string => {
    return `var(--color-${color}-${shade})`;
};