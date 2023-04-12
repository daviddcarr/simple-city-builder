import { useState, useEffect, useRef, useMemo } from 'react'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {
    useFrame,
    extend,
} from 'react-three-fiber'
import {
    Html,
    useGLTF
} from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useGame } from '../hooks/useGame'

import { getBlock } from '../constants/blocks'

import Highrise from './Highrise'

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
            <RenderBlock block={{block: currentBlock.name, x: 0, z: 0, settings: currentBlock.settings}} />
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
                return <Highrise position={blockPosition} rotation-y={block.blockRotation} settings={block.settings} incomeResetTime={block.incomeResetTime} />
            case "park":
                return <Park position={blockPosition} rotation-y={block.blockRotation} settings={block.settings} incomeResetTime={block.incomeResetTime} />
            case "factory":
                return <Factory position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway":
                return <Highway position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway2":
                return <Highway sides={3} position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway3":
                return <Highway sides={4} position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highwayL":
                return <Highway sides={"L"} position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            default:
                return <PlacingBlock position={blockPosition} blockRotation={block.blockRotation} hovering />
        }
      }
      return null
}

export const BlockWrapper = (props) => {

    const [
        gridSize,
        addPlayerCurrency,
        playerBlocks,
    ] = useGame(state => [
        state.gridSize,
        state.addPlayerCurrency,
        state.playerBlocks,
    ])

    const [dollarSignVisible, setDollarSignVisible] = useState(false)
    const [incomeResetTime, setIncomeResetTime] = useState(props.incomeResetTime)
    const incomeTimerRef = useRef()

    const currencyPerPeriod = props.currencyPerPeriod || 5
    const currencyPeriod = props.currencyPeriod || 30

    const updateIncome = () => {
        addPlayerCurrency(currencyPerPeriod)

        const xIndex = props.position[0] + (gridSize/2)
        const zIndex = props.position[2] + (gridSize/2)

        const newIncomeResetTime = Date.now()
        playerBlocks[xIndex][zIndex].incomeResetTime = newIncomeResetTime
        setIncomeResetTime(new Date(newIncomeResetTime).toISOString())

        // Show dollar sign animation and hide it after 2 seconds
        setDollarSignVisible(true)
        setTimeout(() => {
            setDollarSignVisible(false);
        }, 2000)
    }

    useEffect(() => {

        if (incomeResetTime) {
            const parsedIncomeResetTime = Date.parse(incomeResetTime)
            const timeToNextIncome = parsedIncomeResetTime + (currencyPeriod * 1000) - Date.now()

            if (timeToNextIncome > 0) {
                console.log("start timer")
                incomeTimerRef.current = setTimeout(() => {
                    updateIncome()
                }, timeToNextIncome)
            }
        }

        return () => {
            clearTimeout(incomeTimerRef.current)
        }

    }, [incomeResetTime])

    return (
        <group
            {...props}
            >
            {props.children}
            <DollarSign isVisible={dollarSignVisible} amount={ currencyPerPeriod } />
        </group>
    )
}   


