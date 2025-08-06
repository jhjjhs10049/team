import React from "react";

const UpdateResultModal = ({
  isOpen,
  onClose,
  title,
  message,
  isSuccess = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div
            className={`text-2xl font-bold mb-4 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSuccess ? "✅" : "❌"} {title}
          </div>

          <div className="text-gray-700 mb-6">
            <p className="mb-2">{message}</p>
            {isSuccess && (
              <p className="text-sm text-gray-500">
                변경사항이 성공적으로 저장되었습니다.
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-md transition-colors ${
                isSuccess
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateResultModal;
