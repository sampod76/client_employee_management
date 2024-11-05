import CustomImageTag from '@components/ui/CustomTag/CustomImage';
import LoadingSkeleton from '@components/ui/Loading/LoadingSkeleton';
import { useGetSingleTaskManagementQuery } from '@redux/features/admin/taskManagementApi';
import { Tag } from 'antd';
import { useParams } from 'react-router-dom';

function ViewTask() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskManagementQuery(id);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const TaskDetails = data?.data || {};
  console.log('🚀 ~ TaskDetailsLandingPage ~ TaskDetails:', TaskDetails);
  const progress = (status: string) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'toDo':
        color = 'orange';
        text = 'ToDo';
        break;
      case 'inProgress':
        color = 'blue';
        text = 'In Progress';
        break;
      case 'done':
        color = 'green';
        text = 'Done';
        break;
      default:
        color = 'gray';
        text = 'Unknown';
    }

    return <Tag color={color}>{text}</Tag>;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800">
          Task Overview
        </h1>

        <div className="gap-8">
          <div
            key={TaskDetails._id}
            className="overflow-hidden rounded-lg bg-white shadow-lg"
          >
            <div className="p-6">
              {/* TaskDetails Logo */}

              {/* TaskDetails Title */}
              <h2 className="text-center text-xl font-semibold text-gray-800">
                Title: {TaskDetails.title}
              </h2>

              {/* TaskDetails Author */}
              <div className="flex items-center justify-start gap-3">
                <div className="w-fit rounded-xl p-2 shadow-xl">
                  <CustomImageTag
                    src={TaskDetails?.author?.details?.profileImage}
                    width={150}
                    height={150}
                    className="max-w-28 rounded-xl"
                  />
                  <p className=" ">
                    Author:{' '}
                    {TaskDetails?.author?.details?.name?.firstName +
                      ' ' +
                      TaskDetails?.author?.details?.name?.lastName}
                  </p>
                </div>
                <div className="w-fit rounded-xl p-2 shadow-xl">
                  <CustomImageTag
                    src={TaskDetails?.author?.details?.profileImage}
                    width={150}
                    height={150}
                    className="max-w-28 rounded-xl"
                  />
                  <p className="mb-4">
                    Assign by: {TaskDetails?.employee?.details?.name?.lastName}
                  </p>
                </div>
              </div>

              {/* Feature List */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-700">Task list:</h3>
                <ul className="list-inside list-disc text-gray-600">
                  {TaskDetails.taskList.map((feature: any, index: number) => (
                    <li key={index}>{feature?.title}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-700">
                  Completed list:
                </h3>
                <ul className="list-inside list-disc text-gray-600">
                  {TaskDetails.completedTaskList.map(
                    (feature: any, index: number) => (
                      <li key={index}>{feature?.title}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Start and End Date */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-700">Dates:</h3>
                <p className="text-gray-600">
                  Start Date:{' '}
                  {new Date(TaskDetails.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  End Date: {new Date(TaskDetails.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-700">Description:</h3>
                <p className="text-gray-600">{TaskDetails.description}</p>
              </div>

              {/* Status */}
              <div className="text-center">
                <span>{progress(TaskDetails.taskProgressStatus)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTask;
