import {useEffect, useState} from 'react';
import {useSearchParams, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import withLayout from '../common/withLayout';
import {
  fetchPokemonByName,
  fetchPokemons,
  setSelectedPokemonName,
  fetchAllPokemons,
  searchPokemon,
} from '../features/pokemons/pokemonsSlice';
import useDebounce from '../hooks/useDebounce';
import {useAppDispatch, useAppSelector} from '../store';
import {PokemonDetails} from './PokemodDetails';

const PokemonsList = () => {
  const limit = '16';
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const [searchParams, setSearchParams] = useSearchParams();
  const pokemonsData = useAppSelector((state) => state.pokemons.pokemonsData);
  const selectedPokemonName = useAppSelector((state) => state.pokemons.selectedPokemonName);
  const selectedPokemonData = useAppSelector((state) => state.pokemons.selectedPokemonData);
  const pageDataLoading = useAppSelector((state) => state.pokemons.pokemonsDataLoading);

  useEffect(() => {
    if (!location.search.length) {
      setSearchParams({
        limit,
        offset: '0',
      });
    }
    dispatch(fetchAllPokemons());
  }, []);

  useEffect(() => {
    if (location.search.length) {
      const offset = searchParams.get('offset');
      if (limit && offset) {
        dispatch(fetchPokemons({limit, offset}));
      }
    }
  }, [location]);

  useEffect(() => {
    if (selectedPokemonName) {
      dispatch(fetchPokemonByName({name: selectedPokemonName}));
    }
  }, [selectedPokemonName]);

  useEffect(() => {
    if (debouncedSearchValue.length >= 3) {
      dispatch(searchPokemon(searchValue));
    }
    if (debouncedSearchValue.length === 0) {
      if (location.search.length) {
        const offset = searchParams.get('offset');
        if (limit && offset) {
          dispatch(fetchPokemons({limit, offset}));
        }
      }
    }
  }, [debouncedSearchValue]);

  const pokemons = pokemonsData?.results;

  const imageUrl = (url: string) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      url.split('/')[url.split('/').length - 2]
    }.png`;
  };
  const handlePrevPage = () => {
    if (pokemonsData) {
      const currentOffset = searchParams.get('offset') || 0;
      const offset = currentOffset > 16 ? Number(currentOffset) - 16 : 0;
      if (offset < pokemonsData?.count) {
        setSearchParams({limit, offset: offset.toString()});
      }
    }
  };
  const handleNextPage = () => {
    if (pokemonsData) {
      const currentOffset = searchParams.get('offset') || 0;
      const offset = Number(currentOffset) + 16;
      if (offset < pokemonsData?.count) {
        setSearchParams({limit, offset: offset.toString()});
      }
    }
  };
  return (
    <Self>
      <Search>
        <span>Search Pokemon</span>
        <input onChange={(e) => setSearchValue(e.target.value)} />
      </Search>
      <Container>
        {pokemons?.map((item) => (
          <PokemonWrapper
            onClick={() => {
              dispatch(setSelectedPokemonName(item.name));
            }}
            key={item.url}
          >
            <PokemonImage src={imageUrl(item.url)} />
            <span>{item.name}</span>
          </PokemonWrapper>
        ))}
      </Container>
      <ButtonsWrapper>
        <button disabled={pageDataLoading} onClick={handlePrevPage}>
          Prev
        </button>
        <button disabled={pageDataLoading} onClick={handleNextPage}>
          Next
        </button>
      </ButtonsWrapper>
      {selectedPokemonName ? (
        <PokemonDetails
          data={selectedPokemonData}
          onClose={() => {
            dispatch(setSelectedPokemonName(null));
          }}
        />
      ) : null}
    </Self>
  );
};

export default withLayout(PokemonsList);

export const Self = styled.section`
  width: 80%;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  gap: 50px;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (min-width: 1080px) {
    grid-template-columns: repeat(8, 1fr);
  }
  min-height: 300px;
`;

const PokemonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
  align-items: center;
  width: 100px;
`;

export const PokemonImage = styled.img`
  border-radius: 3px;
  margin-bottom: 5px;
  @media (min-width: 768px) {
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  button {
    cursor: pointer;
    padding: 10px;
    :first-child {
      margin-right: 5px;
    }
  }
`;

const Search = styled.div`
  display: flex;
  margin-bottom: 30px;
  input {
    margin-left: 10px;
  }
`;