export function Highway(props) {

    const sides = props.sides ? props.sides : 2

    const { currencyPerPeriod, currencyPeriod } = getBlock('highway')

    const streets = {
        street: useGLTF('./glb/street.glb'),
        street3: useGLTF('./glb/street3.glb'),
        street4: useGLTF('./glb/street4.glb'),
        streetL: useGLTF('./glb/streetL.glb'),
    }

    const streetsMesh = useMemo(() => {
        return {
            street: {
                road: streets.street.nodes.Street,
                lamp0: streets.street.nodes.StreetLamp,
                lamp1: streets.street.nodes.StreetLamp001,
                lamp2: streets.street.nodes.StreetLamp002,
                lamp3: streets.street.nodes.StreetLamp003,
            },
            street3: {
                road: streets.street3.nodes.Street3,
                lamp0: streets.street3.nodes.StreetLamp002,
                lamp1: streets.street3.nodes.StreetLamp003,
            },
            street4: {
                road: streets.street4.nodes.Street4,
            },
            streetL: {
                road: streets.streetL.nodes.StreetL,
                lamp0: streets.streetL.nodes.StreetLamp002,
                lamp1: streets.streetL.nodes.StreetLamp003,
                lamp2: streets.streetL.nodes.StreetLamp004,
                lamp3: streets.streetL.nodes.StreetLamp005,
            },
        }
    }, [streets])

    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={currencyPerPeriod}
            currencyPeriod={currencyPeriod}
            >
            { sides === 3 && 
                <group>
                    <mesh
                        geometry={streetsMesh.street3.road.geometry}
                        material={streetsMesh.street3.road.material}
                        receiveShadow
                        />
                    <mesh
                        geometry={streetsMesh.street3.lamp0.geometry}
                        material={streetsMesh.street3.lamp0.material}
                        castShadow
                        position={[0.4, 0.05, 0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                    <mesh
                        geometry={streetsMesh.street3.lamp1.geometry}
                        material={streetsMesh.street3.lamp1.material}
                        castShadow
                        position={[0.4, 0.05, -0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                </group>
                }

            { sides === 4 && 
                <group>
                    <mesh
                        geometry={streetsMesh.street4.road.geometry}
                        material={streetsMesh.street4.road.material}
                        receiveShadow
                        />
                </group>
            }

            { sides === 2 &&
                <group>
                    <mesh
                        geometry={streetsMesh.street.road.geometry}
                        material={streetsMesh.street.road.material}
                        receiveShadow
                        />
                    <mesh
                        geometry={streetsMesh.street.lamp0.geometry}
                        material={streetsMesh.street.lamp0.material}
                        castShadow
                        position={[0.4, 0.05, 0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                    <mesh
                        geometry={streetsMesh.street.lamp1.geometry}
                        material={streetsMesh.street.lamp1.material}
                        castShadow
                        position={[0.4, 0.05, -0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                    <mesh
                        geometry={streetsMesh.street.lamp2.geometry}
                        material={streetsMesh.street.lamp2.material}
                        castShadow
                        position={[-0.4, 0.05, -0.25]}
                        />
                    <mesh
                        geometry={streetsMesh.street.lamp3.geometry}
                        material={streetsMesh.street.lamp3.material}
                        castShadow
                        position={[-0.4, 0.05, 0.25]}
                        />
                </group>
            }

            { sides === "L" && 
                <group>
                    <mesh
                        geometry={streetsMesh.streetL.road.geometry}
                        material={streetsMesh.streetL.road.material}
                        receiveShadow
                        />
                    <mesh
                        geometry={streetsMesh.streetL.lamp0.geometry}
                        material={streetsMesh.streetL.lamp0.material}
                        castShadow
                        position={[0.4, 0.05, 0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                    <mesh

                        geometry={streetsMesh.streetL.lamp1.geometry}
                        material={streetsMesh.streetL.lamp1.material}
                        castShadow
                        position={[0.4, 0.05, -0.25]}
                        rotation={[0, Math.PI, 0]}
                        />
                    <mesh

                        geometry={streetsMesh.streetL.lamp2.geometry}
                        material={streetsMesh.streetL.lamp2.material}
                        castShadow
                        position={[-0.25, 0.05, 0.4]}
                        rotation={[0, Math.PI/2, 0]}
                        />
                    <mesh
                        geometry={streetsMesh.streetL.lamp3.geometry}
                        material={streetsMesh.streetL.lamp3.material}
                        castShadow
                        position={[0.25, 0.05, 0.4]}
                        rotation={[0, Math.PI/2, 0]}
                        />
                </group>
            }
        </BlockWrapper>
    )
}

export function Factory(props) {

    const { currencyPerPeriod, currencyPeriod } = getBlock('factory')
    
        return (
            <BlockWrapper
                {...props}
                currencyPerPeriod={currencyPerPeriod}
                currencyPeriod={currencyPeriod}
                >

                <mesh
                    position={[0.4, 0.5, 0.15]}
                    castShadow
                    receiveShadow
                    >
                    <cylinderGeometry args={[0.05, 0.08, 1, 10]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                <mesh
                    position={[0.4, 0.5, -0.15]}
                    castShadow
                    receiveShadow
                    >
                    <cylinderGeometry args={[0.05, 0.08, 1, 10]} />
                    <meshStandardMaterial color="red" />
                </mesh>

                <mesh
                    position={[0, 0.25, 0]}
                    castShadow
                    receiveShadow
                    >
                    <boxGeometry args={[0.75, 0.5, 0.75]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
    
                <mesh
                    position={[0, 0.05, 0]}
                    receiveShadow
                    >
                    <boxGeometry args={[1, 0.1, 1]} />
                    <meshStandardMaterial color="darkgray" />
                </mesh>
            </BlockWrapper>
        )
}

export function Park(props) {

    const { currencyPerPeriod, currencyPeriod } = getBlock('park')

    const treePosition = props.settings && props.settings.treePosition ? props.settings.treePosition : [0.35, 0.05, 0.35]

    const parkFoundation = useGLTF('./glb/foundationGrass.glb')

    const parkFoundationMesh = useMemo(() => {
        return parkFoundation.nodes.FoundationGrass
    }, [parkFoundation])

    const parkTree = useGLTF('./glb/tree.glb')

    const parkTreeMesh = useMemo(() => {
        return parkTree.nodes.Tree
    }, [parkTree])

    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={currencyPerPeriod}
            currencyPeriod={currencyPeriod}
            >
            <mesh
                geometry={parkFoundationMesh.geometry}
                material={parkFoundationMesh.material}
                receiveShadow
                />
            <mesh
                geometry={parkTreeMesh.geometry}
                material={parkTreeMesh.material}
                castShadow
                receiveShadow
                position={treePosition}
                />
        </BlockWrapper>
    )
}

function DollarSign({ isVisible, amount }) {
    const animationProps = useSpring({
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 1.5 : 1,
      config: { tension: 120, friction: 14 },
    });

    const amountString = amount > 0 ? `$${amount}` : `-$${Math.abs(amount)}`

    return (
      <a.group position-y={animationProps.y} visible={isVisible}>
        <Html scaleFactor={20} center>
            <span
                className={`font-3xl ${amount > 0 ? 'bg-green-500' : 'bg-red-500'} text-white px-2 rounded-full font-bold  ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                {amountString}
            </span>
        </Html>
      </a.group>
    );
  }


// 1680215739166 + ( 30 * 1000 ) - 1680215771474