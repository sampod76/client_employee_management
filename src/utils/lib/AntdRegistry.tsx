import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import React, { useMemo } from 'react';

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cache = useMemo(() => createCache(), []);

  // Injecting the CSS into the document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.id = 'antd';
    style.innerHTML = extractStyle(cache, true);
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [cache]);

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
