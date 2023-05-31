import Empty from '@/components/Empty';
import Table from '@/components/Table';
import { getTokensWallet } from '@/services/profile';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StyledTokenProfile } from './Tokens.styled';
import TransferModal from './TransferModal';
import { IToken } from '@/interfaces/token';
import format from '@/utils/amount';
import convert from '@/utils/convert';
import BigNumber from 'bignumber.js';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import Button from '@/components/Button';
import network from '@/lib/network.helpers';
import Text from '@/components/Text';
import { EMPTY_LINK } from '@/modules/Home/constant';

const LIMIT_PAGE = 50;

const Tokens = () => {
  const user = useCurrentUserInfo();

  const profileWallet = user?.address || '';

  const [isFetching, setIsFetching] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);
  const [tokensList, setTokensList] = useState<IToken[]>([]);

  const TABLE_HEADINGS = ['Token Number', 'Name', 'Symbol', 'Balance', 'Max Supply', ''];

  const handleOpenTransferModal = (selectedToken: any) => {
    setSelectedToken(selectedToken);
    setShowTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
    setSelectedToken(null);
  };

  const fetchTokensOwned = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res = await getTokensWallet({ walletAddress: profileWallet, limit: 12, page: page });
      if (isFetchMore) {
        setTokensList((prev: any) => [...prev, ...res]);
      } else {
        setTokensList(res);
      }
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setIsFetching(false);
    }
  };

  const tokenDatas = tokensList.map(token => {
    const balance = format.formatAmount({
      originalAmount: new BigNumber(token.balance || 0).toNumber(),
      decimals: token.decimal,
      clipAmount: false,
      maxDigits: 9,
    });

    const totalSupply = format.formatAmount({
      originalAmount: new BigNumber(token.totalSupply || 0).toNumber(),
      decimals: token.decimal,
      clipAmount: false,
      maxDigits: 9,
    });

    const linkTokenExplorer = `${network.current.Explorer}/token/${token?.address}`;

    const balanceNumb = convert.toNumber({ text: balance || '0', autoCorrect: true });

    return {
      id: `token-${token?.address}}`,
      render: {
        number: (
          <Text color="text-primary" size="body-large">
            {token?.index}
          </Text>
        ),
        name: (
          <Text color="text-primary" size="body-large" fontWeight="medium">
            <a href={linkTokenExplorer} className="token-name" rel="rel=”noopener noreferrer”" target="_blank">
              {token?.name || '-'}
            </a>
          </Text>
        ),

        symbol: (
          <Text color="text-primary" size="body-large">
            {token?.symbol || '-'}
          </Text>
        ),
        balance: (
          <Text color="text-primary" size="body-large">
            {balance}
          </Text>
        ),
        supply: (
          <Text color="text-primary" size="body-large">
            {Number(totalSupply) > 0 ? totalSupply : '-'}
          </Text>
        ),
        action: (
          <>
            {balanceNumb > 0 && (
              <div className="owner-actions">
                <Button onClick={() => handleOpenTransferModal(token)} variants="outline" className="transfer-button">
                  Transfer
                </Button>
              </div>
            )}
          </>
        ),
      },
    };
  });

  const onLoadMoreTokens = () => {
    if (isFetching || tokensList.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(tokensList.length / LIMIT_PAGE) + 1;
    fetchTokensOwned(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  useEffect(() => {
    if (profileWallet) fetchTokensOwned();
    let interval = setInterval(() => {
      if (profileWallet) fetchTokensOwned();
    }, 30000); // 30s
    return () => {
      clearInterval(interval);
    };
  }, [profileWallet]);

  if (!tokensList || tokensList.length === 0 || !profileWallet) {
    return <Empty infoText={EMPTY_LINK.TOKENS.label} link={EMPTY_LINK.TOKENS.link} />;
  }

  return (
    <StyledTokenProfile>
      {isFetching ? (
        <div className="loading">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <InfiniteScroll
          className="transactions"
          dataLength={tokensList?.length || 0}
          hasMore={true}
          loader={
            isFetching && (
              <div className="loading">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
          next={debounceLoadMore}
        >
          <Table tableHead={TABLE_HEADINGS} data={tokenDatas} className={'token-table'} />
        </InfiniteScroll>
      )}
      {!!selectedToken && showTransferModal && (
        <TransferModal
          show={showTransferModal}
          handleClose={handleCloseTransferModal}
          erc20TokenAddress={selectedToken.address}
          decimals={selectedToken.decimal}
          balance={selectedToken.balance}
        />
      )}
    </StyledTokenProfile>
  );
};

export default Tokens;
