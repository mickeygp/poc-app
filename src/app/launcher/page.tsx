import RequireAuth from "@/components/RequireAuth";
import Launcher from "@/screens/Launcher";

export default function Page() {
  return (
    <RequireAuth>
      <Launcher />
    </RequireAuth>
  );
}
