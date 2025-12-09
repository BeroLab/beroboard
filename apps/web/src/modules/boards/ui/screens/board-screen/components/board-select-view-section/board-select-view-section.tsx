export function BoardSelectViewSection() {
   return (
      <div className="mt-3 flex w-full flex-row gap-5 border-dracula-surface/30 border-b">
         <div className="border-b border-b-dracula-pink px-8 py-5">
            <span className="font-medium text-dracula-pink text-md">Kanban </span>
         </div>
         <div className="px-8 py-5">
            <span className="font-medium text-md">List </span>
         </div>
      </div>
   );
}
