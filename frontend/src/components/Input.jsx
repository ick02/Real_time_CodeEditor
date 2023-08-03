import React, { useEffect, useRef } from 'react'
import Codemirror from "codemirror";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";

const Input = ({setInput}) => {
    const inputRef = useRef(null)

    useEffect(() => {
        const init = () => {
            inputRef.current = Codemirror.fromTextArea(
              document.getElementById("inputfield"),
              {
                  lineNumbers: true,
                  theme: "darcula",
              }
            );

            inputRef.current.on("change", (instance) => {
                const input = instance.getValue()
                setInput(input)
            });
        }

        init()
    }, [])

  return (
    <div className="input">
      <textarea id="inputfield"></textarea>
    </div>
  );
}

export default Input