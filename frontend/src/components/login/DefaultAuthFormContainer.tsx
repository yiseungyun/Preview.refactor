interface DefaultAuthFormContainerProps {
  handleDefaultLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DefaultAuthFormContainer = ({
  handleDefaultLogin,
}: DefaultAuthFormContainerProps) => {
  return (
    <>
      <div>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="이메일을 입력하세요"
          disabled={true}
        />
      </div>

      <div>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="비밀번호를 입력하세요"
          disabled={true}
        />
      </div>

      <button
        onClick={(e) => handleDefaultLogin(e)}
        className="w-full bg-green-200 text-white py-3 rounded-md hover:bg-green-100 transition-colors font-medium text-lg shadow-16"
      >
        로그인 (추후 지원 예정)
      </button>

      <div className="flex items-center justify-between text-base text-gray-600">
        <button
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          회원가입
        </button>
        <button
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default DefaultAuthFormContainer;
