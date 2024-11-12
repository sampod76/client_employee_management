import { Skeleton } from 'antd';
const LoadingSkeleton = ({
  number,
  sectionNumber = 2,
}: {
  number?: number;
  sectionNumber?: number;
}) => (
  <div className="container mx-auto">
    {Array.from(Array(sectionNumber)).map((_, index) => (
      <Skeleton
        avatar
        key={index}
        style={{ marginTop: '1rem' }}
        paragraph={{
          rows: number || 4,
        }}
      />
    ))}
  </div>
);
export default LoadingSkeleton;
