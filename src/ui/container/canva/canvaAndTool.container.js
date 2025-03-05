import './canvaTool.container.css';
import canvaToolHtml from './canvaTool.container.html?raw';


class PaintBucketCanvas {
   constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.tolerance = 30;
   }

   paintBucket = (x, y) => {
      // Obtener el color del píxel clickeado
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;

      const startColor = this.getPixelColor(data, x, y);
      const fillColor = this.hexToRGBA(this.canvas.getColor());

      if (!this.isSameColor(startColor, fillColor, this.tolerance)) {
         this.floodFill(data, x, y, startColor, fillColor);
         this.ctx.putImageData(imageData, 0, 0);
      }
   };

   getPixelColor(data, x, y) {
      const index = (y * this.canvas.width + x) * 4;
      return [data[index], data[index + 1], data[index + 2], data[index + 3]];
   }

   setPixelColor(data, x, y, color) {
      const index = (y * this.canvas.width + x) * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];
   }

   isSameColor(c1, c2, tolerance) {
      return (
         Math.abs(c1[0] - c2[0]) <= tolerance &&
         Math.abs(c1[1] - c2[1]) <= tolerance &&
         Math.abs(c1[2] - c2[2]) <= tolerance &&
         Math.abs(c1[3] - c2[3]) <= tolerance
      );
   }

   floodFill(data, x, y, startColor, fillColor) {
      const stack = [[x, y]];
      const visited = new Set();
      const width = this.canvas.width;
      const height = this.canvas.height;

      while (stack.length > 0) {
         const [px, py] = stack.pop();
         const key = `${px},${py}`;

         if (visited.has(key)) continue;
         visited.add(key);

         if (px < 0 || py < 0 || px >= width || py >= height) continue;

         const currentColor = this.getPixelColor(data, px, py);
         if (!this.isSameColor(currentColor, startColor, this.tolerance)) continue;

         this.setPixelColor(data, px, py, fillColor);

         stack.push([px + 1, py]);
         stack.push([px - 1, py]);
         stack.push([px, py + 1]);
         stack.push([px, py - 1]);
      }
   }
   hexToRGBA(hex) {
      hex = hex.replace(/^#/, "");
      let bigint = parseInt(hex, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
   }
}


class CustomCanvas extends HTMLCanvasElement {
   MODESDRAW = {
      DRAW: 'draw',
      ERASE: 'erase',
      RECTANGLE: 'rectangle',
      ELLIPSE: 'ellipse',
      PICKER: 'picker',
      SAVE: 'save',
      PAINTBUCKET: 'paintBucket',
   }

   // Variable para saber si el usuario esta dibujando
   constructor(width = 500, height = 300) {
      super();
      this.undoImages = [];
      this.redoImages = [];
      this.className = 'custon-canva';
      this.width = width;
      this.height = height;
      this.isDrawing = false;
      this.startX = 0; // Guarda la cordenadas inicial X 
      this.startY = 0; // Guarda la cordenadas inicial Y 
      this.lastX = 0; // Guarda la cordenadas final X
      this.lastY = 0; // Guarda la cordenadas final Y
      this.modesDraw = this.MODESDRAW.DRAW;


      // retorna un objeto CanvasRenderingContext2D que representa un contexto de renderizado de dos dimensiones.
      this.ctx = this.getContext('2d');
      this.paintBucketCanvas = new PaintBucketCanvas(this, this.ctx);

      // inicializamos los eventos
      this.initEvent();

      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = '#000000';
      this.ctx.fillStyle = '#000000';
   }

   connectedCallback() {
   }

   initEvent() {
      this.addEventListener("mousedown", this.startDrawing);
      this.addEventListener("mousemove", this.draw);
      this.addEventListener("dblclick", this.paintBucketdraw);
      this.addEventListener("mouseup", this.stopDrawing); // cuando se suelta
      this.addEventListener("mouseleave", this.stopDrawing); // cuando se sale
      window.addEventListener('keydown', this.handleKeyDown);

      this.addEventListener("touchstart", this.startDrawingTouch);
      this.addEventListener("touchmove", this.drawTouch);
      this.addEventListener("touchend", this.stopDrawing);
      this.addEventListener("touchcancel", this.stopDrawing);
   }
   disconnectedCallback() {
      this.removeEventListener("mousedown", this.startDrawing);
      this.removeEventListener("mousemove", this.draw);
      this.removeEventListener("dblclick", this.paintBucketdraw);
      this.removeEventListener("mouseup", this.stopDrawing); // cuando se suelta
      this.removeEventListener("mouseleave", this.stopDrawing); // cuando se sale
      window.removeEventListener('keydown', this.handleKeyDown);
   }

   paintBucketdraw = (e) => {
      if (this.MODESDRAW.PAINTBUCKET === this.modesDraw)
         this.paintBucketCanvas.paintBucket(e.offsetX, e.offsetY);
   }

   // Cunado el mause se pulsa, la funcion se ejecuta para iniciar el dibujo
   startDrawing = (e) => {
      if (!this.ctx) return;
      this.isDrawing = true;
      // Cordenadas iniciales
      [this.startX, this.startY] = [e.offsetX, e.offsetY];
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY];

      this.#appendHistoryImage(this.ctx.getImageData(0, 0, this.width, this.height));
      this.redoImages = [];
   }

   // Cuando el mause se mueve, la funcion se ejecuta para dibujar
   draw = (e) => {
      if (!this.isDrawing) return;
      switch (this.modesDraw) {
         case this.MODESDRAW.DRAW:
         case this.MODESDRAW.ERASE:
            // Comienza el dibujo
            this.ctx.beginPath();

            // Mover el trazo a las cordenadas iniciales
            this.ctx.moveTo(this.lastX, this.lastY);

            // Dibujar
            this.ctx.lineTo(e.offsetX, e.offsetY);

            this.ctx.stroke();
            // Guardar las cordenadas finales
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            break;
         default:
            break;
      }
   }

   startDrawingTouch = (e) => {
      e.preventDefault(); // Evita el desplazamiento de la pantalla
      if (!this.ctx) return;
      this.isDrawing = true;

      const touch = e.touches[0]; // Obtener el primer toque
      const { x, y } = this.getTouchPos(touch);

      [this.startX, this.startY] = [x, y];
      [this.lastX, this.lastY] = [x, y];

      this.#appendHistoryImage(this.ctx.getImageData(0, 0, this.width, this.height));
      this.redoImages = [];
   };

   drawTouch = (e) => {
      e.preventDefault();
      if (!this.isDrawing) return;
      switch (this.modesDraw) {
         case this.MODESDRAW.DRAW:
         case this.MODESDRAW.ERASE:

            const touch = e.touches[0];
            const { x, y } = this.getTouchPos(touch);

            // Comienza el dibujo
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            [this.lastX, this.lastY] = [x, y];
            break;
         default:
            break;
      }
   };
   getTouchPos = (touch) => {
      const rect = this.getBoundingClientRect();
      return {
         x: touch.clientX - rect.left,
         y: touch.clientY - rect.top
      };
   };

   // Cuando el mause se suelta, la funcion se ejecuta para parar el dibujo
   stopDrawing = (e) => {
      this.isDrawing = false;
      if (this.ctx) {
         this.ctx.closePath();
      }
   }

   handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
         this.undo();
      }
      if (e.ctrlKey && e.key === 'y') {
         this.redo();
      }
   }

   setImage(imageData) {
      this.ctx.putImageData(imageData, 0, 0);
   }

   #appendHistoryImage(imageData) {
      if (this.undoImages.length > 10) {
         this.undoImages.shift()
      }
      this.undoImages.push(imageData)
   }

   undo() {
      if (this.undoImages.length === 0) return;
      // Mover el estado actual a redoImages antes de deshacer
      this.redoImages.push(this.ctx.getImageData(0, 0, this.width, this.height));

      // Restaurar el estado anterior
      this.setImage(this.undoImages.pop());
   }

   redo() {
      if (this.redoImages.length === 0) return;
      // Mover el estado actual a undoImages antes de rehacer
      this.undoImages.push(this.ctx.getImageData(0, 0, this.width, this.height));

      // Restaurar el estado siguiente
      this.setImage(this.redoImages.pop());
   }

   deleteDrawing() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.redoImages = [];
      this.undoImages = [];
   }

   changeColor(color) {
      if (!color) return;
      this.ctx.strokeStyle = color;
   }

   getColor() {
      return this.ctx.strokeStyle
   }

   setSizeLine(size) {
      this.ctx.lineWidth = size
   }

   setMode(node) {
      this.modesDraw = node
      switch (this.modesDraw) {
         case this.MODESDRAW.DRAW:
            this.style.cursor = `url('icon/pencil.svg') 0 24, auto`;
            this.ctx.globalCompositeOperation = 'source-over';
            break;

         case this.MODESDRAW.ERASE:
            this.style.cursor = `url('icon/eraser.svg') 10 15, auto`;
            this.ctx.globalCompositeOperation = 'destination-out';
            break;
         case this.MODESDRAW.PAINTBUCKET:
            this.style.cursor = `url('icon/paint-bucket.svg') 10 15, auto`;
            break
         default:
            break;
      }
   }
}

