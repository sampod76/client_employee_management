/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Row, Skeleton, Upload } from 'antd';
import { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PHForm from '../components/form/PHForm';
import PHInput from '../components/form/PHInput';
import {
  useAddUsersMutation,
  useCreateTempUserMutation,
} from '../redux/features/users/userApi';
import { useAppDispatch } from '../redux/hooks';
import { ErrorModal, SuccessModal } from '../utils/modalHook';

const Register = () => {
  const navigate = useNavigate();
  const [fromData, setFromData] = useState({});
  const [haveOtp, setHavOtp] = useState(false);
  const [otp, setOtp] = useState();
  const [fileList, setFileList] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [isReset, setIsReset] = useState(false);
  const [registration, { isLoading }] = useAddUsersMutation();
  const [tempSignUp, { isLoading: tempLoading }] = useCreateTempUserMutation();
  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    try {
      const tempData = {
        email: data?.email,
        role: 'employee',
      };
      const res1 = await tempSignUp(tempData).unwrap();
      console.log('🚀 ~ onSubmit ~ res1:', res1);

      SuccessModal(
        'Sign up successful',
        'Please check your email for an OTP code'
      );

      const submitDate = {
        authData: {
          email: data.email,
          password: data.password,
          role: 'employee',
          tempUser: {
            tempUserId: res1._id,
            otp: null,
          },
        },
        employee: {
          ...data,
          // name: data.name,
          // contactNumber: data.contactNumber,
        },
      };

      console.log('🚀 ~ onSubmit ~ submitDate:', submitDate);
      setFromData(submitDate);
      setHavOtp(true);
    } catch (err) {
      ErrorModal(err);
    } finally {
      setImageLoading(false);
    }
  };
  const submitFrom = async () => {
    try {
      if (!haveOtp) {
        toast.error('Please enter OTP');
        return;
      }
      const all = { ...fromData } as any;
      all.authData.tempUser.otp = otp;
      const formData = new FormData();
      console.log(fileList, 'fileList');
      if (fileList?.length) {
        // setImageLoading(true);
        // const res = await multipleFilesUploader(
        //   //@ts-ignore
        //   fileList.map((file) => file?.originFileObj)
        // );
        // console.log("🚀 ~ onSubmit ~ res:", res);
        // data.profileImage = res[0];
        // @ts-ignore
        formData.append('profileImage', fileList[0].originFileObj);
      }
      formData.append('data', JSON.stringify(all));
      const res = await registration(formData).unwrap();

      // const user = verifyToken(res.data.accessToken) as TUser;
      // dispatch(setUser({ user: user, token: res.data.accessToken }));
      // toast.success("Logged in", { id: toastId, duration: 2000 });
      SuccessModal('Register successfully please ');

      navigate('/login');
      setIsReset(true);
    } catch (error) {
      ErrorModal(error);
      console.log('🚀 ~ submitFrom ~ error:', error);
    }
  };
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList.slice(0, 1)); // Limit upload image to 3 images
  };
  const uploadButton = (
    <div className="">
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Profile </div>
    </div>
  );
  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <div className="min-w-96 border p-5">
        <PHForm isReset={isReset} onSubmit={onSubmit}>
          <h1 className="my-1 text-center text-2xl">Employee Registration</h1>
          <hr />

          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-full my-1 flex justify-center">
              <Upload
                name="attachFiles"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                listType="picture-card"
                multiple={false}
                maxCount={1}
              >
                {uploadButton}
              </Upload>
            </div>
            {imageLoading && (
              <Skeleton.Input active={true} size={'small'} block={true} />
            )}
            <PHInput
              disabled={haveOtp}
              type="text"
              name="name.firstName"
              label="First Name"
            />
            <PHInput
              disabled={haveOtp}
              type="text"
              name="name.lastName"
              label="Last Name"
            />
            <PHInput
              disabled={haveOtp}
              type="text"
              name="contactNumber"
              label="Contact Number"
            />
            {/* Date of Birth Field */}
            <PHInput
              disabled={haveOtp}
              type="date"
              name="dateOfBirth"
              label="Date of Birth"
            />

            {/* NID Field */}
            <PHInput disabled={haveOtp} type="text" name="nid" label="NID" />

            {/* Passport Field */}
            <PHInput
              disabled={haveOtp}
              type="text"
              name="passport"
              label="Passport"
            />

            <PHInput
              disabled={haveOtp}
              className=""
              type="email"
              name="email"
              label="Email"
            />
            <PHInput
              disabled={haveOtp}
              type="password"
              name="password"
              label="Password"
            />
          </div>

          <Button htmlType="submit" loading={tempLoading} className="w-full">
            Register
          </Button>

          {haveOtp && (
            <div className="my-2 flex flex-col items-center justify-center space-y-3 rounded-lg border p-5">
              <p>Enter otp from email</p>
              <InputNumber
                type="number"
                placeholder="otp"
                className="w-40"
                width={300}
                style={{ width: 200 }}
                //@ts-ignore
                onChange={(value) => setOtp(value)}
              />
              <Button
                onClick={() => submitFrom()}
                style={{ width: 200 }}
                className=""
                loading={isLoading}
              >
                Submit
              </Button>
              <p className="text-red-500">
                note: When successfully submitted opt then wait for admin
                approval
              </p>
            </div>
          )}

          <div className="flex items-center justify-end">
            <Link
              className="my-2 w-fit p-1 text-lg underline underline-offset-1"
              to={'/login'}
            >
              login
            </Link>
          </div>
        </PHForm>
      </div>
    </Row>
  );
};

export default Register;
