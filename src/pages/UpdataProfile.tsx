import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import CustomImageTag from '@components/ui/CustomTag/CustomImage';
import LoadingSkeleton from '@components/ui/Loading/LoadingSkeleton';
import UploadImage from '@components/ui/UploadImage';
import { useUpdateadminMutation } from '@redux/features/admin/adminApi';
import { useUpdateEmployeeMutation } from '@redux/features/admin/employeeApi';
import { useGetProfileQuery } from '@redux/features/auth/authApi';
import { selectCurrentUser } from '@redux/features/auth/authSlice';
import { useAppSelector } from '@redux/hooks';
import { ErrorModal, SuccessModal } from '@utils/modalHook';
import { Button, DatePicker, Form, Input, Row, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const ProfileUpdate = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: getProfile, isLoading } = useGetProfileQuery({});
  const [fileList, setFileList] = useState([]);

  const [image, setImageState] = useState([]);
  console.log('🚀 ~ ProfileUpdate ~ image:', image);
  const [imageLoading, setImageLoading] = useState(false);
  const [updateEmployee, { isLoading: tempLoading }] =
    useUpdateEmployeeMutation();
  const [updateAdmin, { isLoading: adminLoading }] = useUpdateadminMutation();

  const onFinish = async (data: any) => {
    console.log('🚀 ~ onFinish ~ data:', data);
    try {
      if (image.length) {
        data.profileImage = {
          url: image,
          mimetype: 'image/jpg',
          filename: crypto.randomUUID() + 'profileImage.jpg',
          path: 'upload/images/logo.jpg',
          platform: 'imgbb',
        };
      }

      if (user?.role === 'admin') {
        await updateAdmin({
          id: getProfile?.roleInfo._id,
          data: data,
        }).unwrap();
      } else {
        await updateEmployee({
          id: getProfile?.roleInfo._id,
          data: data,
        }).unwrap();
      }
      SuccessModal('Profile updated successfully');
    } catch (err) {
      ErrorModal(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList.slice(0, 1)); // Limit upload image to 1 image
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Profile</div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  console.log(getProfile);
  const initial = getProfile?.roleInfo
    ? {
        'name.firstName': getProfile?.roleInfo?.name?.firstName,
        'name.lastName': getProfile?.roleInfo?.name?.lastName,
        email: getProfile?.roleInfo?.email,
        contactNumber: getProfile?.roleInfo?.contactNumber,
        dateOfBirth: dayjs(getProfile?.roleInfo.dateOfBirth, 'YYYY-MM-DD'),
        nid: getProfile?.roleInfo?.nid,
        passport: getProfile?.roleInfo?.passport,
      }
    : {};
  console.log(initial, 'dd');
  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <div className="min-w-96 border p-5">
        <Form onFinish={onFinish} layout="vertical" initialValues={initial}>
          <h1 className="my-1 text-center text-2xl">Update Profile</h1>
          <hr />

          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-full my-1 flex justify-center gap-1">
              {
                <CustomImageTag
                  src={getProfile?.roleInfo?.profileImage}
                  width={500}
                  height={500}
                  className="w-24"
                />
              }
              <UploadImage
                setImageState={setImageState}
                setImageLoading={setImageLoading}
                name="image"
              />
            </div>
            {imageLoading && (
              <Skeleton.Input active={true} size={'small'} block={true} />
            )}

            <Form.Item name="name.firstName" label="First Name">
              <Input />
            </Form.Item>

            <Form.Item name="name.lastName" label="Last Name">
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>

            <Form.Item name="contactNumber" label="Contact Number">
              <Input />
            </Form.Item>

            <Form.Item name="dateOfBirth" label="Date of Birth">
              <DatePicker />
            </Form.Item>

            <Form.Item name="nid" label="NID">
              <Input />
            </Form.Item>

            <Form.Item name="passport" label="Passport">
              <Input />
            </Form.Item>
          </div>

          <Button
            htmlType="submit"
            loading={tempLoading || adminLoading}
            className="w-full"
          >
            Update
          </Button>
        </Form>
      </div>
    </Row>
  );
};

export default ProfileUpdate;
