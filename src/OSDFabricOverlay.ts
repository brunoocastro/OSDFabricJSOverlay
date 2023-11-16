import { fabric } from "fabric";
import OpenSeadragon from "openseadragon";
import { FabricOverlayOptions } from "./overlay";

export class FabricOverlay {
  private _viewer: OpenSeadragon.Viewer;
  private _id: string;
  private _containerWidth: number;
  private _containerHeight: number;
  private _canvasDiv: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _fabricCanvas: fabric.StaticCanvas | fabric.Canvas;
  private _scale: number = 1000; // !TODO -> Validar de onde vem esse dado

  constructor(
    viewer: OpenSeadragon.Viewer,
    { staticCanvas, fabricCanvasOptions, scale }: FabricOverlayOptions
  ) {
    //   fabricCanvasOptions = window.PointerEvent != null;
    this._viewer = viewer;
    this._scale = scale

    this._containerWidth = 0;
    this._containerHeight = 0;

    this._canvasDiv = document.createElement("div");
    this._canvasDiv.style.position = "absolute";
    this._canvasDiv.style.left = "0px";
    this._canvasDiv.style.top = "0px";
    this._canvasDiv.style.width = "100%";
    this._canvasDiv.style.height = "100%";
    this._viewer.canvas.appendChild(this._canvasDiv);

    this._canvas = document.createElement("canvas");

    this._id = "osd-overlaycanvas-" + counter();
    this._canvas.setAttribute("id", this._id);
    this._canvasDiv.appendChild(this._canvas);
    this.resize();

    // make the canvas static if specified, ordinary otherwise
    if (staticCanvas) {
      this._fabricCanvas = new fabric.StaticCanvas(
        this._canvas,
        fabricCanvasOptions
      );
    } else {
      this._fabricCanvas = new fabric.Canvas(this._canvas, fabricCanvasOptions);
    }

    // Disable fabric selection because default click is tracked by OSD
    // this._fabricCanvas.selection = false; // !TODO -> Validar por que não existe

    /**
     * Prevent OSD mousedown on fabric objects
     */
    this._fabricCanvas.on("mouse:down", function (options) {
      if (options.target) {
        // options.e.preventDefaultAction = true; // !TODO -> Validar necessidade
        options.e.preventDefault();
        options.e.stopPropagation();
      }
    });

    /**
     * Prevent OSD mouseup on fabric objects
     */
    this._fabricCanvas.on("mouse:up", function (options) {
      if (options.target) {
        // options.e.preventDefaultAction = true; // !TODO -> Validar necessidade
        options.e.preventDefault();
        options.e.stopPropagation();
      }
    });

    /**
     * Update viewport
     */
    this._viewer.addHandler("update-viewport", function () {
      this.resize();
      this.resizeCanvas();
      this.render();
    });

    /**
     * Resize the fabric.js overlay when the viewer or window changes size
     */
    this._viewer.addHandler("open", function () {
      this.resize();
      this.resizeCanvas();
    });
    window.addEventListener("resize", function () {
      //   this.resize();
      //   this.resizeCanvas();
      console.log("Resize window - Falta implementar");
    });
  }

  canvas() {
    return this._canvas;
  }
  fabricCanvas() {
    // Returns fabric.js canvas that you can add elements to
    return this._fabricCanvas;
  }
  // ----------
  clear() {
    this._fabricCanvas.clear();
  }
  render() {
    this._fabricCanvas.renderAll();
  }
  // ----------
  resize() {
    if (this._containerWidth !== this._viewer.container.clientWidth) {
      this._containerWidth = this._viewer.container.clientWidth;
      this._canvasDiv.setAttribute("width", String(this._containerWidth));
      this._canvas.setAttribute("width", String(this._containerWidth));
    }

    if (this._containerHeight !== this._viewer.container.clientHeight) {
      this._containerHeight = this._viewer.container.clientHeight;
      this._canvasDiv.setAttribute("height", String(this._containerHeight));
      this._canvas.setAttribute("height", String(this._containerHeight));
    }
  }
  resizeCanvas() {
    let origin = new OpenSeadragon.Point(0, 0);
    let viewportZoom = this._viewer.viewport.getZoom(true);
    this._fabricCanvas.setWidth(this._containerWidth);
    this._fabricCanvas.setHeight(this._containerHeight);
    let zoom =
      (this._viewer.viewport.getContainerSize().x * viewportZoom) / this._scale;
    this._fabricCanvas.setZoom(zoom);
    let viewportWindowPoint =
      this._viewer.viewport.viewportToWindowCoordinates(origin);
    let x = Math.round(viewportWindowPoint.x);
    let y = Math.round(viewportWindowPoint.y);
    let canvasOffset = this._canvasDiv.getBoundingClientRect();

    let pageScroll = OpenSeadragon.getPageScroll();

    this._fabricCanvas.absolutePan(
      new fabric.Point(
        canvasOffset.left - x + pageScroll.x,
        canvasOffset.top - y + pageScroll.y
      )
    );
  }
}
