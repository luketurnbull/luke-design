import { CameraControls } from '@react-three/drei'
import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

export default function useCamera({
  cameraControlsRef,
}: {
  cameraControlsRef: React.RefObject<CameraControls>
}) {
  let cameraControls: CameraControls | null = null

  useEffect(() => {
    cameraControls = cameraControlsRef.current
  }, [cameraControlsRef])

  // Zoom to fit the passed in ref to the center of the screen
  // If an azimuth is passed in, rotate the camera to that azimuth
  // Always level out elevation for now
  const zoomToMesh = useCallback(
    (ref: React.RefObject<THREE.Mesh | THREE.Group>, azimuth?: number) => {
      if (!cameraControls || !ref.current) return

      const box = new THREE.Box3().setFromObject(ref.current)
      cameraControls.fitToBox(box, true, {
        paddingBottom: 0.1,
        paddingTop: 0.1,
        paddingLeft: 0.1,
        paddingRight: 0.1,
      })
      cameraControls.rotatePolarTo(Math.PI / 2, true)

      if (azimuth) {
        cameraControls.rotateAzimuthTo(azimuth, true)
      }
    },
    [cameraControls],
  )

  return { zoomToMesh }
}
