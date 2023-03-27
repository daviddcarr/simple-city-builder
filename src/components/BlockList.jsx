import { useRef } from 'react'
import { 
    Canvas,
    useFrame,
} from 'react-three-fiber'
import { Highrise, Highway } from './Blocks'

const blockPreview = {
  highrise: <Highrise height={2} position-y={-1} />,
  highway: <Highway />,
}

function BlockList({ blockList, currentBlock }) {

    return (
        <div className="block-list">

            <div className="block-preview current-block">
                <Canvas
                className="block-preview-canvas"
                camera={{ 
                    position: [0, 2, 5],
                    fov: 40,
                }}
                >
                    <ambientLight intensity={0.5} />
                    <CurrentBlock currentBlock={currentBlock} />
                </Canvas>
            </div>
            {blockList.map((block, index) => {
                return (
                <div className="block-preview" key={index}>
                    <Canvas
                    className="block-preview-canvas"
                    camera={{ position: [0, 2, 5], fov: 40 }}
                    >
                        <ambientLight intensity={0.5} />
                        {blockPreview[block]}
                    </Canvas>
                </div>
                )
            })}
        </div>
    )
}

export default BlockList


function CurrentBlock({ currentBlock }) {

    const spinRef = useRef()

    useFrame(() => {
        spinRef.current.rotation.y += 0.01
    })

    return (
        <group
            ref={spinRef}
            >
            {blockPreview[currentBlock]}
        </group>
    )
}