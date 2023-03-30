import { useState } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useGame } from '../hooks/useGame'
import { getBlock } from '../constants/blocks'

export default function Grid(props) {

    const [
      playerMode,
      playerCurrency,
      setPlayerCurrency
    ] = useGame(state => [
      state.playerMode,
      state.playerCurrency,
      state.setPlayerCurrency
    ])

    const currentBlock = props.currentBlock
    const canPurchaseBlock = playerCurrency >= getBlock(currentBlock).cost

    const texture = useLoader(THREE.TextureLoader, '/images/grass_texture.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(props.gridSize / 2, props.gridSize / 2)

    const [firstBlockPlaced, setFirstBlockPlaced] = useState(false)

    const size = props.gridSize

    function containsBlock(adjacentBlocks) {
        for ( let i = 0; i < adjacentBlocks.length; i++ ) {
            if ( adjacentBlocks[i] !== null ) {
                return true
            }
        }
        return false
    }
  
    return (
      <mesh
        {...props}
        position={[props.position[0] - 0.5, props.position[1], props.position[2] - 0.5]}
        name="Grid"
        receiveShadow
        onPointerOver= {(e) => {
          props.hoveringFunction(true)
        }}
        onPointerMove={(e) => {
          if ( e.intersections && canPurchaseBlock ) {
            for ( let i = 0; i < e.intersections.length; i++ ) {
              if ( e.intersections[i].object.name === "Grid" ) {
                const point = e.intersections[i].point
                props.pointerFunction([Math.round(point.x), 0, Math.round(point.z)])
              }
            }
          } 
        }}
        onPointerOut= {() => {
          props.hoveringFunction(false)
        }}
        onPointerDown={(e) => {
            e.stopPropagation()
            if ( e.intersections && playerMode === "build" && canPurchaseBlock ) {
              for ( let i = 0; i < e.intersections.length; i++ ) {
                if ( e.intersections[i].object.name === "Grid" ) {
                    const point = e.intersections[i].point
                    const adjacentBlocks = props.checkAdjacentBlocks(Math.round(point.x), Math.round(point.z))
                    if ( firstBlockPlaced && containsBlock(adjacentBlocks) ) {
                        props.placeBlock(Math.round(point.x), Math.round(point.z))
                        setPlayerCurrency(playerCurrency - getBlock(currentBlock).cost)
                    } else if ( ! firstBlockPlaced ) {
                        props.placeBlock(Math.round(point.x), Math.round(point.z))
                        setPlayerCurrency(playerCurrency - getBlock(currentBlock).cost)
                        setFirstBlockPlaced(true)
                    }
                }
              }
            }
        }}


        >
        <planeGeometry 
          args={[size, size, size, size]}
          />
        <meshStandardMaterial map={texture} />
      </mesh>
    )
  }
  