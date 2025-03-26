const ProfileIcon = ({ url }: { url: string }) => {
  return (
    <div className="relative bg-gray-50 rounded-full w-32 h-32 border-2 border-gray-100 overflow-hidden">
      {url === "" ? (
        <>
          <div className="absolute rounded-full w-12 h-12 bg-gray-500 top-5 left-1/2 -translate-x-1/2"></div>
          <div className="absolute rounded-custom-3xl w-32 h-32 bg-gray-500 top-[4.75rem]"></div>
        </>
      ) : (
        <img src={url} alt="프로필" />
      )}
    </div>
  );
};

export default ProfileIcon;
