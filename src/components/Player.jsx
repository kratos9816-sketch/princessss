import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { roomDefinitions } from '../data/rooms';
import { soundManager } from '../utils/audioSystem';

export default function Player({ roomBounds, obstacles = [] }) {
  const { camera, gl } = useThree();
  const currentRoom = useGameStore((s) => s.currentRoom);
  const activeModal = useGameStore((s) => s.activeModal);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const setPointerLocked = useGameStore((s) => s.setPointerLocked);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);
  const touchMoveVector = useGameStore((s) => s.touchMoveVector);
  const touchLookDelta = useGameStore((s) => s.touchLookDelta);
  const setTouchLookDelta = useGameStore((s) => s.setTouchLookDelta);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const velocity = useRef(new THREE.Vector3());
  const walkCycle = useRef(0);
  const targetCamY = useRef(1.7);

  // Setup initial room position
  useEffect(() => {
    const roomDef = roomDefinitions[currentRoom];
    if (roomDef) {
      camera.position.set(...roomDef.spawnPoint);
      euler.current.set(roomDef.spawnRotation[0], roomDef.spawnRotation[1], roomDef.spawnRotation[2], 'YXZ');
      camera.quaternion.setFromEuler(euler.current);
      velocity.current.set(0, 0, 0);
    }
  }, [currentRoom, camera]);

  // Pointer Lock and Mouse Events
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerLockChange = () => {
      const isLocked = document.pointerLockElement === dom;
      setPointerLocked(isLocked);
    };

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== dom || activeModal) return;

      const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      euler.current.setFromQuaternion(camera.quaternion);

      // Sensitivity
      euler.current.y -= movementX * 0.0022;
      euler.current.x -= movementY * 0.0022;

      // Clamp vertical pitch so player cannot flip upside down
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl, camera, activeModal, setPointerLocked]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModal) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = true;
          break;
        case 'KeyE':
          if (interactionPrompt && interactionPrompt.action) {
            interactionPrompt.action();
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal, interactionPrompt]);

  // Physics, movement and collision loop
  useFrame((state, delta) => {
    if (activeModal || isTransitioning) {
      velocity.current.set(0, 0, 0);
      return;
    }

    const dt = Math.min(delta, 0.1);

    // Apply Touch Screen Camera Rotation (mobile swipe look)
    if (touchLookDelta.x !== 0 || touchLookDelta.y !== 0) {
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= touchLookDelta.x * 0.0035;
      euler.current.x -= touchLookDelta.y * 0.0035;
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
      setTouchLookDelta({ x: 0, y: 0 });
    }

    // Speed calculation
    const joystickSpeedMag = Math.hypot(touchMoveVector.x, touchMoveVector.y);
    const isRunning = keys.current.shift || joystickSpeedMag > 0.85;
    const speed = isRunning ? 7.5 : 4.2;

    // Movement direction from camera orientation
    const moveDir = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, euler.current.y, 0, 'YXZ'));
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, euler.current.y, 0, 'YXZ'));

    if (keys.current.forward) moveDir.add(forward);
    if (keys.current.backward) moveDir.sub(forward);
    if (keys.current.right) moveDir.add(right);
    if (keys.current.left) moveDir.sub(right);

    // Add mobile virtual joystick input
    if (touchMoveVector.y !== 0) {
      moveDir.addScaledVector(forward, touchMoveVector.y);
    }
    if (touchMoveVector.x !== 0) {
      moveDir.addScaledVector(right, touchMoveVector.x);
    }

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, moveDir.x * speed, dt * 10);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, moveDir.z * speed, dt * 10);

      // Head bobbing & footsteps
      const bobFreq = isRunning ? 14 : 9.5;
      walkCycle.current += dt * bobFreq;
      targetCamY.current = 1.7 + Math.sin(walkCycle.current) * (isRunning ? 0.08 : 0.04);

      if (Math.sin(walkCycle.current) < -0.92) {
        soundManager.playFootstep();
      }
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, dt * 12);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, dt * 12);
      targetCamY.current = THREE.MathUtils.lerp(targetCamY.current, 1.7, dt * 5);
    }

    // Attempt next position
    const nextX = camera.position.x + velocity.current.x * dt;
    const nextZ = camera.position.z + velocity.current.z * dt;

    // Collision detection with room bounds
    const defaultBounds = roomBounds || { minX: -12, maxX: 12, minZ: -16, maxZ: 16 };
    let clampedX = nextX;
    let clampedZ = nextZ;

    if (clampedX < defaultBounds.minX) clampedX = defaultBounds.minX;
    if (clampedX > defaultBounds.maxX) clampedX = defaultBounds.maxX;
    if (clampedZ < defaultBounds.minZ) clampedZ = defaultBounds.minZ;
    if (clampedZ > defaultBounds.maxZ) clampedZ = defaultBounds.maxZ;

    // Obstacle collision (AABB boxes)
    const playerRadius = 0.55;
    for (const obs of obstacles) {
      if (
        clampedX + playerRadius > obs.minX &&
        clampedX - playerRadius < obs.maxX &&
        clampedZ + playerRadius > obs.minZ &&
        clampedZ - playerRadius < obs.maxZ
      ) {
        // Resolve collision: push back to previous position
        clampedX = camera.position.x;
        clampedZ = camera.position.z;
        break;
      }
    }

    camera.position.x = clampedX;
    camera.position.z = clampedZ;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY.current, dt * 12);
  });

  return null;
}
