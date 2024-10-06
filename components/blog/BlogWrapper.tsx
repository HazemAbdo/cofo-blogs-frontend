"use client";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import React, { useEffect } from "react";

const BlogWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default BlogWrapper;
