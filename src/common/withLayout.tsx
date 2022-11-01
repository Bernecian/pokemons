import styled from 'styled-components';

function withLayout<T extends JSX.IntrinsicAttributes>(Component: React.FC<T>) {
  function ComponentWithLayoutProp(props: T) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  }

  return ComponentWithLayoutProp;
}

export default withLayout;

const Layout = styled.section`
  height: 100vh;
  widht: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 150px;
`;
