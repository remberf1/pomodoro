import {  useEffect } from "react";
export function KeyboardMap({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        };
        document.addEventListener("keydown", handleKeydown);
        return () => {
          document.removeEventListener("keydown", handleKeydown);
        };
      }, [setOpen]);
        if (!open) return null;
      console.log(open);
    return(
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 text-black">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 transition hover:cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="overflow-x-auto ">
                <table className="table-auto border-collapse w-full text-left text-sm">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 border-b">Key</th>
                        <th className="px-4 py-2 border-b">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-4 py-2 border-b">Escape</td>
                        <td className="px-4 py-2 border-b">Close Keyboard Shortcuts</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">Spacebar</td>
                        <td className="px-4 py-2 border-b">Toggle Timer</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">R</td>
                        <td className="px-4 py-2 border-b">Reset</td>
                        
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">1</td>
                        <td className="px-4 py-2 border-b">Work session</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">2</td>
                        <td className="px-4 py-2 border-b">Long Break</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">3</td>
                        <td className="px-4 py-2 border-b">Short Break</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b">Tab</td>
                        <td className="px-4 py-2 border-b">Switch between Work session and Long break</td>
                    </tr>
                    </tbody>
                </table>
                </div>
         </div>
         </div>
        </>

    )
}