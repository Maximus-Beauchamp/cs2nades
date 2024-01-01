// drawingFunctions.js
export function initializeDrawing(canvasRef, mapImage) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    canvas.width = mapImage.clientWidth;
    canvas.height = mapImage.clientHeight;
  
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
  
    function handleMouseDown(e) {
      if (e.button === 0) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
        e.preventDefault();
      }
    }
  
    function handleMouseMove(e) {
      if (!isDrawing) return;
  
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
  
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }
  
    function handleMouseUp() {
      isDrawing = false;
    }
  
    function handleMouseOut() {
      isDrawing = false;
    }
  
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);
  
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }
  