customElements.define("custom-canvas", CustomCanvas, { extends: "canvas" });


class CanvasAndToolsRender {
   /**
    * @param {HTMLElement} elementParent 
    */
   static brushSize(elementParent) {
      const childres = elementParent.children;
      Array.from(childres).forEach(child => {
         const [size] = child.children;
         size.style.width = `${3 * parseInt(child.getAttribute('data-size'))}px`;
         size.style.height = `${3 * parseInt(child.getAttribute('data-size'))}px`;
      })
   }
}

export class CanvasAndTools extends HTMLDivElement {
   strokeSize = {
      1: 2,
      2: 4,
      3: 8,
      4: 16,
      5: 24,
   }
   strokeTypeSize = {
      pencil: 1,
      eraser: 3,
      brush: 1,
   }

   constructor() {
      super();
      this.className = 'canvas-tools';

      this.innerHTML = canvaToolHtml;
      // this.canvas = new CustomCanvas(680, 460);
      this.canvas = new CustomCanvas(650, 460);
      this.appendChild(this.canvas);

      this.$bt = {
         pencil: this.querySelector('.tool__bt--pencil'),
         eraser: this.querySelector('.tool__bt--eraser'),
         paintBucket: this.querySelector('.tool__bt--paint-bucket'),
         brushSize: this.querySelector('.tool__bt--brush-size'),
         undo: this.querySelector('.tool__bt--undo'),
         delete: this.querySelector('.tool__bt--delete'),
      };
      this.$input = {
         color: this.querySelector('.tool__input-color'),
      }

      this.$brushSizeList = this.querySelector('.brush-size__list');
      CanvasAndToolsRender.brushSize(this.$brushSizeList);

      this.initEvent();
      this.initValue()
      this.resizeCanvas();
   }

