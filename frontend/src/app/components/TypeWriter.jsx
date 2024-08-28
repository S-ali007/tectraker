'use client'

import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

function TypeWriterComponent({
  text,
  duration,
  ease,
  blinkDuration,
  extraclasses,
  isChildren,
}) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    const animation = gsap.timeline().to(element, {
      duration: duration || 2,
      text: text || "",
      ease: ease || "none",
    });

    const child = element.children[0];
    console.log(child, text, isChildren, element, "sadsadsadsadsadsadsaerw");
    let animationChild;
    if (isChildren) {
      animationChild = gsap.timeline().to(child, {
        duration: duration || 2,
        text: text || "",
        ease: ease || "none",
      });
    }

    const handleScroll = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animation.restart();
          animationChild && animationChild.restart();
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleScroll, observerOptions);
    observer.observe(element, child);

    return () => {
      observer.disconnect();
    };
  }, [text, duration, ease, isChildren]);

  return (
    <>
      <div ref={textRef} className={` ${extraclasses}`}></div>
    </>
  );
}

export default TypeWriterComponent;