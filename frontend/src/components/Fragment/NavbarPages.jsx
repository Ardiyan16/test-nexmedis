import { useEffect, useState } from "react"

const NabarPages = () => {
    const [isActive, setIsActive] = useState(false);
    const toggleClass = () => {
        setIsActive(prevIsActive => !prevIsActive)
    }

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            const fixedNav = header.offsetTop;

            if (window.pageYOffset > fixedNav) {
                header.classList.add('navbar-fixed');
            } else {
                header.classList.remove('navbar-fixed');
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
    return (
        <header className="bg-zinc-950 text-white top-0 left-0 w-full flex items-center z-[100] sticky">
            <div className="container">
                <div className="flex items-center justify-between relative">
                    <div className="px-4">
                        <img src="image/logo.png" alt="Logo" className="block py-3 max-w-14 lg:py4 lg:max-w-14" />
                    </div>
                    <div className="flex items-center px-4">
                        <button id="hamburger" type="button" onClick={toggleClass} name="hamburger" className={`${isActive ? 'hamburger-active' : ''} block absolute right-4 lg:hidden`}>
                            <span className="hamburger-line transition duration-300 ease-in-out origin-top-left"></span>
                            <span className={`${isActive ? 'scale-0' : ''} hamburger-line transition duration-300 ease-in-out`}></span>
                            <span className="hamburger-line transition duration-300 ease-in-out origin-bottom-left"></span>
                        </button>
                        <nav id="nav-menu" className={`${isActive ? '' : 'hidden'} absolute py-2 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none`}>
                            <ul className="block lg:flex">
                                <li className="group">
                                    <a href="#home" className="text-sm lg:text-white text-primary hover:text-secondary py-2 mx-8 flex duration-300">Beranda</a>
                                </li>
                                <li className="group">
                                    <a href="#home" className="text-sm lg:text-white text-primary hover:text-secondary py-2 mx-8 flex duration-300">Tentang</a>
                                </li>
                                <li className="group">
                                    <a href="#home" className="text-sm lg:text-white text-primary hover:text-secondary py-2 mx-8 flex duration-300">Pengalaman</a>
                                </li>
                                <li className="group">
                                    <a href="#home" className="text-sm lg:text-white text-primary hover:text-secondary py-2 mx-8 flex duration-300">Portfolio</a>
                                </li>
                                <li className="group">
                                    <a href="#home" className="text-sm lg:text-white text-primary hover:text-secondary py-2 mx-8 flex duration-300">Contact</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NabarPages