   initEvent() {
      this.$bt.delete.addEventListener('click', this.handleDelete);
      this.$bt.brushSize.addEventListener('click', this.handleBrushSize);
      this.$bt.eraser.addEventListener('click', this.handleEraser);
      this.$bt.pencil.addEventListener('click', this.handlePencil);
      this.$bt.undo.addEventListener('click', this.handleUndo);
      this.$bt.paintBucket.addEventListener('click', this.handlePaintBucket);
      this.$input.color.addEventListener('change', this.handleColorChange);
      window.addEventListener("resize", this.resizeCanvas); //*
      document.addEventListener('click', this.handleClickOutside);
   }

   disconnectedCallback() {
      this.$bt.delete.removeEventListener('click', this.handleDelete);
      this.$bt.brushSize.removeEventListener('click', this.handleBrushSize);
      this.$bt.eraser.removeEventListener('click', this.handleEraser);
      this.$bt.pencil.removeEventListener('click', this.handlePencil);
      this.$bt.undo.removeEventListener('click', this.handleUndo);
      this.$bt.paintBucket.removeEventListener('click', this.handlePaintBucket);
      this.$input.color.removeEventListener('change', this.handleColorChange);
      window.removeEventListener("resize", this.resizeCanvas); //*
      document.removeEventListener('click', this.handleClickOutside);
   }

