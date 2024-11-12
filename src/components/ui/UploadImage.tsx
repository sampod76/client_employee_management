import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image as AntImage, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

import { ErrorModal } from '../../utils/modalHook';
import uploadImgBB from '../../utils/UploadSIngleImgBB';
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';
  if (!isJpgOrPng) {
    ErrorModal('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    ErrorModal('Image must smaller than 5MB!');
  }
  return isJpgOrPng && isLt2M;
};

type ImageUploadProps = {
  name: string;
  defaultImage?: string;
  customChange?: any;
  isReset?: boolean;
  setState?: any;
  setImageState?: any;
  setImageLoading?: any;
};

const UploadImage = ({
  name,
  defaultImage,
  customChange,
  isReset = false,
  setState,
  setImageState,
  setImageLoading,
}: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      if (setImageLoading) {
        setImageLoading(true);
      }
      const imgUrl = await uploadImgBB(info.file.originFileObj);
      if (setState) {
        setState((c: any) => ({ ...c, imageLoading: true }));
      }
      if (setImageLoading) {
        setImageLoading(false);
      }
      setImageState(imgUrl);
      console.log('🚀 ~ imgUrl:', imgUrl);
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        if (setState) {
          setState((c: any) => ({ ...c, imageLoading: false }));
        }
        setImageUrl(url);
      });
      return;
    }
    // if (info.file.status === "done") {
    //   // Get this url from response in real world.
    //   console.log(info.file.originFileObj);
    //   console.log("🚀 ~ file: UploadImage.tsx:53 ~ imgUrl:", imgUrl);

    //   getBase64(info.file.originFileObj as RcFile, (url) => {
    //     setLoading(false);
    //     if (setState) {
    //       setState((c: any) => ({ ...c, imageLoading: false }));
    //     }
    //     setImageUrl(url);
    //   });
    // }
  };

  useEffect(() => {
    if (isReset) {
      setImageUrl('');
    }
  }, [isReset]);

  const uploadButton = (
    <div className="">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="flex items-center justify-start gap-2">
      {imageUrl || defaultImage ? (
        <AntImage
          src={imageUrl ? imageUrl : (defaultImage as string)}
          alt="avatar"
          style={{ width: '150px' }}
          width={200}

          // fill
        />
      ) : null}
      <Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // action="/api/file"
        beforeUpload={customChange ? customChange : beforeUpload}
        onChange={handleChange}
      >
        {uploadButton}
      </Upload>
    </div>
  );
};

export default UploadImage;
