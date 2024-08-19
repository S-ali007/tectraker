
import MyActivites from "@/assets/icons/MyActivites";


function page() {

  return (
    <div className="max-w-[1440px] w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040] ">
        My Activities
      </h1>
      <div className="w-full flex flex-col items-center justify-center h-[75vh]">
        <MyActivites />

        <div className="max-w-[448px] w-full text-center">
          <p className="mt-[20px]">
            You have no tracked activity to report yet.
          </p>
        </div>
      </div>

      
    </div>
  );
}

export default page;
