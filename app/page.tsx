import ThemeToogle from "@/components/shared/theme-toogle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex justify-end">
      <ThemeToogle />
      </div>
      <h1 className="text-blue-500 font-barlow">Welcome to the ecommerce</h1>
      <Button variant="destructive">Click here</Button>
    </div>
  );
}
