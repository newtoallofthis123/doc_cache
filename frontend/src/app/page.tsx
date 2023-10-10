import useAuth from "@/hooks/use-auth";
import Dashboard from "@/views/dashboard.";
import Landing from "@/views/landing";

export default async function Home() {
  const auth = await useAuth()
  return <div>
    {
      auth? <Dashboard/> : <Landing/>
    }
  </div>
}
