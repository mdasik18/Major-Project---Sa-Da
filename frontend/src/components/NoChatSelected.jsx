import { MessageCircleMore, MessageSquareText, MessagesSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center animate-pulse ring-2 ring-primary/50">
  <MessageCircleMore className="w-9 h-9 text-primary" />
</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to <span className="text-blue-500">Sa</span>
  <span className="text-pink-500">Da</span>!</h2>
        <p className="text-base-content/60">
          Your conversations live here. Select one to get started.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
