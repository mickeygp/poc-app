import RequireAuth from "@/components/RequireAuth";
import ChildApp from "@/screens/ChildApp";

export default function Page() {
  return (
    <RequireAuth>
      <ChildApp />
    </RequireAuth>
  );
}
