// Claude design language — the single source for colours consumed by
// canvas-rendered surfaces (Chart.js) and inline SVG, which cannot read
// Tailwind utilities. Keep these in step with the ramps in index.css.

export const COLORS = {
  clay: '#d97757',
  clayDeep: '#c0603f',
  claySoft: '#e2ae9b',
  clayWash: 'rgba(217, 119, 87, 0.14)',

  ochre: '#b3813a',
  ochreDeep: '#96692c',
  ochreWash: 'rgba(179, 129, 58, 0.14)',

  dusk: '#647f9b',
  duskDeep: '#51687f',
  duskWash: 'rgba(100, 127, 155, 0.14)',

  plum: '#8b6b8a',
  brick: '#ad6153',
  sage: '#6f8271',

  ink: '#141413',
  inkSoft: '#565349',
  stone: '#9c988d',
  hairline: 'rgba(20, 20, 19, 0.07)',
  surface: '#fefdfb',
};

// Ordered palette for categorical series, tuned so adjacent entries stay
// distinguishable in both hue and lightness.
export const SERIES = [COLORS.clay, COLORS.dusk, COLORS.ochre, COLORS.plum, COLORS.sage];
