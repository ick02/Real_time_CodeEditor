import React, { useEffect, useRef, useState } from 'react'

const Console = ({output, loading, success, executionTime, memory}) => {
  const [mousedown, setMousedown] = useState(false)
  const [consoleLog, setConsoleLog] = useState(output)
  const panelRef = useRef(null)

  useEffect(() => {
    setConsoleLog(output.split("\n")
      .map((line) => "$ "+ line)
      .join("\n"))
  }, [output, success])

  useEffect(() => {
    const handleMouseMove = (e) => {
      handleResize(e.movementY, e.movementX)
    }

    if (mousedown) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mousedown])

  useEffect(() => {
    const handleMouseUp = () => setMousedown(false)

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleResize = (movementY, movementX) => {
    const panel = panelRef.current;
    if (!panel) return;

    const { height, y } = panel.getBoundingClientRect();

    panel.style.height = `${height - movementY}px`;
    panel.style.top = `${y + movementY}px`
  };

  const handleMouseDown = () => {
    setMousedown(true)
  }

    return (
      <div className="console" ref={panelRef}>
        <div className="consoleBorder" onMouseDown={handleMouseDown}></div>
        <div className={`consoleArea ${!success ? "errorInConsole" : ""}`}>
          {loading && <div className="loader"> ================= </div>}
          {consoleLog}
        </div>
        {output.length > 0 && success && !loading && 
          <div>
            {executionTime && <div>Execution Time: {executionTime}&nbsp;s</div>}
            {memory && <div>Memory: {memory}</div>}
          </div>
        }
      </div>
    );
}

export default Console