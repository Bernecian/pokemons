import React from 'react';
import styled from 'styled-components';
import {IPokemonType} from '../common/types';

interface Props {
  data: IPokemonType;
  onClose: () => void;
}

export const PokemonDetails: React.FC<Props> = ({data, onClose}) => {
  const imageUrl = (id: string) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };
  return data ? (
    <Self onClick={onClose}>
      <Info onClick={(e) => e.stopPropagation()}>
        <ImageWrapper>
          <PokemonImage src={imageUrl(data.id)} />
        </ImageWrapper>
        <span>
          <b>Name:</b> {data.name}
        </span>
        <span>
          <b>Weight:</b> {data.weight}
        </span>
        <span>
          <b>Types:</b> {data.types.map((item) => item.type.name).join(', ')}
        </span>
        <span>
          <b>Species:</b> {data.species.name}
        </span>
        <span>
          <b>Stats:</b> {data.stats.map((item) => `${item.stat.name}:${item.base_stat}`).join(', ')}
        </span>
        <span>
          <b>Moves:</b> {data.moves.map((item) => item.move.name).join(', ')}
        </span>
        <button onClick={onClose}>Close</button>
      </Info>
    </Self>
  ) : null;
};

const Self = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
  button {
    padding: 10px;
    margin: 20px 0;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  padding: 10px;
  width: 500px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PokemonImage = styled.img`
  width: 140px;
  border-radius: 3px;
  margin-bottom: 5px;
`;
