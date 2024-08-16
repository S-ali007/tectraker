function YesAndNo({ heading, para, yes, no ,action }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">{heading}</h3>
            <button
              onClick={no}
              className="text-[#fff] w-full max-w-[25px] bg-gray-400 rounded-3xl"
            >
              &times;
            </button>
          </div>
          <p className="mt-4 text-gray-600">{para}</p>
        </div>
        <div className="px-6 py-4 bg-gray-100 flex justify-end">
          <button
            onClick={no}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
          >
            No
          </button>
          <button
            onClick={yes}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Yes, {action} Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default YesAndNo;
