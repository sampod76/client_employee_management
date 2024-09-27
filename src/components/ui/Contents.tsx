import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';

const { Content } = Layout;

const Contents = ({ children }: { children: React.ReactNode }) => {
  return (
    <Content
      style={{
        minHeight: '100vh',
        color: 'black',
      }}
    >
      <Header />

      <div
        style={{
          padding: '10px',
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default Contents;
