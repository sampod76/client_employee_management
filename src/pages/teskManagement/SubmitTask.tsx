import LoadingSkeleton from "@components/ui/Loading/LoadingSkeleton";
import {
  useGetSingleTaskManagementQuery,
  useUpdateSubmitTaskManagementMutation,
} from "@redux/features/admin/taskManagementApi";
import { ErrorModal, SuccessModal } from "@utils/modalHook";
import type { TransferProps } from "antd";
import { Button, Select, Transfer } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SubmitTask() {
  const [submitTaskManage, { isLoading: sloading }] =
    useUpdateSubmitTaskManagementMutation();
  const [taskProgressStatus, setTaskProgressStatus] = useState<any>();

  interface RecordType {
    key: string;
    title: string;
    description: string;
    chosen: boolean;
  }

  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskManagementQuery(id);

  const TaskDetails = data?.data || {};
  console.log("🚀 ~ SubmitTask ~ TaskDetails:", TaskDetails);

  const [oneWay, setOneWay] = useState(false);
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);
  const [transferredTitles, setTransferredTitles] = useState<any[]>([]);

  useEffect(() => {
    if (TaskDetails?._id && !isLoading) {
      const newMockData: RecordType[] = TaskDetails?.taskList?.map(
        (
          task: { uuid: string; title: string; isCompleted: boolean },
          index: number
        ) => ({
          key: task.uuid,
          title: task.title,
          description: `description of ${task.title}`,
          chosen: task.isCompleted,
        })
      );
      const newTargetKeys: string[] = newMockData
        ?.filter((task) => task.chosen === true)
        .map((task) => task.key);
      console.log(newTargetKeys);
      setTargetKeys(newTargetKeys);
      setMockData(newMockData);
    }
  }, [isLoading, TaskDetails]);
  const handleProgressChange = (value: React.SetStateAction<string>) => {
    setTaskProgressStatus(value);
  };
  const onChange: TransferProps["onChange"] = (
    newTargetKeys,
    direction,
    moveKeys
  ) => {
    setTargetKeys(newTargetKeys);

    const transferredTaskTitles = mockData
      .filter((task) => newTargetKeys.includes(task.key))
      .map((task) => ({
        title: task.title,
        uuid: task.key,
      }));

    setTransferredTitles(transferredTaskTitles);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  console.log(transferredTitles);
  const onSubmit = async () => {
    try {
      const value: any = {};
      if (taskProgressStatus) {
        value.taskProgressStatus = taskProgressStatus;
      }
      if (TaskDetails?.taskList.length === transferredTitles.length) {
        value.taskProgressStatus = "done";
      }
      value.completedTaskList = transferredTitles;
      const res = await submitTaskManage({ id, data: value }).unwrap();
      console.log("🚀 ~ onSubmit ~ res:", res);
      SuccessModal("Successfully submitted");
    } catch (error) {
      ErrorModal(error);
    }
  };
  return (
    <>
      <div className="w-full bg-gray-50  shadow-2xl p-5 shadow-purple-300 rounded-2xl">
        <h2 className="text-lg font-bold">Title: {TaskDetails?.title}</h2>
        <p>description: {TaskDetails?.description}</p>
        <div className="flex justify-center items-center">
          <div className="p-8 space-y-4">
            <Transfer
              className="!w-full"
              dataSource={mockData}
              targetKeys={targetKeys}
              onChange={onChange}
              render={(item) => (
                <div style={{ whiteSpace: "normal" }}>{item.title}</div>
              )}
              oneWay={oneWay}
              pagination
            />
            <br />
            <div>
              <Select
                style={{ width: 120 }}
                onChange={handleProgressChange}
                defaultValue={TaskDetails?.taskProgressStatus}
                options={[
                  { value: "toDo", label: "To Do", disabled: true },
                  { value: "inProgress", label: "In Progress" },
                  //   { value: "done", label: "Done", disabled: true },
                ]}
              />
              <Button
                onClick={() => onSubmit()}
                className="bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </Button>
            </div>
            {/* <div>
            <h3>Transferred Task Titles:</h3>
            <ul>
              {transferredTitles.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SubmitTask;