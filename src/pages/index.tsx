import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import useAnalytics from "@/hooks/useAnalytics";

export default function Home() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("page.view", { page: "home" });
  }, []);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col overflow-y-auto">
        <div className="flex h-full min-h-0 flex-col">
          {/* Removed content inside Sidebar */}
        </div>
      </div>
      <Chat toggleComponentVisibility={toggleComponentVisibility} />
    </main>
  );
}
