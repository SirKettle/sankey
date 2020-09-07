import styled from 'styled-components';

export const Copy = styled.span`
  font-size: 15px;
  line-height: 1.5;
  font-family: monospace;
  color: ${props => props.color || 'inherit'};
`;

export const Headline = styled(Copy.withComponent('h2'))`
  font-size: 70px;
  margin: 20px 0;
`;

export const Heading = styled(Copy.withComponent('h3'))`
  font-size: 40px;
  margin: 20px 0;
`;

export const Quote = styled(Copy.withComponent('q'))`
  font-size: 25px;
  margin: 20px 0;
`;

export const Paragraph = styled(Copy.withComponent('p'))`
  margin: 20px 0;
`;

export const SmallPrint = styled(Copy.withComponent('p'))`
  font-size: 12px;
  margin: 20px 0;
`;
