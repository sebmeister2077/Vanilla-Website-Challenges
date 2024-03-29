import { changeColorClick } from './changeColorClick.js';
import { messageSubmit } from './messageSubmit.js';
import { throttleCubeRotate } from './cubeRotateMousemove.js';
import { cubeMouseup } from './cubeMouseup.js';
import { cubeMousedown } from './cubeMousedown.js';
import { throttledCursorMove } from './cursorMove.js';
import { chatScrollListener } from './chatScrollListener.js';
import { initNetworkChangeListener, onOfflineListener, onOnlineListener } from './onlineListener.js';
import { loginWithGoogle } from '../firebase/auth/loginWithGoogle.js';
import { uploadImageClick } from './uploadImageClick.js';

export function initDOMListeners() {
    $('#change-color').on('click', changeColorClick);
    $('#upload-image').on('click', uploadImageClick);
    $('#message-form').on('submit', messageSubmit);

    const startPosition = {};
    $('.cube-glass').on('mousemove', throttleCubeRotate(startPosition));
    $('.cube-glass').on('mouseup', cubeMouseup);
    $('.cube-glass').get(0).addEventListener('mousedown', cubeMousedown(startPosition), true);

    addEventListener(
        'contextmenu',
        function (e) {
            const isChatImage = e.target instanceof HTMLImageElement && e.target.hasAttribute('data-chat-image');
            if (isChatImage) return;
            e.preventDefault();
        },
        { capture: true },
    );
    $(document).on({
        mousemove: throttledCursorMove,
        touchmove: throttledCursorMove,
        mousedown: function () {
            $(`svg[key=${window.currentUserData.uid}]`).addClass('scale-150');
        },
        mouseup: function () {
            $(`svg[key=${window.currentUserData.uid}]`).removeClass('scale-150');
        },
    });

    requestIdleCallback(() => {
        $(window).on({
            offline: onOfflineListener,
            online: onOnlineListener,
        });
        initNetworkChangeListener();
    });

    $('#google-btn').on('click', loginWithGoogle);
    $('#messages').on('scroll', function (e) {
        chatScrollListener.call(this, e);
    });
}
