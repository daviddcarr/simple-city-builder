import { useMemo, useEffect } from 'react'
import { MeshStandardMaterial } from 'three'
import { useGLTF,  useTexture } from '@react-three/drei'

import { getBlock } from '../constants/blocks'
import { BlockWrapper } from './Blocks'

export default function Highrise(props) {

    const floors = props.settings && props.settings.floors ? props.settings.floors : [4,4,4,3,3,3,2,1,1]
    const texture = props.settings && props.settings.texture ? props.settings.texture : "BrickModern"

    const { currencyPerPeriod, currencyPeriod } = getBlock('highrise')

    const foundation = useGLTF('./glb/foundation.glb')

    const foundationMesh = useMemo(() => {
        return  foundation.nodes.FoundationConcrete
    }, [foundation])

    const highriseGltfs = {
        "4": useGLTF('./glb/highrise_4.glb'),
        "4roof": useGLTF('./glb/highrise_4roof.glb'),
        "4to3": useGLTF('./glb/highrise_4to3.glb'),
        "4to2": useGLTF('./glb/highrise_4to2.glb'),
        "4to1": useGLTF('./glb/highrise_4to1.glb'),
        "3": useGLTF('./glb/highrise_3.glb'),
        "3roof": useGLTF('./glb/highrise_3roof.glb'),
        "3to2": useGLTF('./glb/highrise_3to2.glb'),
        "3to1": useGLTF('./glb/highrise_3to1.glb'),
        "2": useGLTF('./glb/highrise_2.glb'),
        "2roof": useGLTF('./glb/highrise_2roof.glb'),
        "2to1": useGLTF('./glb/highrise_2to1.glb'),
        "1": useGLTF('./glb/highrise_1.glb'),
        "1roof": useGLTF('./glb/highrise_1roof.glb')
    }

    const towerBlocks = useMemo(() => {

        let resultArray = []

        for ( let i = 0; i < floors.length; i++ ) {
            if (i !== 0 && floors[i] !== floors[i-1] ) {
                const sectionName = floors[i-1] + "to" + floors[i]
                resultArray.push(highriseGltfs[sectionName].nodes["Highrise" + sectionName])
            } else {
                resultArray.push(highriseGltfs[floors[i]].nodes["Highrise" + floors[i]])
            }
        }
        resultArray.push(highriseGltfs[floors[floors.length - 1] + "roof"].nodes["Highrise" + floors[floors.length - 1] + "roof"])

        return resultArray

    }, [floors])

    const textures = {
        normal: useTexture('./textures/Highrise/' + texture + '/HighriseMaterial_Normal.png'),
        roughness: useTexture('./textures/Highrise/' + texture + '/HighriseMaterial_Roughness.png'),
        metalness: useTexture('./textures/Highrise/' + texture + '/HighriseMaterial_Metallic.png'),
        map: useTexture('./textures/Highrise/' + texture + '/HighriseMaterial_BaseColor.png'),
        emission: useTexture('./textures/Highrise/' + texture + '/HighriseMaterial_Emission.png')
    }

    const material = useMemo(() => {
        textures.normal.flipY = false
        textures.roughness.flipY = false
        textures.metalness.flipY = false
        textures.map.flipY = false
        textures.emission.flipY = false

        return new MeshStandardMaterial({
            normalMap: textures.normal,
            roughnessMap: textures.roughness,
            metalnessMap: textures.metalness,
            map: textures.map,
            emissiveMap: textures.emission,
        })
    }, [textures.normal, textures.roughness, textures.metalness, textures.map, textures.emission])
    
    return (
        <BlockWrapper
            {...props}
            currencyPerPeriod={currencyPerPeriod}
            currencyPeriod={currencyPeriod}
            >

            <mesh
                position={[0, 0, 0]}
                receiveShadow
                geometry={foundationMesh.geometry}
                material={foundationMesh.material}
                />
            {
                towerBlocks.map((block, index) => (
                    <mesh
                        key={index}
                        position={[0, index * 0.25, 0]}
                        castShadow
                        receiveShadow
                        geometry={block.geometry}
                        material={material}
                        />
                )) 
            }
        </BlockWrapper>
    )
}