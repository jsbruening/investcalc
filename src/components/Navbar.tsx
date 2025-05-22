import { Link, useLocation } from 'react-router-dom';

const navLinks = [
      { to: '/', label: 'Home' },
      { to: '/calculator', label: 'Calculator' },
];

const Navbar = () => {
      const location = useLocation();
      return (
            <nav className="w-full bg-white shadow px-4 py-3 flex items-center justify-between">
                  <div className="text-xl font-bold text-green-700 tracking-tight">Investment App</div>
                  <div className="flex gap-2 sm:gap-4">
                        {navLinks.map(link => (
                              <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-3 py-2 rounded-md font-medium transition-colors text-base
              ${location.pathname === link.to
                                                ? 'bg-green-100 text-green-700'
                                                : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
                              >
                                    {link.label}
                              </Link>
                        ))}
                  </div>
            </nav>
      );
};

export default Navbar; 