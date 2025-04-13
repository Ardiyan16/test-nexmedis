import ButtonNavbar from "../Element/Button/ButtonNavbar"
const NavbarFragment = () => {
    return (
        <div>
            <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
                <div className="w-1/2"></div>
                <div className="relative w-1/2 flex justify-end">
                    <ButtonNavbar />
                </div>
            </header>
        </div>
    )
}

export default NavbarFragment
