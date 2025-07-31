interface Props {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function SessionExpiredModal({ isOpen, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full text-center shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Session Expired
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Your session has expired. Please log in again.
        </p>
        <button
          onClick={onConfirm}
          className="btn btn-primary px-6 py-2 rounded"
          autoFocus
        >
          Login
        </button>
      </div>
    </div>
  );
}
