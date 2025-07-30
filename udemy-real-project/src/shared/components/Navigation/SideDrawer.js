import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const nodeRef = useRef(null); // Add this line 👈

  const content = (
    <CSSTransition
      nodeRef={nodeRef} // 👈 pass ref here
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside
        ref={nodeRef} // 👈 bind the ref
        className="side-drawer"
        onClick={props.onClick}
      >
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
