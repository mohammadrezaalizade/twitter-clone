const LoadingSpinner = () => {
  return (
    <>
      <div className="absolute z-50 bg-[#1d1d1d] w-full h-full flex items-center justify-center scrollbar-hide overflow-hidden">
        <div
          style={{
            borderTopColor: "transparent",
          }}
          className="w-16 h-16 border-4 border-blue-100 border-solid rounded-full animate-spin"
        ></div>
      </div>
    </>
  );
};

export default LoadingSpinner;
