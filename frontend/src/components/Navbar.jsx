import { Link } from "react-router-dom";
import { Search, Plus, Menu, X, LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { logout, authUser, searchUser } = useContext(AppContext);
  const [searchmail, setSearchmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  const handleSearch = async () => {
    if (!searchmail) return;
    searchUser(searchmail.trim());
    setSearchmail("");
    setIsMenuOpen(false); // Close menu after search
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Msgly</h1>
          </Link>

          {/* Desktop Menu & Links */}
          <div className="hidden lg:flex items-center gap-4">
            {authUser && (
              <div className='flex items-center gap-2 border border-base-300 py-1.5 px-3 rounded-full lg:hidden'>
                <Search className='size-5 text-base-content/60' />
                <input
                  type="text"
                  value={searchmail}
                  onChange={e => setSearchmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='bg-transparent w-48 outline-none'
                  placeholder='Search friends...'
                />
                <button onClick={handleSearch} className="btn btn-xs btn-ghost">
                  Add
                </button>
              </div>
            )}
            <Link to={"/settings"} className="btn btn-sm btn-ghost gap-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm btn-ghost gap-2">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <button className="btn btn-sm btn-ghost gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          {authUser && (
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-sm btn-ghost btn-square">
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && authUser && (
        <div className="lg:hidden absolute top-16 right-4 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 z-50 flex flex-col gap-4">
          {/* Search Bar in Mobile Menu */}
          <div className='flex items-center gap-2 border border-base-300 py-1.5 px-3 rounded-full'>
            <Search className='size-5 text-base-content/60' />
            <input
              type="text"
              value={searchmail}
              onChange={e => setSearchmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='bg-transparent w-full outline-none'
              placeholder='Search friends...'
            />
            <button onClick={handleSearch}>
              <Plus className='size-5' />
            </button>
          </div>

          {/* Links in Mobile Menu */}
          <Link to={"/settings"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-md hover:bg-base-200">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link to={"/profile"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-md hover:bg-base-200">
            <User className="size-5" />
            <span>Profile</span>
          </Link>
          <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 p-2 rounded-md hover:bg-base-200 w-full text-left">
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;