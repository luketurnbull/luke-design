import { CameraControls } from '@react-three/drei'
import { useCallback } from 'react'
import * as THREE from 'three'

export default function useCamera({
  cameraControlsRef,
}: {
  cameraControlsRef: React.RefObject<CameraControls>
}) {
  // Zoom to fit the passed in ref to the center of the screen
  // If an azimuth is passed in, rotate the camera to that azimuth
  // Always level out elevation for now
  const zoomToMesh = useCallback(
    (ref: React.RefObject<THREE.Mesh | THREE.Group>, azimuth?: number) => {
      if (!cameraControlsRef.current || !ref.current) return

      const box = new THREE.Box3().setFromObject(ref.current)
      cameraControlsRef.current.fitToBox(box, true, {
        paddingBottom: 0.1,
        paddingTop: 0.1,
        paddingLeft: 0.1,
        paddingRight: 0.1,
      })
      cameraControlsRef.current.rotatePolarTo(Math.PI / 2, true)

      if (azimuth) {
        cameraControlsRef.current.rotateAzimuthTo(azimuth, true)
      }
    },
    [cameraControlsRef],
  )

  return { zoomToMesh }
}
