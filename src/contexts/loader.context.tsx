import LoadingContainer from '@/components/Loader';
import React, { PropsWithChildren, useMemo } from 'react';

export interface ILoadingPayload {
  isLoading: boolean;
}

export interface ILoaderContext {
  setLoading: ({ isLoading }: ILoadingPayload) => void;
}

const initialValue: ILoaderContext = {
  setLoading: () => undefined,
};

export const LoaderContext = React.createContext<ILoaderContext>(initialValue);

export const LoaderProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const [isLoading, setLoading] = React.useState(false);

  const onSetLoading = (payload: ILoadingPayload) => {
    setLoading(payload.isLoading);
  };

  const contextValues = useMemo((): ILoaderContext => {
    return {
      setLoading: onSetLoading,
    };
  }, [setLoading]);

  return (
    <LoaderContext.Provider value={contextValues}>
      {children}
      <LoadingContainer loaded={!isLoading} />
    </LoaderContext.Provider>
  );
};
