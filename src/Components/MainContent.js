import React, { useRef, useState, useEffect } from 'react';
import infernoImage from '../Assets/infernoMap.png';
import StrategyBox from './StrategyBox';
import { handleFileChange } from '../Utils/dataUtil';


const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [dragObject, setDragObject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null); // Variable for background image (Currently only inferno.. for now)

  let drawMode = true;
  
  // Load the image when the component mounts
  useEffect(() => {
    const img = new Image();
    img.src = 'your_image_url.jpg'; // Replace 'your_image_url.jpg' with the actual image URL
    img.onload = () => {
      setBackgroundImage(img);
    };
  }, []);
 
const saveCanvas = () => {
  const jsonObjects = JSON.stringify(objects);
  const blob = new Blob([jsonObjects], { type: 'application/json' });
  const url = URL.createObjectURL(blob);


  const link = document.createElement('a');
  link.href = url;
  link.download = 'canvas_objects.json';
  document.body.appendChild(link); // Append the link to the body
  link.click();
  document.body.removeChild(link); // Clean up by removing the link from the body
};
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;


    if (drawMode === true) {
      setIsDrawing(true);
    } else{
      setIsErasing(true);
    }
    
    let objectClicked = null;


    // Check if an object is clicked for dragging
    objects.forEach((obj) => {
      if (
        mouseX >= obj.x &&
        mouseX <= obj.x + obj.width &&
        mouseY >= obj.y &&
        mouseY <= obj.y + obj.height
      ) {
        objectClicked = obj;
      }
    });


    setDragObject(objectClicked);
  };


  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;


    if (isDrawing && !isErasing && !dragObject) {
      // Drawing functionality
      ctx.fillStyle = 'black';
      ctx.fillRect(mouseX, mouseY, 6, 6);
      setObjects([...objects, { x: mouseX, y: mouseY, width: 6, height: 6, color: 'black' }]);
    }
    if (isErasing && !isDrawing && !dragObject) {
      // Erasing functionality
      const updatedObjects = objects.filter(obj => {
        const isInEraserRange =
          mouseX >= obj.x &&
          mouseX <= obj.x + obj.width &&
          mouseY >= obj.y &&
          mouseY <= obj.y + obj.height;
  
        return !isInEraserRange;
      });
  
      setObjects(updatedObjects);
  
      // Clear the erased area on the canvas
      ctx.clearRect(mouseX, mouseY, 40, 40);
    }

    if (dragObject) {
      // Dragging functionality
      dragObject.x = mouseX - dragObject.width / 2;
      dragObject.y = mouseY - dragObject.height / 2;
      redrawCanvas();
    }
  };


  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsErasing(false);
    setDragObject(null);
  };
  const toggleDrawMode = () => {
    drawMode = !drawMode;
  };

  
  const spawnObject = (x, y, width, height, color) => {
    setObjects([...objects, { x, y, width, height, color }]);
    redrawCanvas();
  };
  const canvasWidth = 800;
  const canvasHeight = 800;
// Assigns random position on utility button click, maps appropriate colors, then finally handUtilityButtonClick function underneath
  const getRandomPosition = (max) => Math.floor(Math.random() * max); //Just looked, probably never defined a value for max lmao
  const getColorForUtility = (utilityType) => {
    switch (utilityType) {
      case 'smoke':
        return 'grey';
      case 'flash':
        return 'yellow';
      case 'grenade':
        return 'green';
      case 'molotov':
        return 'red';
      case 'decoy':
        return 'blue';
      default:
        return 'black'; // Default color or handle unknown utility types
    }
  };
  const handleUtilityButtonClick = (utilityType) => {
    const x = getRandomPosition(canvasWidth);
    const y = getRandomPosition(canvasHeight);
    const width = 50;  // Adjust as needed !!!Currently square
    const height = 50; // Adjust as needed !!!Currently square
    const color = getColorForUtility(utilityType); // Colors defined in function above
    spawnObject(x, y, width, height, color, utilityType);
  };
 
  useEffect(() => {
    const redrawCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      }
 
      objects.forEach((obj) => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      });
    };
 
    redrawCanvas();
  }, [backgroundImage, objects]);


  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj) => {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
  };

  const clearCanvas = () => {
    setObjects([]); // Clear the objects array
    redrawCanvas();
  };
 
  return (
    <div className='main-content'>
      <div className='utility-container'>
        <button onClick={() => handleUtilityButtonClick('smoke')}>Smoke</button>
        <button onClick={() => handleUtilityButtonClick('flash')}>Flash</button>
        <button onClick={() => handleUtilityButtonClick('grenade')}>Grenade</button>
        <button onClick={() => handleUtilityButtonClick('molotov')}>Molotov</button>
        <button onClick={() => handleUtilityButtonClick('decoy')}>Decoy</button>
        <button onClick={() => console.log(objects)}> Data log</button>
        <button onClick={toggleDrawMode}> Eraser </button>
      </div>
  
      <div className='canvas-and-strategy-container' style={{ display: 'flex' }}>
        <div className='canvas-container' style={{ position: 'relative' }}>
          <img
            id="map-image"
            src={infernoImage}
            alt="Map"
            onMouseDown={(e) => e.preventDefault()}
            style={{ position: 'absolute', top: 0, left: 0, width: '800px', height: '800px' }}
          />
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: 'absolute', top: 0, left: 0, width: '800px', height: '800px' }}
          />
          <button onClick={saveCanvas} style={{ position: 'absolute', top: 0, left: 0 }}>
            Save Play
          </button>
          <button onClick={clearCanvas} style={{ position: 'absolute', top: 50, left: 0 }}>
            Clear Canvas
          </button>
          <input
             type="file"
             accept=".json"
             onChange={(e) => handleFileChange(e, setObjects)}
             style={{ position: 'absolute', top: 100, left: 0 }}
          />
        </div>
        <StrategyBox />
      </div>
    </div>
  );
};


export default Canvas;