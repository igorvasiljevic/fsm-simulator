customElements.define('g-canvas', class extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `<canvas class="float"></canvas>`;

        this._canvas = this.getElementsByTagName('canvas')[0];
    }

    set pixelRatio(ratio) { this._pixelRatio = ratio; console.log(ratio); }

    resize(width, height) {
        this._canvas.width = width * this._pixelRatio;
        this._canvas.height = height * this._pixelRatio;
        this._canvas.style.width = width + 'px';
        this._canvas.style.height = height + 'px';
        this.context.setTransform(this._pixelRatio, 0, 0, this._pixelRatio, 0, 0);

        this.clamp();
    }

    center() {
        this._canvas.style.left = ((window.innerWidth - this._canvas.scrollWidth) / 2) + 'px';
        this._canvas.style.top = ((window.innerHeight - this._canvas.scrollHeight) / 2) + 'px';
    }

    clamp() {
        if(this._canvas.offsetLeft > 0)
            this._canvas.style.left = '0px';
        else if (this._canvas.offsetLeft < window.innerWidth - this._canvas.scrollWidth)
            this._canvas.style.left = (window.innerWidth - this._canvas.scrollWidth) + 'px';
        if(this._canvas.offsetTop > 0)
            this._canvas.style.top = '0p';
        else if (this._canvas.offsetTop < window.innerHeight - this._canvas.scrollHeight)
            this._canvas.style.top = (window.innerHeight - this._canvas.scrollHeight) + 'px';
    }

    clear() {
        this.context.clearRect(0, 0, this.context.canvas.scrollWidth, this.context.canvas.scrollHeight);
    }

    get canvas() { return this._canvas }
    get context() { return this._canvas.getContext('2d') }

    _mouseDrag(e) {
        const canvas = this._canvas;

        let csX = e.clientX;
        let csY = e.clientY;

        canvas.onmouseup = stopDrag;
        canvas.onmousemove = startDrag;

        function startDrag(e) {
            let ceX = e.clientX;
            let ceY = e.clientY;

            let canvasOffsetX = canvas.offsetLeft;
            let canvasOffsetY = canvas.offsetTop;
            canvasOffsetX += ceX-csX;
            canvasOffsetY += ceY-csY;
            csX = ceX;
            csY = ceY;
            
            if(canvasOffsetX > 0)
                canvasOffsetX = 0;
            else if (canvasOffsetX < window.innerWidth - canvas.scrollWidth)
                canvasOffsetX = window.innerWidth - canvas.scrollWidth;
            if(canvasOffsetY > 0)
                canvasOffsetY = 0;
            else if (canvasOffsetY < window.innerHeight - canvas.scrollHeight)
                canvasOffsetY = window.innerHeight - canvas.scrollHeight;

            canvas.style.left = canvasOffsetX + 'px';
            canvas.style.top = canvasOffsetY + 'px';
        }

        function stopDrag() {
            canvas.onmousemove = null;
            canvas.onmouseup = null;
        }
    }

    _drag(e) {
        let csX = e.targetTouches[0].clientX;
        let csY = e.targetTouches[0].clientY;

        this._canvas.ontouchend = touchEnd;
        this._canvas.ontouchmove = touchMove;

        function touchMove(e) {
            let ceX = e.targetTouches[0].clientX;
            let ceY = e.targetTouches[0].clientY;

            let canvasOffsetX = this.offsetLeft;
            let canvasOffsetY = this.offsetTop;
            canvasOffsetX += ceX-csX;
            canvasOffsetY += ceY-csY;
            csX = ceX;
            csY = ceY;
            
            if(canvasOffsetX > 0)
                canvasOffsetX = 0;
            else if (canvasOffsetX < window.innerWidth - this.scrollWidth)
                canvasOffsetX = window.innerWidth - this.scrollWidth;
            if(canvasOffsetY > 0)
                canvasOffsetY = 0;
            else if (canvasOffsetY < window.innerHeight - this.scrollHeight)
                canvasOffsetY = window.innerHeight - this.scrollHeight;

            this.style.left = canvasOffsetX + 'px';
            this.style.top = canvasOffsetY + 'px';
        }
        function touchEnd() {
            this.ontouchmove = null;
            this.ontouchend = null;
        }
    }
});