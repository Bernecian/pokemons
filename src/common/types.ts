export type IPokemonType = {
  id: string;
  name: string;
  weight: string;
  moves: Array<{move: {name: string}}>;
  stats: Array<{stat: {name: string}; base_stat: number}>;
  types: Array<{type: {name: string}}>;
  species: {name: string};
} | null;
