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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl shadow-premium/5 my-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 animate-float">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="max-w-xs text-sm text-slate-500 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
