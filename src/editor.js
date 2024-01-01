import React, { useEffect, useRef, useState } from 'react';
import Header from './header';
import infernoImage from './Assets/inferno.webp';
import smokeImage from './Assets/smoke.png';
import flashImage from './Assets/flash.png';
import grenadeImage from './Assets/grenade.png';
import molotovImage from './Assets/molly.png';
import decoyImage from './Assets/decoy.png';

function utilityImage(type) {
  const canvas = document.getElementById('draw-canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const x = Math.random() * width;
  const y = Math.random() * height;

  let image;

  switch (type) {
    case 'smoke':
      image = smokeImage;
      break;
    case 'flash':
      image = flashImage;
      break;
    case 'grenade':
      image = grenadeImage;
      break;
    case 'molotov':
      image = molotovImage;
      break;
    case 'decoy':
      image = decoyImage;
      break;
    default:
      image = null;
      break;
  }

  if (image) {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, x, y);

      let isDragging = false;
      let offsetX, offsetY;

      img.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.offsetX - x;
        offsetY = e.offsetY - y;
      });

      img.addEventListener('mousemove', (e) => {
        if (isDragging) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, e.offsetX - offsetX, e.offsetY - offsetY);
        }
      });

      img.addEventListener('mouseup', () => {
        isDragging = false;
      });

      img.addEventListener('mouseout', () => {
        isDragging = false;
      });
    };
  }
}


// App.js
function App() {
  const canvasRef = useRef(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const mapImage = document.getElementById('map-image');
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
  }, [canvasRef]);

  const addNote = (e) => {
    e.preventDefault();
    const inputText = e.target.noteText.value;

    if (inputText.trim() !== '') {
      setNotes([...notes, inputText]);
      e.target.reset();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  };

  return (
    <div>
      <Header />
      <div className="app-container">
        <aside className="left-column">
          <h1>
            <button className="map-select">Map</button>
          </h1>
          <div className="column-block">
            <h1>Objects</h1>
            <br></br>
            <button className="smoke" onClick={() => utilityImage('smoke')}>
            </button>
            <button className="flash" onClick={() => utilityImage('flash')}>
            </button>
            <button className="grenade" onClick={() => utilityImage('grenade')}>
            </button>
            <button className="molotov" onClick={() => utilityImage('molotov')}>
            </button>
            <button className="decoy" onClick={() => utilityImage('decoy')}>
            </button>
          </div>
          <div className="column-block">
            <h1>Tools</h1>
            <br></br>
            <button className="erase" onClick={clearCanvas}>
              Erase All
            </button>
          </div>
        </aside>
        <div className="map-container">
          <img
            id="map-image"
            src={infernoImage}
            alt="Map"
            className="map-content"
            onMouseDown={(e) => e.preventDefault()}
          />
          <canvas
            id="draw-canvas"
            ref={canvasRef}
            className="map-content"
            style={{ position: 'absolute', top: 0, left: 0 }}
          ></canvas>
        </div>
        <div>
          <header>
            <nav>
              <button>Pro/Con</button>
              <button>Execution</button>
              <button>Line-ups</button>
            </nav>
          </header>

          <div className="notes-section">
            {notes.map((note, index) => (
              <div className="note" key={index}>
                {note}
              </div>
            ))}
            <form onSubmit={addNote}>
              <input
                type="text"
                name="noteText"
                placeholder="Type your note..."
              />
              <button type="submit">Add Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
