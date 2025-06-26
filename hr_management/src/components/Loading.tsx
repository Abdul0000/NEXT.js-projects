import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[80%] w-full p-10">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <LoaderIcon className="animate-spin h-8 w-8 text-gray-500" />
        <p className="font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
