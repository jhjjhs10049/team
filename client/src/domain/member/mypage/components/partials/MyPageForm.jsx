import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMyPage,
  updateMyPage,
  withdrawMember,
  verifyPassword,
} from "../../../api/memberApi";
import { logout } from "../../../login/slices/loginSlice";
import UpdateResultModal from "./UpdateResultModal";
import MyPageInfo from "./MyPageInfo";
import MyPageEdit from "./MyPageEdit";
import WithdrawModal from "./WithdrawModal";
import PasswordVerificationModal from "./PasswordVerificationModal";

const MyPageForm = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState({
    memberNo: "",
    email: "",
    nickname: "",
    phone: "",
    postalCode: "",
    roadAddress: "",
    detailAddress: "",
    joinedDate: "",
  });
  const [editData, setEditData] = useState({
    email: "",
    pw: "",
    pwConfirm: "",
    nickname: "",
    phone: "",
    postalCode: "",
    roadAddress: "",
    detailAddress: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateResult, setUpdateResult] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: true,
  });
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    available: false,
    message: "",
  });

  // 페이지 로드 시 회원 정보 조회
  const fetchMemberData = useCallback(async () => {
    try {
      const data = await getMyPage(loginState.email);
      setMemberData(data);
      setEditData({
        email: data.email,
        pw: "",
        pwConfirm: "",
        nickname: data.nickname,
        phone: data.phone || "",
        postalCode: data.postalCode || "",
        roadAddress: data.roadAddress || "",
        detailAddress: data.detailAddress || "",
      });
    } catch (error) {
      console.error("회원 정보 조회 오류:", error);
      alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
    }
  }, [loginState.email]);

  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      if (loginState.email) {
        await fetchMemberData();
        setIsLoading(false);
      } else {
        // 로그인되지 않은 경우 alert 후 로그인 페이지로 이동
        setIsLoading(false);
        alert("마이페이지를 이용하려면 로그인해주세요.");
        navigate("/member/login");
      }
    };

    checkLoginAndFetchData();
  }, [loginState.email, fetchMemberData, navigate]);
  const handleEditModeToggle = () => {
    if (isEditing) {
      // 편집 취소 시 원래 데이터로 복원
      setEditData({
        email: memberData.email,
        pw: "",
        pwConfirm: "",
        nickname: memberData.nickname,
        phone: memberData.phone || "",
        postalCode: memberData.postalCode || "",
        roadAddress: memberData.roadAddress || "",
        detailAddress: memberData.detailAddress || "",
      });
      setNicknameCheck({
        checked: false,
        available: false,
        message: "",
      });
      setIsEditing(false);
    } else {
      // 소셜 로그인 사용자는 바로 편집 모드로
      if (memberData.social) {
        setIsEditing(true);
      } else {
        // 일반 사용자는 비밀번호 확인 모달 표시
        setIsPasswordModalOpen(true);
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });

    // 닉네임이 변경되면 중복확인 상태 리셋
    if (e.target.name === "nickname") {
      setNicknameCheck({
        checked: false,
        available: false,
        message: "",
      });
    }
  };
  const handleSave = async () => {
    try {
      // 소셜 로그인 사용자가 아닌 경우에만 비밀번호 검증
      if (!memberData.social) {
        // 비밀번호 확인만 입력한 경우
        if (!editData.pw && editData.pwConfirm) {
          alert("비밀번호를 입력해주세요.");
          return;
        }

        // 비밀번호를 입력한 경우
        if (editData.pw) {
          if (editData.pw.length < 6) {
            alert("비밀번호는 6자리 이상 입력해주세요.");
            return;
          }
          if (!editData.pwConfirm) {
            alert("비밀번호 확인을 입력해주세요.");
            return;
          }
          if (editData.pw !== editData.pwConfirm) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
          }
        }
      }

      // 닉네임이 변경되었다면 중복확인 체크
      if (editData.nickname !== memberData.nickname) {
        if (!nicknameCheck.checked) {
          alert("닉네임 중복확인을 해주세요.");
          return;
        }
        if (!nicknameCheck.available) {
          alert("사용할 수 없는 닉네임입니다. 다른 닉네임을 선택해주세요.");
          return;
        }
      }
      // 서버에 전송할 데이터 준비 (빈 값이 아닌 것만)
      const updateData = {
        email: editData.email,
      };

      // 소셜 로그인 사용자가 아닌 경우에만 비밀번호 포함
      if (!memberData.social && editData.pw) {
        updateData.pw = editData.pw;
      }
      if (editData.nickname !== memberData.nickname) {
        updateData.nickname = editData.nickname;
      }
      if (editData.phone !== memberData.phone) {
        updateData.phone = editData.phone;
      }
      if (editData.postalCode !== memberData.postalCode) {
        updateData.postalCode = editData.postalCode;
      }
      if (editData.roadAddress !== memberData.roadAddress) {
        updateData.roadAddress = editData.roadAddress;
      }
      if (editData.detailAddress !== memberData.detailAddress) {
        updateData.detailAddress = editData.detailAddress;
      }
      await updateMyPage(updateData);
      setUpdateResult({
        isOpen: true,
        title: "정보 수정 완료",
        message: "회원 정보가 성공적으로 수정되었습니다!",
        isSuccess: true,
      });
      setIsEditing(false);

      // 최신 정보 다시 조회
      await fetchMemberData();
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      let errorMessage = "회원 정보 수정 중 오류가 발생했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setUpdateResult({
        isOpen: true,
        title: "정보 수정 실패",
        message: errorMessage,
        isSuccess: false,
      });
    }
  };
  const closeUpdateModal = () => {
    setUpdateResult({
      isOpen: false,
      title: "",
      message: "",
      isSuccess: true,
    });
  };

  // 비밀번호 확인 모달 닫기
  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
  };

  // 비밀번호 확인 처리
  const handlePasswordVerify = async (password) => {
    try {
      const response = await verifyPassword(loginState.email, password);

      if (response.valid) {
        // 비밀번호가 맞으면 편집 모드로 전환
        setIsPasswordModalOpen(false);
        setIsEditing(true);
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 오류:", error);
      if (error.response?.data?.message) {
        alert(`비밀번호 확인 오류: ${error.response.data.message}`);
      } else {
        alert("비밀번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  // 회원탈퇴 모달 열기
  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  // 회원탈퇴 모달 닫기
  const handleWithdrawModalClose = () => {
    setIsWithdrawModalOpen(false);
  };
  // 회원탈퇴 실행
  const handleWithdrawConfirm = async () => {
    try {
      // 소셜 로그인 사용자 체크
      if (memberData.social) {
        alert("소셜 로그인 회원은 회원탈퇴를 할 수 없습니다.");
        return;
      }

      await withdrawMember(loginState.email);
      alert("회원탈퇴가 완료되었습니다.");

      // 로그아웃 처리
      dispatch(logout());

      // 로그인 페이지로 이동
      navigate("/member/login");
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      if (error.response?.data?.message) {
        alert(`탈퇴 오류: ${error.response.data.message}`);
      } else {
        alert("회원탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  // 로딩 중이거나 로그인 상태가 확인되지 않은 경우
  if (isLoading || loginState.email === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 로그인되지 않은 경우 빈 화면 (useEffect에서 처리)
  if (!loginState.email) {
    return null;
  }
  return (
    <div className="border-2 border-sky-200 mt-4 mb-8 p-4 rounded-lg shadow-lg bg-white max-w-[1200px] mx-auto">
      <UpdateResultModal
        isOpen={updateResult.isOpen}
        title={updateResult.title}
        message={updateResult.message}
        isSuccess={updateResult.isSuccess}
        onClose={closeUpdateModal}
      />
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          마이페이지
        </div>
      </div>{" "}
      {isEditing ? (
        <MyPageEdit
          editData={editData}
          memberData={memberData}
          nicknameCheck={nicknameCheck}
          setNicknameCheck={setNicknameCheck}
          onChange={handleChange}
          setEditData={setEditData}
          onSave={handleSave}
          onCancel={handleEditModeToggle}
        />
      ) : (
        <MyPageInfo
          memberData={memberData}
          onEditClick={handleEditModeToggle}
          onWithdrawClick={handleWithdrawClick}
        />
      )}
      {/* 비밀번호 확인 모달 */}
      <PasswordVerificationModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        onVerify={handlePasswordVerify}
        memberEmail={memberData.email}
      />
      {/* 회원탈퇴 모달 */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={handleWithdrawModalClose}
        onConfirm={handleWithdrawConfirm}
        memberEmail={memberData.email}
      />
    </div>
  );
};

export default MyPageForm;
