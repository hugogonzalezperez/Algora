var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Standalone JPS script
var rows = 10;
var cols = 10;
var grid = Array.from({ length: rows }, function () { return new Array(cols).fill(false); });
grid[2][1] = true;
grid[2][2] = true;
grid[3][1] = true;
grid[3][2] = true;
grid[4][1] = true;
grid[4][2] = true;
var start = { x: 0, y: 0 };
var end = { x: 1, y: 6 };
function jps(grid, start, end, rows, cols) {
    function jump(cx, cy, dx, dy) {
        var nx = cx + dx;
        var ny = cy + dy;
        if (!isWalkable(nx, ny))
            return null;
        if (dx !== 0 && dy !== 0 && !canMoveDiag(cx, cy, dx, dy))
            return null;
        if (nx === end.x && ny === end.y)
            return { x: nx, y: ny };
        if (dx !== 0 && dy !== 0) {
            if (jump(nx, ny, dx, 0) !== null || jump(nx, ny, 0, dy) !== null)
                return { x: nx, y: ny };
        }
        else if (dx !== 0) {
            if ((!isWalkable(cx, ny + 1) && isWalkable(nx, ny + 1)) ||
                (!isWalkable(cx, ny - 1) && isWalkable(nx, ny - 1)))
                return { x: nx, y: ny };
        }
        else {
            if ((!isWalkable(nx + 1, cy) && isWalkable(nx + 1, ny)) ||
                (!isWalkable(nx - 1, cy) && isWalkable(nx - 1, ny)))
                return { x: nx, y: ny };
        }
        return jump(nx, ny, dx, dy);
    }
    function getNeighbors(node) {
        var dirs = [];
        var par = parentMap.get("".concat(node.x, ",").concat(node.y));
        var x = node.x, y = node.y;
        if (!par) {
            for (var ddx = -1; ddx <= 1; ddx++) {
                for (var ddy = -1; ddy <= 1; ddy++) {
                    if (ddx === 0 && ddy === 0)
                        continue;
                    if (!isWalkable(x + ddx, y + ddy))
                        continue;
                    if (ddx !== 0 && ddy !== 0 && !canMoveDiag(x, y, ddx, ddy))
                        continue;
                    dirs.push({ dx: ddx, dy: ddy });
                }
            }
            return dirs;
        }
        var dx = Math.sign(x - par.x);
        var dy = Math.sign(y - par.y);
        if (dx !== 0 && dy !== 0) {
            var canH = isWalkable(x + dx, y);
            var canV = isWalkable(x, y + dy);
            if (canH)
                dirs.push({ dx: dx, dy: 0 });
            if (canV)
                dirs.push({ dx: 0, dy: dy });
            if (canH && canV && isWalkable(x + dx, y + dy))
                dirs.push({ dx: dx, dy: dy });
        }
        else if (dx !== 0) {
            if (isWalkable(x + dx, y))
                dirs.push({ dx: dx, dy: 0 });
            if (!isWalkable(x - dx, y + 1) && isWalkable(x, y + 1)) {
                dirs.push({ dx: 0, dy: 1 });
                if (isWalkable(x + dx, y))
                    dirs.push({ dx: dx, dy: 1 });
            }
            if (!isWalkable(x - dx, y - 1) && isWalkable(x, y - 1)) {
                dirs.push({ dx: 0, dy: -1 });
                if (isWalkable(x + dx, y))
                    dirs.push({ dx: dx, dy: -1 });
            }
        }
        else {
            if (isWalkable(x, y + dy))
                dirs.push({ dx: 0, dy: dy });
            if (!isWalkable(x + 1, y - dy) && isWalkable(x + 1, y)) {
                dirs.push({ dx: 1, dy: 0 });
                if (isWalkable(x, y + dy))
                    dirs.push({ dx: 1, dy: dy });
            }
            if (!isWalkable(x - 1, y - dy) && isWalkable(x - 1, y)) {
                dirs.push({ dx: -1, dy: 0 });
                if (isWalkable(x, y + dy))
                    dirs.push({ dx: -1, dy: dy });
            }
        }
        return dirs;
    }
    var isWalkable, h, gScore, parentMap, openSet, closedSet, canMoveDiag, current, curKey, path_2, temp, p, pdx, pdy, ix, iy, _i, path_1, step_1, _a, _b, dir, jp, jKey, d, newG;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                isWalkable = function (x, y) {
                    return x >= 0 && x < cols && y >= 0 && y < rows && !grid[y][x];
                };
                h = function (x, y) {
                    var dx = Math.abs(x - end.x);
                    var dy = Math.abs(y - end.y);
                    return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
                };
                gScore = new Map();
                parentMap = new Map();
                openSet = [];
                closedSet = new Set();
                gScore.set("".concat(start.x, ",").concat(start.y), 0);
                parentMap.set("".concat(start.x, ",").concat(start.y), null);
                openSet.push({ x: start.x, y: start.y, f: h(start.x, start.y), g: 0 });
                return [4 /*yield*/, __assign(__assign({}, start), { type: 'visited' })];
            case 1:
                _d.sent();
                canMoveDiag = function (cx, cy, dx, dy) {
                    return isWalkable(cx + dx, cy) && isWalkable(cx, cy + dy);
                };
                _d.label = 2;
            case 2:
                if (!(openSet.length > 0)) return [3 /*break*/, 13];
                openSet.sort(function (a, b) { return a.f !== b.f ? a.f - b.f : h(a.x, a.y) - h(b.x, b.y); });
                current = openSet.shift();
                curKey = "".concat(current.x, ",").concat(current.y);
                if (closedSet.has(curKey))
                    return [3 /*break*/, 2];
                closedSet.add(curKey);
                return [4 /*yield*/, { x: current.x, y: current.y, type: 'visited' }];
            case 3:
                _d.sent();
                if (!(current.x === end.x && current.y === end.y)) return [3 /*break*/, 8];
                path_2 = [];
                temp = current;
                while (temp) {
                    p = parentMap.get("".concat(temp.x, ",").concat(temp.y));
                    if (p) {
                        pdx = Math.sign(temp.x - p.x);
                        pdy = Math.sign(temp.y - p.y);
                        ix = temp.x, iy = temp.y;
                        while (ix !== p.x || iy !== p.y) {
                            path_2.push({ x: ix, y: iy, type: 'path' });
                            ix -= pdx;
                            iy -= pdy;
                        }
                    }
                    else {
                        path_2.push({ x: temp.x, y: temp.y, type: 'path' });
                    }
                    temp = p !== null && p !== void 0 ? p : null;
                }
                path_2.reverse();
                _i = 0, path_1 = path_2;
                _d.label = 4;
            case 4:
                if (!(_i < path_1.length)) return [3 /*break*/, 7];
                step_1 = path_1[_i];
                return [4 /*yield*/, step_1];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/];
            case 8:
                _a = 0, _b = getNeighbors(current);
                _d.label = 9;
            case 9:
                if (!(_a < _b.length)) return [3 /*break*/, 12];
                dir = _b[_a];
                jp = jump(current.x, current.y, dir.dx, dir.dy);
                if (!jp)
                    return [3 /*break*/, 11];
                jKey = "".concat(jp.x, ",").concat(jp.y);
                if (closedSet.has(jKey))
                    return [3 /*break*/, 11];
                d = Math.hypot(jp.x - current.x, jp.y - current.y);
                newG = current.g + d;
                if (!(newG < ((_c = gScore.get(jKey)) !== null && _c !== void 0 ? _c : Infinity))) return [3 /*break*/, 11];
                gScore.set(jKey, newG);
                parentMap.set(jKey, { x: current.x, y: current.y });
                openSet.push({ x: jp.x, y: jp.y, g: newG, f: newG + h(jp.x, jp.y) });
                return [4 /*yield*/, { x: jp.x, y: jp.y, type: 'visited' }];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                _a++;
                return [3 /*break*/, 9];
            case 12: return [3 /*break*/, 2];
            case 13: return [2 /*return*/];
        }
    });
}
var gen = jps(grid, start, end, rows, cols);
var step;
var path = [];
var visited = [];
while (true) {
    var result = gen.next();
    if (result.done)
        break;
    if (result.value.type === 'path') {
        path.push(result.value);
    }
    else {
        visited.push(result.value);
    }
}
console.log("JPS Visited Nodes (Jump Points Evaluated):");
visited.forEach(function (v) { return console.log("(".concat(v.x, ", ").concat(v.y, ")")); });
console.log("\nJPS Path:");
path.forEach(function (p) { return console.log("(".concat(p.x, ", ").concat(p.y, ")")); });
