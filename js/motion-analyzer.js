import { POSE } from './constants.js';

export class MotionAnalyzer {
    constructor() {
        this.score = 0;
        this.sensitivity = 500; // Default (will be overridden by slider)
        this.smoothedNoseY = 0;
        this.prevNoseY = 0;
        this.frameCount = 0;
    }

    update(landmarks) {
        this.frameCount++;

        if (!landmarks || landmarks.length === 0) {
            return Math.floor(this.score);
        }

        // Get nose position
        const nose = landmarks[POSE.NOSE];
        if (!nose || nose.visibility < 0.2) {
            return Math.floor(this.score);
        }

        // Noise smoothing using low-pass filter (like stage07)
        let rawY = nose.y;
        if (this.smoothedNoseY === 0) {
            this.smoothedNoseY = rawY;
            this.prevNoseY = rawY;
            // console.log('Nose tracking initialized');
            return Math.floor(this.score);
        }

        // Smooth the Y position (0.8 = strong smoothing)
        this.smoothedNoseY = this.smoothedNoseY * 0.8 + rawY * 0.2;

        // Calculate movement (upward = positive diff)
        let diff = this.prevNoseY - this.smoothedNoseY;

        // Ignore tiny jitter (< 0.002 in normalized coords)
        if (Math.abs(diff) < 0.002) {
            this.prevNoseY = this.smoothedNoseY;
            return Math.floor(this.score);
        }

        // Detect UPWARD movement (jumping)
        // 0 = 민감 (작은 움직임도 점수), 100 = 둔감 (큰 움직임만 점수)
        const threshold = this.sensitivity / 20000 + 0.001;

        if (diff > threshold) {
            const scoreInc = diff * 50;
            this.score += scoreInc;

            if (this.frameCount % 30 === 0) {
                // console.log(`🎯 Jump! Diff: ${diff.toFixed(4)}, Thresh: ${threshold.toFixed(4)}, +${scoreInc.toFixed(1)}`);
            }
        }

        this.prevNoseY = this.smoothedNoseY;
        return Math.floor(this.score);
    }

    getScore() {
        return Math.floor(this.score);
    }

    reset() {
        this.score = 0;
        this.smoothedNoseY = 0;
        this.prevNoseY = 0;
        this.frameCount = 0;
    }
}
