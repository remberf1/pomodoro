import { useId, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { NumberInput } from "./NumberInput";
import {KeyboardMap} from './Keyboardshortcuts'

type NavbarProps = {
  work: number;
  setWork: React.Dispatch<React.SetStateAction<number>>;
  short: number;
  setShort: React.Dispatch<React.SetStateAction<number>>;
  long: number;
  setLong: React.Dispatch<React.SetStateAction<number>>;
};

export function Navbar({ work, setWork, short, setShort, long, setLong }: NavbarProps) {
  const workId = useId();
  const shortId = useId();
  const longId = useId();
  const [open, setOpen] = useState(false);
  const [openKeyboard, setOpenKeyboard] = useState(false);


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
  }, []);

  const toggle = () => setOpen(!open);
  const toggleKeyboard = () => setOpenKeyboard(!openKeyboard);

  return (
    <>
      <div className="flex flex-row-reverse gap-x-8 p-2 items-center cursor-pointer mb-7">
        <FontAwesomeIcon onClick={toggleKeyboard} icon={ faKeyboard } />
        <FontAwesomeIcon onClick={toggle} icon={faSliders} />
      </div>
      <KeyboardMap open={openKeyboard} setOpen={setOpenKeyboard} />
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 text-black">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 transition hover:cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              <NumberInput
                id={workId}
                label="Work duration (in minutes)"
                value={work}
                onChange={setWork}
              />
              <div className="flex justify-between">
                <NumberInput
                  id={shortId}
                  label="Short Break duration (mins)"
                  value={short}
                  onChange={setShort}
                />
                <NumberInput
                  id={longId}
                  label="Long Break duration (min)"
                  value={long}
                  onChange={setLong}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setWork(25);
                  setShort(5);
                  setLong(15);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Reset
              </button>

              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
