import { useState } from 'react'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {
    useFrame,
    extend,
} from 'react-three-fiber'
import {
    Html
} from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useGame } from '../hooks/useGame'

extend({ TextGeometry })

export function PlacingBlock(props) {

    const { rotationY } = useSpring({ rotationY: props.blockRotation })
    const currentBlock = props.currentBlock
    
    
    if ( ! props.hovering ) return null
    return (
        <a.group
            {...props}
            rotation-y={rotationY}
            >
            <RenderBlock block={{block: currentBlock, x: 0, z: 0}} />
        </a.group>
    )
  }

export function RenderBlock({block, yOffset}) {

    yOffset = yOffset ? yOffset : 0

    const blockPosition = [
        block.x ? block.x : 0,
        yOffset,
        block.z ? block.z : 0
    ]


    if (block) {
        switch (block.block) {
            case "highrise":
                return <Highrise position={blockPosition} rotation-y={block.blockRotation} height={2} incomeResetTime={block.incomeResetTime} />
            case "highway":
                return <Highway position={blockPosition} rotation-y={block.blockRotation} />
            case "highway2":
                return <Highway sides={3} position={blockPosition} rotation-y={block.blockRotation} />
            case "highway3":
                return <Highway sides={4} position={blockPosition} rotation-y={block.blockRotation} />
            case "factory":
                return <Factory position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            default:
                return <PlacingBlock position={blockPosition} blockRotation={block.blockRotation} hovering />
        }
      }
      return null
}

export const getBlockCost = (block) => {
    switch (block) {
      case "highrise":
        return 50
      case "highway":
        return 5
      case "highway2":
        return 10
      case "highway3":
        return 15
      case "factory":
        return 150
      default:
        return 0
    }
}

const BlockWrapper = (props) => {

    const [
        gridSize,
        playerCurrency,
        setPlayerCurrency,
        playerBlocks,
    ] = useGame(state => [
        state.gridSize,
        state.playerCurrency,
        state.setPlayerCurrency,
        state.playerBlocks,
    ])

    const [dollarSignVisible, setDollarSignVisible] = useState(false)

    const currencyPerPeriod = props.currencyPerPeriod ? props.currencyPerPeriod : 5
    const currencyPeriod = props.currencyPeriod ? props.currencyPeriod : 30

    useFrame(() => {
        if (props.incomeResetTime) {
            if (props.incomeResetTime < Date.now()) {
                // calculate how much time has passed since props.incomeResetTime
                const currentTime = Date.now()
                const timePassed = Math.floor((currentTime - props.incomeResetTime) / 1000)

                // if more than 30 seconds have passed, add 5 currency to the player
                if (timePassed > currencyPeriod) {
                    console.log("Time passed: " + timePassed)
                    setPlayerCurrency(playerCurrency + currencyPerPeriod)

                    const xIndex = props.position[0] + (gridSize/2)
                    const zIndex = props.position[2] + (gridSize/2)

                     playerBlocks[xIndex][zIndex].incomeResetTime = currentTime

                     // Show dollar sign animation and hide it after 2 seconds
                    setDollarSignVisible(true)
                    setTimeout(() => {
                        setDollarSignVisible(false);
                    }, 2000)
                }            
            }
        }
    })

    return (
        <group
            {...props}
            >
            {props.children}
            <DollarSign isVisible={dollarSignVisible} amount={ currencyPerPeriod } />
        </group>
    )
}   

export function Highrise(props) {

    const height = props.height ? props.height : 1

    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={25}
            currencyPeriod={30}
            >
            <mesh
                position={[0, height / 2, 0]}
                castShadow
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
        </BlockWrapper>
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
            <BlockWrapper
                {...props}
                currencyPerPeriod={10}
                currencyPeriod={15}
                >

                <mesh
                    position={[0.4, 0.5, 0.15]}
                    castShadow
                    >
                    <cylinderGeometry args={[0.05, 0.08, 1, 10]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                <mesh
                    position={[0.4, 0.5, -0.15]}
                    castShadow
                    >
                    <cylinderGeometry args={[0.05, 0.08, 1, 10]} />
                    <meshStandardMaterial color="red" />
                </mesh>

                <mesh
                    position={[0, 0.25, 0]}
                    castShadow
                    >
                    <boxGeometry args={[0.75, 0.5, 0.75]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
    
                <mesh
                    position={[0, 0.05, 0]}
                    >
                    <boxGeometry args={[1, 0.1, 1]} />
                    <meshStandardMaterial color="darkgray" />
                </mesh>
            </BlockWrapper>
        )
}

function DollarSign({ isVisible, amount }) {
    const animationProps = useSpring({
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 1.5 : 1,
      config: { tension: 120, friction: 14 },
    });

    return (
      <a.group position-y={animationProps.y} visible={isVisible}>
        <Html scaleFactor={20} center>
            <span
                className={`font-3xl text-green-500 font-bold  ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                ${amount}
            </span>
        </Html>
      </a.group>
    );
  }