import React, { useState, useEffect } from "react";
import "./ScrollToTop.css";
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi vị trí cuộn và hiển thị/ẩn nút Scroll to Top
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Cuộn lên đầu trang khi nút được nhấn
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      <img
        className="scroll-to-top-img"
        src="https://static.thenounproject.com/png/691751-200.png"
        alt="scroll"
      />
    </div>
  );
}

export default ScrollToTop;
