import React, {Suspense, useEffect, useRef, useState} from "react";
import useControls from "r3f-native-orbitcontrols";
import * as THREE from "three";
import { height, width } from "../../config/static_resources.tsx";
import { createCarMaterialByDefault } from "../../model/Material.ts";
import Car3dModel from "../../model/Car.ts";
import { useGLTF, Text3D } from "@react-three/drei/native";
import {Canvas, useFrame, useThree} from "@react-three/fiber/native";
import { View } from "react-native";

import fontPath from "../../../assets/fonts/Poppins_Bold.json";

/**
 * 2024-06-22
 * 现阶段在屏幕上不显示，应该是布局的问题。
 */
// const LoadingModelPage = () => {
//     return (
//         <Text>
//             🌀 Loading...
//         </Text>
//     );
// }

const CarModelComponent = () => {
    const [OrbitControls, events] = useControls();
    const camera = new THREE.PerspectiveCamera(60, width/height, 1, 1000);
    // const { camera } = useThree();
    camera.position.set(3, 3, 3)
    camera.lookAt(0, 0, 0)

    const carBody = useGLTF(require("../../../assets/models/car_body.glb")).scene;
    const cells = useGLTF(require("../../../assets/models/cells.glb")).scene;

    // 创建汽车材质
    const carMaterial = createCarMaterialByDefault();
    // 创建汽车对象
    const car = useRef(new Car3dModel(
        carBody,
        cells,
        carMaterial
    ));

    const cellArray = car.current.getCells();
    const cell_1 = cellArray[0];
    const cell_2 = cellArray[1];
    const cell_3 = cellArray[2];
    const cell_4 = cellArray[3];


    const [selectedPart, setSelectedPart] = useState<THREE.Object3D | null>(null);


    const onPointerDown = (event: THREE.Event) => {
        console.log(event.object.name);
        event.stopPropagation();
        setSelectedPart(event.object);
    }

    return (
        <Suspense>
            <View {...events} style={{flex:1}}>
                <Canvas camera={camera}>
                    <group>
                        <ambientLight intensity={0.5} />
                        <directionalLight color="white" position={[0, 10, 10]} intensity={1} />
                    </group>
                    <group>
                        <primitive object={car.current.getCar()} />
                        <primitive
                            object={cell_1}
                            onPointerDown={onPointerDown}
                        />
                        <primitive
                            object={cell_2}
                            onPointerDown={onPointerDown}
                        />
                        <primitive
                            object={cell_3}
                            onPointerDown={onPointerDown}
                        />
                        <primitive
                            object={cell_4}
                            onPointerDown={onPointerDown}
                        />
                    </group>
                    <group>
                        <mesh position-x={0.7} position-y={0.042}>
                            <planeGeometry args={[0.9, 0.16]} />
                            <meshStandardMaterial color="white" opacity={0.42} transparent />
                        </mesh>
                        {/*<Text3D*/}
                        {/*    font={fontPath}*/}
                        {/*    scale={0.1}*/}
                        {/*    bevelSegments={3}*/}
                        {/*    bevelEnabled*/}
                        {/*    bevelThickness={0.001}*/}
                        {/*    position={[1, 1, 1]}*/}
                        {/*>*/}
                        {/*    123454567898*/}
                        {/*    <meshBasicMaterial color="red" />*/}
                        {/*</Text3D>*/}
                    </group>
                    <axesHelper args={[5]} />
                    <OrbitControls/>
                    <gridHelper />
                </Canvas>
            </View>
        </Suspense>
    );
}

export default CarModelComponent;
