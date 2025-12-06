// Utility functions

const Utils = {
    // Calculate distance between two points
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    // Calculate angle between two points
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // Linear interpolation
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    // Format large numbers
    formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    },

    // Random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Check if point is on path (for tower placement)
    isOnPath(x, y, path, tolerance = 20) {
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            
            // Calculate distance from point to line segment
            const lineLen = this.distance(p1.x, p1.y, p2.x, p2.y);
            if (lineLen === 0) continue;
            
            const t = Math.max(0, Math.min(1, 
                ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / (lineLen * lineLen)
            ));
            
            const projX = p1.x + t * (p2.x - p1.x);
            const projY = p1.y + t * (p2.y - p1.y);
            
            if (this.distance(x, y, projX, projY) < tolerance) {
                return true;
            }
        }
        return false;
    },

    // Get point along path at given distance
    getPointOnPath(path, distance) {
        let totalDist = 0;
        
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const segmentDist = this.distance(p1.x, p1.y, p2.x, p2.y);
            
            if (totalDist + segmentDist >= distance) {
                const remaining = distance - totalDist;
                const t = remaining / segmentDist;
                return {
                    x: this.lerp(p1.x, p2.x, t),
                    y: this.lerp(p1.y, p2.y, t),
                    angle: this.angle(p1.x, p1.y, p2.x, p2.y)
                };
            }
            
            totalDist += segmentDist;
        }
        
        // Return end of path
        const lastPoint = path[path.length - 1];
        return { x: lastPoint.x, y: lastPoint.y, angle: 0 };
    },

    // Get total path length
    getPathLength(path) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            length += this.distance(
                path[i].x, path[i].y,
                path[i + 1].x, path[i + 1].y
            );
        }
        return length;
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Save to local storage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch {
            console.error('Failed to save to storage');
            return false;
        }
    },

    // Load from local storage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch {
            console.error('Failed to load from storage');
            return null;
        }
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
};
