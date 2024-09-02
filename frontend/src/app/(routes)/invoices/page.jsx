import Invoices from "@/assets/icons/Invoices";
import React from "react";

function page() {
  return  <div className=" w-full px-[50px] py-[32px]">
  <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040] ">Invoices</h1>
  <div className="w-full flex flex-col items-center justify-center h-[75vh]">
    <Invoices />

    <div className="max-w-[448px] w-full text-center">
      <p className="mt-[20px]">
        You have no tracked activity to report yet.
      </p>
    </div>
  </div>
</div>
}

export default page;
