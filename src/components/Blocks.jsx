//import { useRef } from 'react'
import { useSpring, a } from '@react-spring/three'


export function PlacingBlock(props) {

    const { rotationY } = useSpring({ rotationY: props.blockRotation })
    const currentBlock = props.currentBlock
    
    
    if ( ! props.hovering ) return null
    return (
        <a.group
            {...props}
            rotation-y={rotationY}
            >
            { currentBlock === "highrise" && <Highrise height={3} /> }
            { currentBlock === "highway" && <Highway sides={2} /> }
        </a.group>
    )
  }

export function Highrise(props) {

    const height = props.height ? props.height : 1

    return (
        <group
            {...props}
            >
            <mesh
                position={[0, height / 2, 0]}
            
                >
                <boxGeometry 
                    args={[0.8, height, 0.8]} 
                    />
                <meshStandardMaterial color="lightblue" />
            </mesh>

            <mesh
                position={[0, 0.05, 0]}
                >
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color="darkgray" />
            </mesh>
        </group>
    )
}

export function Highway(props) {

    const sides = props.sides ? props.sides : 2

    return (
        <group
            {...props}
            >

            { sides >= 3 && 
                <mesh
                    position={[0.375, 0.15, 0]}
                    rotation-y={Math.PI / 2}
                    >
                    <boxGeometry args={[0.5, 0.1, 0.25]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            }

            { sides >= 4 && 
                <mesh
                    position={[-0.375, 0.15, 0]}
                    rotation-y={Math.PI / 2}
                    >
                    <boxGeometry args={[0.5, 0.1, 0.25]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            }

            <mesh
                position={[0, 0.15, 0]} 
                >
                <boxGeometry args={[0.5, 0.1, 1]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            <mesh
                position={[0, 0.05, 0]}
                >
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color="darkgray" />
            </mesh>
        </group>
    )
}

export function Factory(props) {
    
        return (
            <group
                {...props}
                >

                <mesh>
                    <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
                    <meshStandardMaterial color="red" />
                </mesh>

                <mesh
                    position={[0, 0.5, 0]}
                    >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
    
                <mesh
                    position={[0, 0.05, 0]}
                    >
                    <boxGeometry args={[1, 0.1, 1]} />
                    <meshStandardMaterial color="darkgray" />
                </mesh>
            </group>
        )
}