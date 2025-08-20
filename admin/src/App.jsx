import { useState } from "react";
import CreateNotes from "./components/CreateNotes";
import ListNotes from "./components/ListNotes";

function App() {
  const [activeTab, setActiveTab] = useState("create");

  // return (
  //   <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
  //     <h1 className="text-3xl font-bold mb-6">DropLater</h1>

  //     <div className="flex gap-4 mb-6">
  //       <button
  //         onClick={() => setActiveTab("create")}
  //         className={`px-4 py-2 rounded-lg ${activeTab === "create" ? "bg-blue-500 text-white" : "bg-gray-200"
  //           }`}
  //       >
  //         Create Note
  //       </button>
  //       <button
  //         onClick={() => setActiveTab("list")}
  //         className={`px-4 py-2 rounded-lg ${activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
  //           }`}
  //       >
  //         List Notes
  //       </button>
  //     </div>

  //     <div className="w-full max-w-lg bg-white shadow-md p-6 rounded-lg">
  //       {activeTab === "create" ? (
  //         <CreateNotes/>
  //       ) : (
  //         <ListNotes />
  //       )}
  //     </div>
  //   </div>
  // );
  return(
    <div className=" h-screen flex flex-col items-center p-10">
      <h1 className="text-blue-600 text-2xl font-bold">Welcome to DropLater</h1>
      <div className="flex justify-center mt-5 gap-2.5">
        <button className={`w-[120px] h-[40px] rounded-xl ${activeTab=="Create" ? "bg-blue-600 text-white":"bg-blue-200"}`}
        onClick={()=>setActiveTab("Create")}>
          Create
        </button>
        <button className={`w-[120px] h-[40px] rounded-xl ${activeTab == "List" ? "bg-blue-600 text-white" : "bg-blue-200"}`}
        onClick={()=>setActiveTab("List")}>
          List
        </button>
      </div>
      <div className="w-full max-w-lg bg-white shadow-md p-6 rounded-lg">
        {
          activeTab=="Create"?<CreateNotes/>:<ListNotes/>
        }
      </div>
    </div>
  )
}

export default App;
