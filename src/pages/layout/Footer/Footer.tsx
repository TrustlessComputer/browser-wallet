import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${px2rem(140)};
  flex-wrap: wrap;
  gap: ${px2rem(32)};
`;

const Footer = ({ height }: { height: number }) => {
  return <Wrapper style={{ height }} />;
};

export default Footer;
