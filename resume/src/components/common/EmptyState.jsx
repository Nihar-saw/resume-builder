import { IoDocumentTextOutline } from "react-icons/io5";
import Button from "./Button";

const EmptyState = ({
  title = "No data found",
  description = "Get started by creating something new.",
  actionLabel,
  onAction,
  icon: Icon = IoDocumentTextOutline,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-3 border-black bg-[#16161a] shadow-[5px_5px_0px_0px_#000] border-dashed my-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0ae448] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] mb-4 animate-float">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-black text-white mb-1 uppercase tracking-wide">{title}</h3>
      <p className="max-w-xs text-xs font-medium text-slate-400 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
