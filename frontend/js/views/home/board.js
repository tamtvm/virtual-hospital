// --- MODULE: reception whiteboard ---

import { fetchBoardStrokes, createBoardStroke } from '../../api/board.js';
import { ApiError } from '../../api/patients.js';
import { showToast } from '../../utils/toast.js';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PEN_WIDTH = 5;
const ERASER_WIDTH = 36;
const MIN_POINT_DISTANCE = 0.004;
const LOADING_TEXT = 'the board is loading...!';
const SYNC_INTERVAL_MS = 2000;

export const getBoardModal = () => `
    <!-- Whiteboard Modal -->
    <div class="modal fade" id="boardModal" tabindex="-1" aria-labelledby="board-modal-title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <!-- Folder header -->
                <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center mlvh-folder-header">
                    <h5 class="mlvh-visually-hidden" id="board-modal-title">Reception Whiteboard</h5>
                    <button type="button" class="btn-close me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mlvh-board-toolbar" role="group" aria-label="Whiteboard tools">
                        <button type="button" class="mlvh-icon-btn active" data-tool="pen" aria-pressed="true" aria-label="Pen">
                            <img src="/assets/icons/misc/pencil.svg" alt="">
                        </button>
                        <button type="button" class="mlvh-icon-btn" data-tool="eraser" aria-pressed="false" aria-label="Eraser">
                            <img src="/assets/icons/misc/eraser.svg" alt="">
                        </button>
                    </div>
                    <div class="mlvh-board-stage">
                        <canvas id="board-canvas" class="mlvh-board-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" aria-label="Shared whiteboard"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

// --- Stroke painting ---
const paintStroke = (context, stroke) => {
    const points = stroke.points;
    if (!points.length) return;

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = stroke.tool === 'eraser' ? ERASER_WIDTH : PEN_WIDTH;
    context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    context.strokeStyle = '#2f4550';

    context.beginPath();
    context.moveTo(points[0][0] * CANVAS_WIDTH, points[0][1] * CANVAS_HEIGHT);
    if (points.length === 1) {
        context.lineTo(points[0][0] * CANVAS_WIDTH + 0.01, points[0][1] * CANVAS_HEIGHT);
    } else {
        points.slice(1).forEach(([x, y]) => context.lineTo(x * CANVAS_WIDTH, y * CANVAS_HEIGHT));
    }
    context.stroke();
    context.restore();
};

const paintLoading = (context) => {
    context.save();
    context.fillStyle = '#6fa8c0';
    context.font = '600 40px system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(LOADING_TEXT, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    context.restore();
};

// --- Init ---
export const initBoard = () => {
    const modal = document.getElementById('boardModal');
    const canvas = document.getElementById('board-canvas');
    const toolbar = modal?.querySelector('.mlvh-board-toolbar');
    if (!modal || !canvas || !toolbar) return;

    const context = canvas.getContext('2d');

    let tool = 'pen';
    let points = [];
    let pointerId = null;
    let isLoading = false;
    let lastStrokeId = null;
    let syncTimer = null;
    const ownStrokeIds = new Set();

    const paintIncoming = (strokes) => {
        strokes.forEach((stroke) => {
            if (!ownStrokeIds.has(stroke.id)) paintStroke(context, stroke);
            lastStrokeId = stroke.id;
        });
    };

    const scheduleSync = () => {
        syncTimer = setTimeout(async () => {
            try {
                paintIncoming(await fetchBoardStrokes(lastStrokeId));
            } catch (error) {
                console.error(error);
            }
            if (syncTimer !== null) scheduleSync();
        }, SYNC_INTERVAL_MS);
    };

    const stopSync = () => {
        clearTimeout(syncTimer);
        syncTimer = null;
    };

    const toUnitPoint = (event) => {
        const bounds = canvas.getBoundingClientRect();
        return [
            Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1),
            Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1),
        ];
    };

    const isFarEnough = ([x, y]) => {
        const [lastX, lastY] = points[points.length - 1];
        return Math.hypot(x - lastX, y - lastY) >= MIN_POINT_DISTANCE;
    };

    const loadBoard = async () => {
        isLoading = true;
        lastStrokeId = null;
        ownStrokeIds.clear();
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        paintLoading(context);
        try {
            const strokes = await fetchBoardStrokes();
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            paintIncoming(strokes);
        } catch (error) {
            console.error(error);
            showToast('Could not load the whiteboard.', 'error');
        } finally {
            isLoading = false;
        }
    };

    const endStroke = async () => {
        const stroke = { tool, points };
        points = [];
        pointerId = null;

        try {
            const saved = await createBoardStroke(stroke);
            ownStrokeIds.add(saved.id);
        } catch (error) {
            console.error(error);
            showToast(error instanceof ApiError ? error.message : 'Could not save your stroke.', 'error');
            loadBoard();
        }
    };

    toolbar.addEventListener('click', (event) => {
        const button = event.target.closest('[data-tool]');
        if (!button) return;
        tool = button.dataset.tool;
        canvas.dataset.tool = tool;
        toolbar.querySelectorAll('[data-tool]').forEach((item) => {
            const isActive = item === button;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
        });
    });

    canvas.addEventListener('pointerdown', (event) => {
        if (pointerId !== null || isLoading) return;
        pointerId = event.pointerId;
        canvas.setPointerCapture(pointerId);
        points = [toUnitPoint(event)];
        paintStroke(context, { tool, points });
    });

    canvas.addEventListener('pointermove', (event) => {
        if (event.pointerId !== pointerId) return;
        const point = toUnitPoint(event);
        if (!isFarEnough(point)) return;
        paintStroke(context, { tool, points: [points[points.length - 1], point] });
        points.push(point);
    });

    canvas.addEventListener('pointerup', (event) => {
        if (event.pointerId !== pointerId) return;
        endStroke();
    });

    canvas.addEventListener('pointercancel', (event) => {
        if (event.pointerId !== pointerId) return;
        endStroke();
    });

    canvas.dataset.tool = tool;
    modal.addEventListener('show.bs.modal', async () => {
        await loadBoard();
        scheduleSync();
    });
    modal.addEventListener('hidden.bs.modal', stopSync);
};