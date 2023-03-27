import { useState } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

export default function Grid(props) {

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

        onPointerOver= {(e) => {
          props.hoveringFunction(true)
        }}
        onPointerMove={(e) => {
          if ( e.intersections ) {
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
            if ( e.intersections ) {
              for ( let i = 0; i < e.intersections.length; i++ ) {
                if ( e.intersections[i].object.name === "Grid" ) {
                    const point = e.intersections[i].point
                    const adjacentBlocks = props.checkAdjacentBlocks(Math.round(point.x), Math.round(point.z))
                    console.log(adjacentBlocks)
                    if ( firstBlockPlaced && containsBlock(adjacentBlocks) ) {
                        console.log("Adjacent Block")
                        props.placeBlock(Math.round(point.x), Math.round(point.z))
                    } else if ( ! firstBlockPlaced ) {
                        console.log("First Block")
                        props.placeBlock(Math.round(point.x), Math.round(point.z))
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
  