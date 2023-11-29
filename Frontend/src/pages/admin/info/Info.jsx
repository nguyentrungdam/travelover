import React, { useEffect, useRef, useState } from "react";
import { axiosMultipart } from "../../../apis/axios";
import { updateUserInfo } from "../../../slices/accountSlice";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const Info = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);
  console.log(account);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    avatar: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (account) {
      setUserInfo({
        ...userInfo,
        firstName: account?.data?.firstName,
        lastName: account?.data?.lastName,
        address: account?.data?.address,
        avatar: account?.data?.avatar,
        email: account?.data?.email,
        phoneNumber: account?.data?.phoneNumber,
      });
    }
  }, [account]);
  const handleSelectImage = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    const formData = new FormData();
    formData.append("file", selectedFile);
    axiosMultipart
      .post("/images/create", formData)
      .then((response) => {
        const imageUrl = response.data.data.url;
        // Cập nhật state của formData với giá trị thumbnailUrl từ API
        setUserInfo((prevFormData) => ({
          ...prevFormData,
          avatar: imageUrl,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setUserInfo((prevFormData) => ({
          ...prevFormData,
          profilePicture: reader.result,
        }));
      } else return;
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  const handleSave = async (e) => {
    e.preventDefault();

    console.log(userInfo);
    try {
      const res = await dispatch(
        updateUserInfo({
          address: userInfo.address,
          phoneNumber: userInfo.phoneNumber,
          avatar: userInfo.avatar,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        })
      ).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      notify(2);
    }
  };
  const handleChangeFirstName = (e) => {
    setUserInfo({ ...userInfo, firstName: e.target.value });
  };
  const handleChangeLastName = (e) => {
    setUserInfo({ ...userInfo, lastName: e.target.value });
  };
  const handleChangeAddress = (e) => {
    setUserInfo({ ...userInfo, address: e.target.value });
  };
  const handleChangePhone = (e) => {
    setUserInfo({ ...userInfo, phoneNumber: e.target.value });
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Cập nhật thành công ! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="vh-100 ">
      <div className="row mx-0">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile picture</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={
                  userInfo.profilePicture ||
                  account?.data?.avatar ||
                  "/noavatar.png"
                }
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                onChange={handleSelectImage}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <div className="small font-italic text-muted mb-4">
                JPG or PNG must not exceed 2 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleUploadButtonClick}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Account Detail</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputFirstName">
                      Frist name
                    </label>
                    <input
                      className="form-control"
                      id="inputFirstName"
                      type="text"
                      placeholder="Frist name"
                      defaultValue={account?.data?.firstName}
                      onChange={handleChangeFirstName}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLastName">
                      Last name
                    </label>
                    <input
                      className="form-control"
                      id="inputLastName"
                      type="text"
                      placeholder="Last name"
                      defaultValue={account?.data?.lastName}
                      onChange={handleChangeLastName}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="">
                    <label className="small mb-1" htmlFor="inputLocation">
                      Address
                    </label>
                    <input
                      className="form-control"
                      id="inputLocation"
                      type="text"
                      placeholder="Address"
                      defaultValue={account?.data?.address}
                      onChange={handleChangeAddress}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputEmailAddress">
                    Email address
                  </label>
                  <input
                    className="form-control"
                    id="inputEmailAddress"
                    type="email"
                    defaultValue={account?.data?.email}
                    disabled
                  />
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputPhone">
                      Phone number
                    </label>
                    <input
                      className="form-control"
                      id="inputPhone"
                      type="tel"
                      placeholder="Phone number"
                      defaultValue={account?.data?.phoneNumber}
                      onChange={handleChangePhone}
                    />
                  </div>
                  {/* <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputBirthday">
                      Birthday
                    </label>
                    <input
                      className="form-control"
                      id="inputBirthday"
                      type="text"
                      name="birthday"
                      placeholder="Enter your birthday"
                      defaultValue="06/10/1988"
                    />
                  </div> */}
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Info;
