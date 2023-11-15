import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountProfile,
  updateUserInfo,
} from "../../../slices/accountSlice";

const ProfilePage = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);
  // console.log(account);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    avatar: null,
    profilePictureToChange: null,
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
    const imageUrl = URL.createObjectURL(selectedFile); // Tạo URL từ tệp ảnh

    setUserInfo({
      ...userInfo,
      avatar: imageUrl, // Lưu địa chỉ URL của ảnh
      profilePictureToChange: selectedFile,
    });
  };
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("firstName", userInfo.firstName);
    form.append("lastName", userInfo.lastName);
    form.append("address", userInfo.address);
    form.append("phoneNumber", userInfo.phoneNumber);
    if (userInfo.profilePictureToChange) {
      form.append("avatar", userInfo.profilePictureToChange);
    }
    console.log(userInfo.avatar);
    console.log(userInfo.profilePictureToChange);
    // try {
    //   const res = await dispatch(updateUserInfo(form)).unwrap();
    //   console.log(res);
    //   if (res.data.status === "ok") {
    //     alert("OK");
    //     window.location.reload();
    //   }
    // } catch (err) {
    //   alert(err.message);
    //   // alert("Vui lòng kiểm tra lại các thông tin cho chính xác!");
    // }
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
  return (
    <div>
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Ảnh Cá Nhân</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={
                  userInfo.avatar || account?.data?.avatar || "/noavatar.png"
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
                JPG hoặc PNG không quá 5 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleUploadButtonClick}
              >
                Tải lên ảnh
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Chi tiết tài khoản</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputFirstName">
                      Họ
                    </label>
                    <input
                      className="form-control"
                      id="inputFirstName"
                      type="text"
                      placeholder="Điền họ"
                      defaultValue={account?.data?.firstName}
                      onChange={handleChangeFirstName}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLastName">
                      Tên
                    </label>
                    <input
                      className="form-control"
                      id="inputLastName"
                      type="text"
                      placeholder="Điền tên"
                      defaultValue={account?.data?.lastName}
                      onChange={handleChangeLastName}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  {/* <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputOrgName">
                      Organization name
                    </label>
                    <input
                      className="form-control"
                      id="inputOrgName"
                      type="text"
                      placeholder="Enter your organization name"
                      defaultValue="Start Bootstrap"
                    />
                  </div> */}
                  <div className="">
                    <label className="small mb-1" htmlFor="inputLocation">
                      Địa chỉ
                    </label>
                    <input
                      className="form-control"
                      id="inputLocation"
                      type="text"
                      placeholder="Nhập địa chỉ của bạn"
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
                      Số điện thoại
                    </label>
                    <input
                      className="form-control"
                      id="inputPhone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
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
    </div>
  );
};

export default ProfilePage;
