import {API} from '../../common/api';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IPokemonType} from '../../common/types';

type PokemonsData = {
  count: number;
  next?: string;
  previous?: string;
  results: Array<{name: string; url: string}>;
} | null;

interface PokemonsState {
  pokemonsData: PokemonsData;
  allPokemonsData: PokemonsData;
  pokemonsDataLoading: boolean;
  fetchPokemonsError: null | string;
  fetchAllPokemonsError: null | string;
  allPokemonsDataLoading: boolean;
  selectedPokemonName: string | null;
  selectedPokemonData: IPokemonType;
  selectedPokemonDataLoading: boolean;
  fetchPokemonsByNameError: null | string;
}

const initialState: PokemonsState = {
  pokemonsData: null,
  allPokemonsData: null,
  pokemonsDataLoading: false,
  allPokemonsDataLoading: false,
  fetchPokemonsError: null,
  fetchAllPokemonsError: null,
  selectedPokemonName: null,
  selectedPokemonData: null,
  selectedPokemonDataLoading: false,
  fetchPokemonsByNameError: null,
};

const fetchPokemons = createAsyncThunk(
  'pokemons/fetchPokemons',
  async ({limit, offset}: {limit: string; offset: string}, {rejectWithValue}) => {
    const response = await fetch(`${API.POKEMONS}?limit=${limit}&offset=${offset}`);
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue('Something went wrong !');
    }
  },
);

const fetchPokemonByName = createAsyncThunk(
  'pokemons/fetchPokemonsByName',
  async ({name}: {name: string}, {rejectWithValue}) => {
    const response = await fetch(`${API.POKEMONS}/${name}`);
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue('Something went wrong !');
    }
  },
);

const fetchAllPokemons = createAsyncThunk(
  'pokemons/fetchAllPokemons',
  async (d, {rejectWithValue}) => {
    const response = await fetch(`${API.POKEMONS}?limit=100000`);
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue('Something went wrong !');
    }
  },
);

export const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    setSelectedPokemonName: (state, action: {type: string; payload: string | null}) => {
      state.selectedPokemonName = action.payload;
    },
    searchPokemon: (state, action: {payload: string}) => {
      // Filtering array locally, as there is no endpoint for <<like>> search
      if (state.allPokemonsData) {
        state.pokemonsData = {
          ...state.allPokemonsData,
          results: state.allPokemonsData.results.filter((item) =>
            item.name.toLowerCase().includes(action.payload.toLowerCase()),
          ),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPokemons.pending, (state, action) => {
      state.fetchPokemonsError = null;
      state.pokemonsDataLoading = true;
    });
    builder.addCase(fetchPokemons.fulfilled, (state, action) => {
      state.fetchPokemonsError = null;
      state.pokemonsData = action.payload;
      state.pokemonsDataLoading = false;
    });
    builder.addCase(fetchPokemons.rejected, (state, action) => {
      state.fetchPokemonsError = action.payload as string;
      state.pokemonsDataLoading = false;
    });
    builder.addCase(fetchAllPokemons.pending, (state, action) => {
      state.fetchAllPokemonsError = null;
      state.allPokemonsDataLoading = true;
    });
    builder.addCase(fetchAllPokemons.fulfilled, (state, action) => {
      state.fetchAllPokemonsError = null;
      state.allPokemonsData = action.payload;
      state.allPokemonsDataLoading = false;
    });
    builder.addCase(fetchAllPokemons.rejected, (state, action) => {
      state.fetchAllPokemonsError = action.payload as string;
      state.allPokemonsDataLoading = false;
    });
    builder.addCase(fetchPokemonByName.pending, (state, action) => {
      state.fetchPokemonsByNameError = null;
      state.selectedPokemonDataLoading = true;
    });
    builder.addCase(fetchPokemonByName.fulfilled, (state, action) => {
      state.fetchPokemonsByNameError = null;
      state.selectedPokemonData = action.payload;
      state.selectedPokemonDataLoading = false;
    });
    builder.addCase(fetchPokemonByName.rejected, (state, action) => {
      state.fetchPokemonsByNameError = action.payload as string;
      state.selectedPokemonDataLoading = false;
    });
  },
});
export const {setSelectedPokemonName, searchPokemon} = pokemonsSlice.actions;
export {fetchPokemons, fetchPokemonByName, fetchAllPokemons};

export default pokemonsSlice.reducer;
