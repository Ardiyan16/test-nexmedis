import { RiArrowDownLine, RiWhatsappLine } from "react-icons/ri";

const HeroFragment = () => {
    return (
        <div className="max-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-5rem)] relative ">
            <div className="bg-zinc-950/10 absolute inset-0 z-[42] pointer-events-none "></div>
            <div className="bg-zinc-950/60 absolute inset-0 z-[42]"></div>

            <img src="image/bg.jpg" className='w-full h-full filter relative z-[41] max-h-[calc(100vh-5rem)] min-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-5rem)] object-cover' alt="" fill />

            <div className="h-full w-full flex flex-col items-start justify-between absolute top-0 left-0 z-[43] p-10 md:p-14 xl:p-20">
                <div className="flex items-start justify-between w-full lg:min-h-36">
                    <div className="flex items-start justify-between border-4 overflow-hidden border-zinc-950/50 rounded-lg bg-zinc-950/20">
                        <img src="/image/logo2.webp" alt="" width={80} height={50} className="p-2" />
                    </div>
                </div>
                <div className="mb-20">
                    <h1 className='mb-5 text-white text-2xl md:text-3xl lg:text-xl xl:text-5xl md:max-w-4xl md:text-left lg:leading-tight xl:leading-tight drop-shadow-md  text-center font-medium'>
                    Mempermudah Kehidupan, Menyempurnakan Rumah Anda
                    </h1>
                    <p className="text-xl sm:text-base text-white md:max-w-4xl md:text-left lg:leading-tight xl:leading-tight drop-shadow-md  text-center font-medium">Hadirnya Pifacia akan mempermudah akan rumah tangga anda. Kami menyediakan peralatan yang berkualitas dan </p>
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
                        <a href="#" className="bg-white/5 pr-5 pl-4 border border-white/30 text-white backdrop-blur-sm lg:text-base transition duration-300 rounded-md cursor-pointer items-center inline-flex justify-center gap-2 p-2"><RiArrowDownLine className="animate-bounce" /> Mulai</a>
                        <a href="#" className="bg-[#25D366] text-white drop-shadow hover:contrast-90 dark:hover:contrast-90 px-3 py-1.5 text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-green-500/40 lg:text-lg  transition duration-300 rounded-md"><RiWhatsappLine /> Whatsapp Kami</a>
                    </div>
                </div>
                <div className="flex items-end justify-between w-full gap-10 ">
                    <div className='hidden md:flex items-center gap-3 flex-wrap '>
                            <div className="bg-white/10 px-4 py-1 border border-white/30 !text-white backdrop-blur-sm rounded-full md:text-sm lg:text-base">Web Apps</div>
                            <div className="bg-white/10 px-4 py-1 border border-white/30 !text-white backdrop-blur-sm rounded-full md:text-sm lg:text-base">Mobile Apps</div>
                    </div> 

                    <div className="flex justify-end w-full md:max-w-sm md:ml-auto">
                        <div className="grid grid-cols-1">
                            
                        </div>
                    </div> 
                </div> 
            </div>
        </div>
    )
}

export default HeroFragment