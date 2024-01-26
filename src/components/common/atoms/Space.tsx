import styled from '@emotion/native';

interface SpaceProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
}

const Space = ({ width, height, backgroundColor }: SpaceProps) => {
  return <SpaceComponent width={width} height={height} backgroundColor={backgroundColor} />;
};

export default Space;

const SpaceComponent = styled.View<SpaceProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  backgroundColor: ${({ backgroundColor }) => backgroundColor};
`;
