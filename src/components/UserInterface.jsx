import {
    useState
} from 'react'
import { 
    Canvas,
    useFrame,
} from 'react-three-fiber'
import { useGame } from '../hooks/useGame'
import { 
    RenderBlock,
    getBlockCost
} from './Blocks'
import {
    TbInfoHexagon
} from 'react-icons/tb'

function UserInterface({ blockList, currentBlock, setCurrentBlock }) {

    const [
        playerCurrency,
        playerMode,
        togglePlayerMode
    ] = useGame(state => [
        state.playerCurrency,
        state.playerMode,
        state.togglePlayerMode
    ])

    const [showInfo, setShowInfo] = useState(false)

    const mobileClasses = [
        "absolute",
        "grid",
        "grid-cols-3",
        "xs:grid-cols-4",
        "sm:grid-cols-5",
        "p-3",
        "bottom-0",
        "w-full",
        "flex",
        "gap-3",
        "items-center",
        "justify-start",
    ]
    const desktopClasses = [
        "md:absolute",
        "md:flex",
        "md:flex-wrap",
        "md:items-center",
        "md:justify-center",
    ]

    const buttonMobileClasses = [
        "border-2",
        "relative",
        "rounded-lg",
        "w-full",
        "aspect-square",
    ]
    const buttonDesktopClasses = [
        "md:w-28",
        "md:h-28",
    ]


    return (
        <div className="absolute inset-0 w-full h-screen pointer-events-none z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 space-x-4 p-4 flex items-center">
                <span className={`text-white font-bold py-2 px-4 rounded ${playerCurrency > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    ${playerCurrency}
                </span>
                <button
                    className='pointer-events-auto bg-gray-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-max uppercase'
                    onClick={togglePlayerMode}
                    >
                    {playerMode} Mode
                </button>
                <button
                    className='pointer-events-auto bg-gray-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-max uppercase'
                    onClick={() => setShowInfo(!showInfo)}
                    >
                    <TbInfoHexagon className='h-[24px] w-[24px]' />
                </button>
            </div>

            { showInfo && (

                <div className="absolute  w-full max-w-lg top-[50px] left-1/2 -translate-x-1/2 space-x-4 p-4 flex items-center">
                    <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg">

                        <h1 className="text-white text-2xl font-bold mb-4">
                         Welcome to my Super Simple City Builder
                        </h1>

                        <p className="text-white text-lg mb-4">
                            Press the <span className="font-bold">Idle Mode</span> button to start building your city. This will toggle you to <span className="font-bold">Build Mode</span> where you can place blocks on the grid.
                        </p>

                        <p className="text-white text-lg mb-4">
                            Pressing Q or E will rotate the block you are currently placing.
                        </p>

                        <p className="text-white text-lg mb-4">
                            You can place your starting block anywhere, but subsequent blocks must be placed adjacent to another block.
                        </p>

                        <p className="text-white text-lg mb-4">
                            Some buildings earn you money over time. Roads do not.
                        </p>

                    </div>
                </div>
                    

            )}

            <div className={`block-list ${mobileClasses.join(" ")} ${desktopClasses.join(" ")}`}>

                { playerMode === "build" && ( blockList.map((block, index) => {
                    return (
                    <div 
                        key={index}
                        className={`${buttonMobileClasses.join(" ")} ${buttonDesktopClasses.join(" ")} ${currentBlock === block ? "border-blue-500" : "border-white"}`}
                        onClick={() => setCurrentBlock(block)}>
                        <Canvas
                        className="h-full w-full"
                        camera={{ position: [0, 2, 3.5], fov: 40 }}
                        >
                            <ambientLight intensity={0.5} />
                            <RenderBlock block={{
                                    block,
                                    x: 0,
                                    z: 0
                                }} 
                                yOffset={block === "highrise" ? -1 : 0}
                                />
                        </Canvas>
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                                ${getBlockCost(block)}
                            </span>
                        </div>
                    </div>
                    )
                }))}

            </div>
        </div>
    )
}

export default UserInterface