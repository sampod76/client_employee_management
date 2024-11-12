import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto h-screen p-10 shadow-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <Link to={'/screen-recorder'}>
          {' '}
          <Button>Screen Recorder</Button>
        </Link>
        <Link to={'/face-unlock'}>
          {' '}
          <Button>Face unlock</Button>
        </Link>
      </div>
    </div>
  );
}
