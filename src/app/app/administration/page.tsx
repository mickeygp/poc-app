import RequireAuth from "@/components/RequireAuth";
import Administration from "@/screens/Administration";

export default function Page() {
  return (
    <RequireAuth>
      <Administration />
    </RequireAuth>
  );
}
