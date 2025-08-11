import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@/context/user-context';

const Navbar = () => {
    const { userInfo, logout } = useContext(UserContext);

    console.log("Navbar render, userInfo:", userInfo);

    return (
        <nav className="w-full top-0 bg-white dark:bg-gray-800 shadow- flex items-center justify-between px-4 py-3">
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#144EE3] via-[#EB568E] via-64% to-[#144EE3]">
                <Link to='/'>Snipr</Link>
            </p>
            <div className="flex space-x-4">
                {userInfo?.token ? (
                    <Button onClick={logout} variant="outline" size="default">
                        Logout <LogOut />
                    </Button>
                ) : (
                    <>
                        <Link to='/login'>
                            <Button variant="outline" size="default">Login <LogIn /></Button>
                        </Link>
                        <Link to='/register'>
                            <Button variant="default" size="default">Register Now</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;