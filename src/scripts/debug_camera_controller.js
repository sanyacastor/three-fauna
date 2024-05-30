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
                this.camera.rotation.y += this.camera_move_amplitude;
                break;
            case 'ArrowRight':
                this.camera.rotation.y -= this.camera_move_amplitude;
                break;
            case 'ArrowUp':
                this.camera.rotation.x += this.camera_move_amplitude;
                break;
            case 'ArrowDown':
                this.camera.rotation.x -= this.camera_move_amplitude;
                break;
        }
    }
}
