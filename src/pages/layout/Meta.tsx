import { Helmet } from 'react-helmet';

const Meta = () => {
  return (
    <Helmet>
      <title>Trustless Wallet</title>
      <meta property="og:title" content="Trustless Wallet" />
      <meta property="og:description" content="A crypto wallet & gateway to decentralized applications on Bitcoin." />
      <meta property="og:image" content="https://cdn.trustlesswallet.io/wallet-images/trustless-wallet-seo.jpg" />
      <meta property="og:type" content="website" />
      <meta property="twitter:title" content="Trustless Wallet" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content="A crypto wallet & gateway to decentralized applications on Bitcoin." />
      <meta name="twitter:image" content="https://cdn.trustlesswallet.io/wallet-images/trustless-wallet-seo.jpg" />
    </Helmet>
  );
};

export default Meta;