   initValue() {
      this.$input.color.parentElement.style.backgroundColor = this.canvas.getColor();
      this.toggleActiveBt(this.$bt.pencil);
      this.canvas.setMode(this.canvas.MODESDRAW.DRAW);
   }

   /**
    * @param {HTMLElement} elementBt 
    */
   toggleActiveBt(elementBt) {
      Object.values(this.$bt).forEach(bt =>
         bt.classList.toggle('tool__bt--active', bt === elementBt)
      );
   }

   // Manejador de click afuera
   handleClickOutside = (e) => {
      if (this.$bt.brushSize === e.target || this.$brushSizeList === e.target) {
         return
      }
      this.$brushSizeList.classList.remove('brush-size__list--active');
   }

   handleDelete = () => {
      this.canvas.deleteDrawing();
   }

   handleColorChange = (e) => {
      const element = e.currentTarget;
      this.canvas.changeColor(element.value)
      element.parentElement.style.backgroundColor = element.value;
   }

   handleBrushSize = (e) => {
      const element = e.target;

      const handleValueSize = (valueSize) => {
         if (this.canvas.modesDraw === this.canvas.MODESDRAW.DRAW)
            this.strokeTypeSize.pencil = valueSize;

         if (this.canvas.modesDraw === this.canvas.MODESDRAW.ERASE)
            this.strokeTypeSize.eraser = valueSize;

         this.canvas.setSizeLine(this.strokeSize[valueSize] || 5);
      }

      this.$brushSizeList.classList.add('brush-size__list--active');

      if (element.matches('[data-size]') || element.parentElement.matches('[data-size]')) {
         const valueSize = Number(element.getAttribute('data-size'));
         if (!Number.isInteger(valueSize) || valueSize < 1 || valueSize > 5) return;

         handleValueSize(valueSize);

         Array.from(this.$brushSizeList.children).forEach(child => {
            child.classList.remove('brush-size__item--active');
         });

         (element.tagName === 'LI')
            ? element.classList.add('brush-size__item--active')
            : element.parentElement.classList.add('brush-size__item--active');

         this.updateBrushSizePreview(valueSize);
      }
   }
   handlePencil = (e) => {
      this.setBrushSize(this.canvas.MODESDRAW.DRAW, this.strokeTypeSize.pencil);
      this.toggleActiveBt(e.currentTarget);
   }

   handleEraser = (e) => {
      this.setBrushSize(this.canvas.MODESDRAW.ERASE, this.strokeTypeSize.eraser);
      this.toggleActiveBt(e.currentTarget);
   }

   handleUndo = (e) => {
      this.canvas.undo();
   }

   handlePaintBucket = (e) => {
      this.toggleActiveBt(e.currentTarget);
      this.setBrushSize(this.canvas.MODESDRAW.PAINTBUCKET);
   }

   resizeCanvas = () => {
      if (this.resizeTimeout) {
         cancelAnimationFrame(this.resizeTimeout);
      }
      this.resizeTimeout = requestAnimationFrame(() => {
         this._resizeCanvas();
      });
   };

   _resizeCanvas = () => {
      const isMobile = window.innerWidth < 768; // Definir breakpoint para móviles
      // const newWidth = isMobile ? 320 : window.innerWidth > 1380 ? 690 : 450;
      // const newHeight = isMobile ? 400 : window.innerWidth > 1380 ? 480 : 460;

      if (isMobile) {
         // Si está en móvil, reiniciar el canvas completamente
         this.removeChild(this.canvas);
         this.canvas = new CustomCanvas(320, 330);
         this.appendChild(this.canvas);
      } else {
         // Si no está en móvil, solo cambiar el tamaño sin reinstanciar
         // this.canvas.width = newWidth;
         // this.canvas.height = newHeight;
      }
   };



   setBrushSize(mode, size) {
      this.canvas.setMode(mode);
      this.canvas.setSizeLine(this.strokeSize[size] || 5);
      this.updateBrushSizePreview(size);
   }

   updateBrushSizePreview(size) {
      this.$bt.brushSize.style.setProperty('--brush-size-preview', `${this.strokeSize[size]}px`);
   }
}

if (!customElements.get("canvas-and-tools")) {
   customElements.define("canvas-and-tools", CanvasAndTools, { extends: "div" });
}
