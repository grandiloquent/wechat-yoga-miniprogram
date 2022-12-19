class CustomPlayerBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>
    .player-bar {
        display: grid;
        grid-template-columns: 0fr 1fr 0fr;
        grid-template-areas: "start middle end";
        background-color: rgb(33, 33, 33);
        color: #909090;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 64px;
        transition-property: transform, height, background-color;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
        will-change: transform;
        z-index: 3;
        width: calc(100vw - 0px);
        transform: translate3d(0, 0, 0);
        visibility: visible;
    }

    .left-controls {
        grid-area: start;
        flex: none;
        display: flex;
        align-items: center;
        width: 176px;
    }

    .left-controls-buttons {
        flex: none;
        display: flex;
        align-items: center;
    }

    .previous-button,
    .next-button {
        box-sizing: border-box !important;
        flex: none;
        width: 48px;
        height: 48px;
        padding: 12px;
        margin: 0;
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: #fff;
        stroke: none;
        width: 100%;
        height: 100%;
    }

    .play-pause-button {
        box-sizing: border-box !important;
        flex: none;
        width: 56px;
        height: 56px;
        padding: 12px;
        margin: 0;
    }

    .middle-controls {
        grid-area: middle;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .content-info-wrapper {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin: 0 8px 0 16px;
        width: 100%;
    }

    .title {
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.3;
        font-weight: 500;
        color: #fff;
    }

    .right-controls {
        grid-area: end;
        justify-self: end;
        position: relative;
        justify-content: flex-end;
        margin: 0 4px 0 0;
        flex: none;
        display: flex;
        align-items: center;
        width: 144px;
    }

    .subtitle {
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow: hidden;
    }


    .progress-bar {
        justify-content: space-between;
        align-items: center;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        position: absolute;
        cursor: pointer;
        display: block;
        top: 1px;
        left: -16px;
        width: 100%;
        transform: translateY(-50%);
    }

    .paper-slider {
        position: relative;
        width: 100%;
        height: calc(30px + 2px);
        margin-left: calc(15px + 1px);
        margin-right: calc(15px + 1px);
        padding: 0;
        transform: scaleX(1);
    }

    .paper-progress {
        display: block;
        position: relative;
        overflow: hidden;
        padding: 15px 0;
        width: 100%;
        background-color: transparent;
        touch-action: none;
    }


    .progress-container {
        height: 2px;
        background: #e0e0e0;
        position: relative;
    }

    .secondary-progress {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform-origin: left center;
        will-change: transform;
        background: #7baaf7;
        transform: scaleX(0.58296);
    }

    .primary-progress {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform-origin: left center;
        will-change: transform;
        background: rgb(255, 0, 0);
        transform: scaleX(0.0044843);
    }

    .audio {
        position: absolute;
        left: -100%;
    }
</style>









<div class="player-bar">
    <div class="left-controls">
        <div class="left-controls-buttons">
            <div class="previous-button">
                <div class="icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <g>
                            <path d="M19,6L9,12l10,6V6L19,6z M7,6H5v12h2V6z"></path>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="play-pause-button">
                <div class="icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <g height="24" viewBox="0 0 24 24" width="24">
                            <path d="M9,19H7V5H9ZM17,5H15V19h2Z"></path>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="next-button">
                <div class="icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <g>
                            <path d="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div class="middle-controls">
        <div class="content-info-wrapper">
            <div class="title">标题</div>
            <div class="subtitle">
            </div>
        </div>
    </div>
    <div class="right-controls">
    </div>
    <div class="progress-bar">
        <div class="paper-slider">
            <div class="paper-progress">
                <div class="progress-container">
                    <div class="secondary-progress">
                    </div>
                    <div class="primary-progress">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<audio class="audio"></audio>`;
    }


    static get observedAttributes() {
        return ['src'];
    }

    setPlaybackPauseState() {
        this.playPauseButton.querySelector('path').setAttribute('d', 'M6,4l12,8L6,20V4z');
    }
    setPlaybackPlayState() {
        this.playPauseButton.querySelector('path').setAttribute('d', 'M9,19H7V5H9ZM17,5H15V19h2Z');
    }
    connectedCallback() {

        this.playPauseButton = this.root.querySelector('.play-pause-button');
        this.playPauseButton.addEventListener('click', async evt => {
            evt.stopPropagation();
            try {
                if (this.audio.paused)
                    await this.audio.play();
                else
                    await this.audio.pause();
            } catch (error) {
                console.log(error)
            }

        });
        this.setPlaybackPauseState();
        this.audio = this.root.querySelector('.audio');

        const secondaryProgress = this.root.querySelector('.secondary-progress');
        const primaryProgress = this.root.querySelector('.primary-progress');


        this.audio.addEventListener('play', evt => {
            this.setPlaybackPlayState();
        });
        this.audio.addEventListener('pause', evt => {
            this.setPlaybackPauseState();
        });
        this.audio.addEventListener('progress', evt => {
            secondaryProgress.style.transform = calculateLoadedPercent(this.audio);
        });
        this.audio.addEventListener('timeupdate', evt => {
            primaryProgress.style.transform = calculateProgressPercent(this.audio);
        });
        const paperProgress = this.root.querySelector('.paper-progress');
        paperProgress.addEventListener('click', evt => {
            const precent = evt.clientX / paperProgress.getBoundingClientRect().width;
            this.audio.currentTime = precent * this.audio.duration
        });

       
        this.root.host.style.userSelect = 'none';

        // this.dispatchEvent(new CustomEvent());
        /*
        const close = evt => {
                    evt.stopPropagation();
                    this.remove();
                };
                this.root.querySelectorAll('').forEach(x => {
                    x.addEventListener('click', close);
                })
        this.dispatchEvent(new CustomEvent('submit', {
                        detail: 0
                    }));
        */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'src') {
            this.audio.src = newVal;
            const title = this.root.querySelector('.title');
            title.textContent = this.getAttribute('title')
                || substringAfterLast(new URL(this.audio.src).searchParams.get('path'), "/");
    
        }
    }

}
customElements.define('custom-player-bar', CustomPlayerBar);
/*
<!--\
<custom-player-bar></custom-player-bar>
<script src="custom-player-bar.js"></script>

const customPlayerBar = document.querySelector('custom-player-bar');
customPlayerBar.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customPlayerBar = document.createElement('custom-player-bar');
customPlayerBar.setAttribute('title','');
document.body.appendChild(customPlayerBar);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/
function substringAfterLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(index + delimiter.length);
    }
}
function calculateLoadedPercent(video) {
    if (!video.buffered.length) {
        return '0';
    }
    return `scaleX(${(video.buffered.end(0) / video.duration)})`;
}
function calculateProgressPercent(video) {
    return `scaleX(${video.currentTime / video.duration})`;

}