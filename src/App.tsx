import {createGlobalStyle} from 'styled-components';
import PokemonsList from './components/PokemonsList';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <PokemonsList />
    </>
  );
}

export default App;
