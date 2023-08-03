import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import Codemirror from "codemirror";
import { toast } from "react-toastify";
import Console from "./Console";
import Input from "./Input";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";

// languages
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/dart/dart";
import "codemirror/mode/go/go";

// themes
import "codemirror/theme/dracula.css";
// import "codemirror/theme/monokai.css";
// import "codemirror/theme/3024-day.css";
// import "codemirror/theme/base16-light.css";

const languages = [
  {
    lang: "C",
    mode: "clike",
    extension: "c",
    value: `#include<stdio.h>
    
int main(){
    printf("Hello World!");
    return 0;
}`,
  },
  {
    lang: "C++",
    mode: "clike",
    extension: "cpp",
    value: `#include<iostream>
    
using namespace std;

int main(){
    cout<<"Hello World"<<endl;
    return 0;
}`,
  },
  {
    lang: "Java",
    mode: "clike",
    extension: "java",
    value: `public class HelloWorld{ 

    public static void main(String[] args){
        System.out.println("Hello World!");
    }
}`,
  },
  {
    lang: "Python",
    mode: "python",
    extension: "py",
    value: `print("Hello World!")`,
  },
  {
    lang: "Javascript",
    mode: "javascript",
    extension: "js",
    value: `console.log("Hello World!")`,
  },
];

const Editor = ({ setClients, setIsLoading }) => {
  const [lang, setLang] = useState(0);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Loading of console output
  const [success, setSuccess] = useState(true);
  const [executionTime, setExecutionTime] = useState(null);
  const [memory, setMemory] = useState(null);

  const location = useLocation();
  const { roomId } = useParams();

  const editor = useRef(null);
  const codeRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      // Socket: Initialization
      socketRef.current = await initSocket();

      setIsLoading(true);

      // Socket: Emit join event
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state.username,
        user_id: location.state.userId,
      });

      // Socket: Listen for Return on code execution
      socketRef.current.on(
        ACTIONS.RETURN,
        ({ success, output, cpuTime, memory }) => {
          if (success) {
            setOutput(output);
            setSuccess(true);
            setExecutionTime(cpuTime);
            setMemory(memory);
          } else {
            setOutput(output.stderr);
            setSuccess(false);
          }
          setLoading(false);
        }
      );

      // Socket: Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ users, currentUser, socketId }) => {
          if (socketId !== socketRef.current.id) {
            toast.success(`${currentUser.username} has joined the room`);
          }
          setClients(users);

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            socketId,
            roomId,
          });

          setIsLoading(false);
        }
      );

      // Socket: Listening for disconnect event
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, user }) => {
        toast.success(`${user.username} has left the room`);
        setClients((prev) => {
          return prev.filter((client) => {
            return client.socketId !== socketId;
          });
        });
      });
    };

    init();

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    function init() {
      editor.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          mode: "clike",
          theme: "dracula",
        }
      );

      editor.current.on("change", (instance, change) => {
        const code = instance.getValue();
        codeRef.current = code;
        if (change.origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            code,
            roomId,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        editor.current.setValue(code);
      });

      socketRef.current.on(ACTIONS.SYNC_CODE, ({ socketId }) => {
        if (socketRef.current.id !== socketId) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            code: codeRef.current,
            roomId,
          });
        }
      });
    }
  }, [socketRef.current]);

  useEffect(() => {
    editor.current.setOption("mode", languages[lang].mode);
    editor.current.setValue(languages[lang].value);

    // console.log(editor.current);
  }, [lang]);

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  const handleRun = () => {
    setOutput("");
    setLoading(true);
    // Socket: Emit Run event
    socketRef.current.emit(ACTIONS.RUN, {
      code: editor.current.getValue(),
      extension: languages[lang].extension,
      input: input,
      roomId,
    });
  };
  return (
    <div className="ide_container">
      <div className="ide_space">
        <div className="editorOptions">
          <div className="language">
            <label htmlFor="lang">Language:</label>

            <select id="lang" onChange={handleLanguageChange}>
              {languages.map((language, idx) => {
                return <option value={idx}>{language.lang}</option>;
              })}
            </select>
          </div>

          <button className="run" onClick={handleRun}>
            ▶️ Run
          </button>
        </div>

        <textarea id="realtimeEditor"></textarea>
        <Console
          output={output}
          loading={loading}
          success={success}
          executionTime={executionTime}
          memory={memory}
        />
      </div>
      <Input setInput={setInput} />
    </div>
  );
};

export default Editor;
