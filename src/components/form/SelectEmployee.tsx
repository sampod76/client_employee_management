"use client";
import React from "react";

import CustomImageTag from "@components/ui/CustomTag/CustomImage";
import LabelUi from "@components/ui/LabelUi";
import { useGetAllEmployeeQuery } from "@redux/features/admin/employeeApi";
import { FormInstance, Select } from "antd";

export default function SelectEmployee({
  defaultData,
  disable = false,
  setValue,
  dataList,
  isLoading,
  label,
  form,
  fieldName,
}: {
  defaultData?: any;
  disable?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  dataList?: any;
  isLoading?: boolean;
  label?: string;
  //
  fieldName: string;
  form?: FormInstance<any>;
}) {
  const { data: allEmployee, isLoading: employeeLoading } =
    useGetAllEmployeeQuery({ limit: 900 });
  console.log("🚀 ~ allEmployee:", allEmployee);
  //
  console.log(form);
  //! Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const onSearch = (value: string) => {};

  //! console.log(dataList)
  const CategoryOptions = allEmployee?.data?.map((item: any) => {
    return {
      label: (
        <div className="flex items-center gap-2">
          <CustomImageTag
            src={item?.profileImage || ""}
            width={550}
            height={550}
            className="w-8 h-8 md:h-12 md:w-12  rounded-full"
            alt=""
          />
          <h1 className="truncate">
            {item.name.firstName + " " + item.name.lastName} ({item.email})
          </h1>
        </div>
      ),
      value: item?._id,
    };
  });

  const getDefault = () => {
    const de = allEmployee?.data.find(
      (item: { _id: any }) => item._id === defaultData
    );
    return (
      <div className="flex justify-between  items-center border-2 px-2 rounded-lg">
        <CustomImageTag
          src={de?.profileImage || ""}
          width={550}
          height={550}
          className="w-8 h-8 md:h-12 md:w-12  rounded-full mx-2"
          alt=""
        />
        <h1 className="truncate ">
          {de?.name?.firstName + " " + de?.name?.lastName}
        </h1>
      </div>
    );
  };

  return (
    <div className={`${defaultData ? "-mt-7" : ""}`}>
      <div className="flex items-center gap-1">
        <LabelUi>Assign Employee</LabelUi>
        {defaultData && getDefault()}
      </div>
      <Select
        size="large"
        // onChange={handleChange ? handleChange : onChange}
        onChange={(val) => {
          if (setValue) {
            setValue(val);
          }
          if (form) {
            form.setFieldValue(fieldName, val);
          }
        }}
        disabled={disable}
        // defaultActiveFirstOption
        defaultValue={{ label: `Select Employee`, value: "" }}
        options={CategoryOptions}
        style={{ width: "100%" }}
        showSearch
        onSearch={onSearch}
        filterOption={filterOption}
        optionFilterProp="children"
        loading={employeeLoading}
        allowClear
        // placeholder={placeholder}
      />
    </div>
  );
}
