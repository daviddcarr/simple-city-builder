import { useState, useEffect, useRef } from 'react'
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
                return <Park position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "factory":
                return <Factory position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway":
                return <Highway position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway2":
                return <Highway sides={3} position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
            case "highway3":
                return <Highway sides={4} position={blockPosition} rotation-y={block.blockRotation} incomeResetTime={block.incomeResetTime} />
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

    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={currencyPerPeriod}
            currencyPeriod={currencyPeriod}
            >
            { sides >= 3 && 
                <mesh
                    position={[0.375, 0.15, 0]}
                    rotation-y={Math.PI / 2}
                    receiveShadow

                    >
                    <boxGeometry args={[0.5, 0.1, 0.25]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            }

            { sides >= 4 && 
                <mesh
                    position={[-0.375, 0.15, 0]}
                    rotation-y={Math.PI / 2}
                    receiveShadow
                    >
                    <boxGeometry args={[0.5, 0.1, 0.25]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            }

            <mesh
                position={[0, 0.15, 0]}
                receiveShadow
                >
                <boxGeometry args={[0.5, 0.1, 1]} />
                <meshStandardMaterial color="gray" />
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

    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={currencyPerPeriod}
            currencyPeriod={currencyPeriod}
            >
            <mesh
                position={[0, 0.05, 0]}
                receiveShadow
                >
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color="darkgreen" />
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
                className={`font-3xl ${amount > 0 ? 'text-green-500' : 'text-red-500'} font-bold  ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                ${amount}
            </span>
        </Html>
      </a.group>
    );
  }


// 1680215739166 + ( 30 * 1000 ) - 1680215771474