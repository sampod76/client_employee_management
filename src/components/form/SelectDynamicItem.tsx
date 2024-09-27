import React from 'react';

import LabelUi from '@components/ui/LabelUi';
import { Select } from 'antd';

export default function SelectDynamicItem({
  // defaultData,
  disable = false,
  setValue,
  dataList,
  isLoading,
  label,
  form,
}: {
  defaultData?: any;
  disable?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  dataList: any;
  isLoading: boolean;
  label: string;
  form?: any;
}) {
  //! Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const onSearch = (_value: string) => {};

  //! console.log(dataList)
  const CategoryOptions = dataList?.map((item: any) => {
    return {
      label: item?.title,
      value: item?._id,
    };
  });

  return (
    <div>
      <LabelUi>Select {label}</LabelUi>
      <Select
        size="large"
        // onChange={handleChange ? handleChange : onChange}
        onChange={(val) => {
          if (setValue) {
            setValue(val);
          }
          if (form) {
            form.setFieldValue('employee', val);
          }
        }}
        disabled={disable}
        // defaultActiveFirstOption
        defaultValue={{ label: `Select ${label}`, value: '' }}
        options={CategoryOptions}
        style={{ width: '100%' }}
        showSearch
        onSearch={onSearch}
        filterOption={filterOption}
        optionFilterProp="children"
        loading={isLoading}
        allowClear
        // placeholder={placeholder}
      />
    </div>
  );
}
