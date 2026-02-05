import { useState } from "react";
import cn from "classnames";

interface Props {
  closeModal: () => void;
}

const WrongInfoModal = ({ closeModal }: Props) => {
  const [selectRadio, setSelectRadio] = useState<"end" | "wrong" | null>(null);
  const [wrongInputText, setWrongInputText] = useState<string>("");

  return (
    <div className="absolute bg-[#00000099] w-screen h-screen top-0 flex items-center justify-center px-[9.17%]">
      <div className="w-full px-6 text-center bg-white py-7 rounded-xl">
        <h1 className="text-lg font-semibold">잘못된 정보인가요?</h1>

        <ul className="mt-6 mb-5">
          <li className="mb-5">
            <button
              className="flex items-center gap-x-[10px] w-full"
              onClick={() => {
                if (selectRadio === "end") setSelectRadio(null);
                else setSelectRadio("end");
              }}
            >
              <div
                className={cn(
                  "border-2 border-gray-ebe rounded-full size-[22px] flex items-center justify-center",
                  {
                    "border-purple": selectRadio === "end",
                  },
                )}
              >
                {selectRadio === "end" && (
                  <div className="size-[12px] bg-purple rounded-full" />
                )}
              </div>
              <p className="text-gray-77 text-[15px]">이미 끝난 이슈에요</p>
            </button>
          </li>
          <li className="mb-5">
            <button
              className="flex items-center gap-x-[10px] w-full"
              onClick={() => {
                if (selectRadio === "wrong") setSelectRadio(null);
                else setSelectRadio("wrong");
              }}
            >
              <div
                className={cn(
                  "border-2 border-gray-ebe rounded-full size-[22px] flex items-center justify-center",
                  {
                    "border-purple": selectRadio === "wrong",
                  },
                )}
              >
                {selectRadio === "wrong" && (
                  <div className="size-[12px] bg-purple rounded-full" />
                )}
              </div>
              <p className="text-gray-77 text-[15px]">잘못된 정보에요</p>
            </button>
          </li>
          {selectRadio === "wrong" && (
            <li className="pb-1.5 border-b border-gray-ebe">
              <textarea
                className="w-full placeholder-gray-ebe text-gray-77 text-sm tracking-[0.2px] focus:outline-none resize-none"
                rows={1}
                value={wrongInputText}
                onChange={(event) =>
                  setWrongInputText(event.currentTarget.value)
                }
                placeholder="무엇이 잘못되었나요?"
              />
            </li>
          )}
        </ul>

        <div className="flex gap-x-2">
          <button
            className="border py-3 border-gray-999 rounded-[5px] flex-1"
            onClick={closeModal}
          >
            <p className="text-sm font-semibold text-gray-999">취소</p>
          </button>
          <button className="border py-3 border-gray-999 rounded-[5px] flex-1 bg-black">
            <p className="text-sm font-semibold text-white">확인</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrongInfoModal;
