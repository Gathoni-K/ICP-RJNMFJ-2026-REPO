
import { Check, X } from 'lucide-react';

interface AddGradeFormProps {
  onAdd: (subject: string, score: number) => void;
  onCancel: () => void;
}

export const AddGradeForm: React.FC<AddGradeFormProps> = ({ onAdd, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject') as string;
    const score = Number(formData.get('score'));

    if (subject && !isNaN(score)) {
      onAdd(subject, score);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-wrap items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-1"
    >
      <div className="flex-1 min-w-[150px]">
        <input
          name="subject"
          required
          placeholder="Subject (e.g. Math)"
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <div className="w-24">
        <input
          name="score"
          type="number"
          required
          min="0"
          max="100"
          placeholder="Score"
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button 
          type="submit" 
          className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Check size={18} />
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="p-1.5 bg-white text-slate-400 rounded-lg border border-slate-200 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </form>
  );
};