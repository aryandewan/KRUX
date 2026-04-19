import { CircleUser} from "lucide-react"

const Navbar = () => {
  return (
    <header className="w-full">
        <nav className="w-full flex items-center justify-between p-5">
            <h1 className="text-4xl font-bold">KRUX</h1>
            <CircleUser size={40}/>
        </nav>
    </header>
  )
}
export default Navbar