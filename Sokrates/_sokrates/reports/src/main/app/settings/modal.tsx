type ModalProps = {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => Promise<void>;
};

export default function Modal({ open, setOpenModal, onDelete }: ModalProps) {
  const baseButton = "px-5 py-3 border m-2 rounded-md";
  if (!open) return null;
  return (
    <div>
      <div className="fixed inset-0 h-dvh w-full bg-black/60 backdrop-blur-sm"></div>
      <div className="bg-surface-2 border-border fixed inset-0 mx-auto my-auto flex h-fit w-1/3 flex-col items-center justify-center rounded-lg border py-10">
        <h1 className="p-5 text-4xl">Are you sure you want to delete?</h1>
        <div className="flex justify-end">
          <button
            onClick={() => setOpenModal(false)}
            className={[
              `${baseButton}`,
              "hover:bg-white hover:text-black",
            ].join(" ")}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className={[
              `${baseButton}`,
              "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <p>Delete</p>
              <svg
                className="mr-1 -ml-1 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
