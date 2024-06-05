import * as THREE from 'three';

export class debug_camera_controller {
    constructor(camera_ref, camera_move_amplitude = 0.1) {
        this.camera = camera_ref;
        this.camera_move_amplitude = camera_move_amplitude;

        // Bind the event listener to the instance
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    moveCameraXYZ(delta_x, delta_y, delta_z) {
        let pos = this.camera.position.clone();

        const forwardVector = new THREE.Vector3();
        this.camera.getWorldDirection(forwardVector);

        const rightVector = new THREE.Vector3(1, 0, 0);
        rightVector.applyQuaternion(this.camera.quaternion);

        const upVector = new THREE.Vector3(0, 1, 0);
        upVector.applyQuaternion(this.camera.quaternion);

        pos.add(forwardVector.multiplyScalar(delta_z));
        pos.add(rightVector.multiplyScalar(delta_x));
        pos.add(upVector.multiplyScalar(delta_y));

        this.camera.position.set(pos.x, pos.y, pos.z);
    }

    rotatePYR(delta_pitch, delta_yaw, delta_roll) {
        let camera_forward = new THREE.Vector3(0, 0, -1);
        camera_forward.applyQuaternion(this.camera.quaternion);

        let camera_right = new THREE.Vector3(1, 0, 0);
        camera_right.applyQuaternion(this.camera.quaternion);

        let camera_up = new THREE.Vector3(0, 1, 0);
        camera_up.applyQuaternion(this.camera.quaternion);

        this.camera.rotateOnAxis(camera_right, delta_pitch);
        this.camera.rotateOnAxis(camera_up, delta_yaw);
        this.camera.rotateOnAxis(camera_forward, delta_roll);
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'w':
                this.moveCameraXYZ(0, 0, this.camera_move_amplitude);
                break;
            case 'W':
                this.moveCameraXYZ(0, 0, this.camera_move_amplitude * 10);
                break;
            case 's':
                this.moveCameraXYZ(0, 0, -this.camera_move_amplitude);
                break;
            case 'S':
                this.moveCameraXYZ(0, 0, -this.camera_move_amplitude * 10);
                break;
            case 'a':
                this.moveCameraXYZ(-this.camera_move_amplitude, 0, 0);
                break;
            case 'A':
                this.moveCameraXYZ(-this.camera_move_amplitude * 10, 0, 0);
                break;
            case 'd':
                this.moveCameraXYZ(this.camera_move_amplitude, 0, 0);
                break;
            case 'D':
                this.moveCameraXYZ(this.camera_move_amplitude * 10, 0, 0);
                break;
            case 'q':
                this.moveCameraXYZ(0, -this.camera_move_amplitude, 0);
                break;
            case 'Q':
                this.moveCameraXYZ(0, -this.camera_move_amplitude * 10, 0);
                break;
            case 'e':
                this.moveCameraXYZ(0, this.camera_move_amplitude, 0);
                break;
            case 'E':
                this.moveCameraXYZ(0, this.camera_move_amplitude * 10, 0);
                break;
            case 'ArrowLeft':
                this.rotatePYR(0, this.camera_move_amplitude, 0);
                break;
            case 'ArrowRight':
                this.rotatePYR(0, -this.camera_move_amplitude, 0);
                break;
            case 'ArrowUp':
                this.rotatePYR(this.camera_move_amplitude, 0, 0);
                break;
            case 'ArrowDown':
                this.rotatePYR(-this.camera_move_amplitude, 0, 0);
                break;
        }
    }
}
