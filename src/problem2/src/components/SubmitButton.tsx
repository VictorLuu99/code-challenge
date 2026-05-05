interface Props {
  loading: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
}

export function SubmitButton({ loading, disabled, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-500 transition py-4 font-semibold text-white text-base"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Confirming...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
