"use client";

import { useEffect, useRef } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);
  const constellationProgressRef = useRef(0);

  useEffect(() => {
    const initCanvasAnimations = () => {
      // Create canvases
      const starsCanvas = document.createElement("canvas");
      starsCanvas.className = "stars-canvas";
      Object.assign(starsCanvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "0",
      });
      const starsContainer = document.querySelector(".stars-container");
      if (starsContainer) {
        starsContainer.appendChild(starsCanvas);
      }

      const shootingCanvas = document.createElement("canvas");
      shootingCanvas.className = "shooting-canvas";
      const constellationCanvas = document.createElement("canvas");
      constellationCanvas.className = "constellation-canvas";

      // Copy style properties to other canvases
      [shootingCanvas, constellationCanvas].forEach((canvas) => {
        const starsStyle = starsCanvas.style;
        canvas.style.position = starsStyle.position;
        canvas.style.top = starsStyle.top;
        canvas.style.left = starsStyle.left;
        canvas.style.width = starsStyle.width;
        canvas.style.height = starsStyle.height;
        canvas.style.pointerEvents = starsStyle.pointerEvents;
        canvas.style.zIndex = starsStyle.zIndex;
      });

      const shootingStarsContainer = document.querySelector(
        ".shooting-stars-container"
      );
      if (shootingStarsContainer) {
        shootingStarsContainer.appendChild(shootingCanvas);
      }
      const constellationContainer = document.querySelector(
        ".constellation-container"
      );
      if (constellationContainer) {
        constellationContainer.appendChild(constellationCanvas);
      }

      // Resize handler
      const resizeCanvases = () => {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
        shootingCanvas.width = window.innerWidth;
        shootingCanvas.height = window.innerHeight;
        constellationCanvas.width = window.innerWidth;
        constellationCanvas.height = window.innerHeight;
      };
      resizeCanvases();
      window.addEventListener("resize", resizeCanvases);

      // Star data
      const stars: any[] = [];
      const shootingStars: {
        x: number;
        y: number;
        speed: number;
        size: number;
        tailLength: number;
        delay: number;
        lastTime: number;
        active: boolean;
        color: string;
      }[] = [];
      const constellations: {
        stars: number[];
        connections: number[][];
        pulsePhase: number;
        pulseSpeed: number; // Faster pulse
        drawProgress: number;
        drawSpeed: number; // Faster drawing speed
        connectionProgress: any[];
      }[] = [];
      const starCount = 200; // Increased star count for better constellations
      const shootingStarCount = 20;

      // Initialize twinkling stars (star-shaped)
      const starsCtx = starsCanvas.getContext("2d");
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          size: 0.5 + Math.random() * 1.5, // Smaller stars
          brightness: 0.2 + Math.random() * 0.8,
          speed: 0.05 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
          points: 5 + Math.floor(Math.random() * 3),
          innerRadiusRatio: 0.3 + Math.random() * 0.3,
          rotation: 0,
          rotationSpeed:
            (0.01 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
          id: i,
        });
      }

      // Initialize constellations
      const constellationCtx = constellationCanvas.getContext("2d");

      // Create 5-8 constellations with organic shapes
      const constellationCount = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < constellationCount; i++) {
        // Select 4-6 stars for each constellation (more organic shapes)
        const starIndices = [];
        const starCountInConstellation = 4 + Math.floor(Math.random() * 3);

        // First select a central point
        const centerX = Math.random() * starsCanvas.width;
        const centerY = Math.random() * starsCanvas.height * 0.7;

        // Find stars near this central point
        const nearbyStars = stars
          .map((star, index) => ({ ...star, index }))
          .filter((star) => {
            const dx = star.x - centerX;
            const dy = star.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return (
              distance < Math.min(starsCanvas.width, starsCanvas.height) * 0.25
            );
          })
          .sort((a, b) => {
            const dxA = a.x - centerX;
            const dyA = a.y - centerY;
            const dxB = b.x - centerX;
            const dyB = b.y - centerY;
            return dxA * dxA + dyA * dyA - (dxB * dxB + dyB * dyB);
          });

        // Take the closest stars
        for (
          let j = 0;
          j < Math.min(starCountInConstellation, nearbyStars.length);
          j++
        ) {
          starIndices.push(nearbyStars[j].index);
        }

        // Create organic connections between stars (not geometric shapes)
        const connections = [];
        if (starIndices.length > 1) {
          // Start with a random star
          const startIndex = Math.floor(Math.random() * starIndices.length);
          let currentIndex = startIndex;
          const connectedIndices = [currentIndex];

          // Connect to nearest unconnected stars
          while (connectedIndices.length < starIndices.length) {
            let nearestIndex = -1;
            let nearestDistance = Infinity;

            // Find nearest unconnected star
            for (let j = 0; j < starIndices.length; j++) {
              if (!connectedIndices.includes(j)) {
                const starA = stars[starIndices[currentIndex]];
                const starB = stars[starIndices[j]];
                const dx = starB.x - starA.x;
                const dy = starB.y - starA.y;
                const distance = dx * dx + dy * dy;

                if (distance < nearestDistance) {
                  nearestDistance = distance;
                  nearestIndex = j;
                }
              }
            }

            if (nearestIndex >= 0) {
              connections.push([currentIndex, nearestIndex]);
              connectedIndices.push(nearestIndex);
              currentIndex = nearestIndex;
            } else {
              break;
            }
          }

          // Sometimes add an extra connection to make it more interesting
          if (starIndices.length > 2 && Math.random() > 0.7) {
            const randomPair = [
              Math.floor(Math.random() * starIndices.length),
              Math.floor(Math.random() * starIndices.length),
            ].sort((a, b) => a - b);

            if (randomPair[0] !== randomPair[1]) {
              const exists = connections.some(
                ([a, b]) =>
                  (a === randomPair[0] && b === randomPair[1]) ||
                  (a === randomPair[1] && b === randomPair[0])
              );

              if (!exists) {
                connections.push(randomPair);
              }
            }
          }
        }

        constellations.push({
          stars: starIndices,
          connections,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.006, // Faster pulse
          drawProgress: 0,
          drawSpeed: 0.4 + Math.random() * 0.4, // Faster drawing speed
          connectionProgress: Array(connections.length).fill(0),
        });
      }

      // Initialize shooting stars
      const shootingCtx = shootingCanvas.getContext("2d");
      for (let i = 0; i < shootingStarCount; i++) {
        shootingStars.push({
          x: -100,
          y: Math.random() * starsCanvas.height * 0.3,
          speed: 5 + Math.random() * 10,
          size: 1 + Math.random(),
          tailLength: 30 + Math.random() * 70,
          delay: Math.random() * 10000,
          lastTime: 0,
          active: false,
          color: `hsl(${Math.random() * 60 + 180}, 80%, 70%)`,
        });
      }

      // Draw star shape
      const drawStar = (
        ctx: CanvasRenderingContext2D | null,
        x: number,
        y: number,
        radius: number,
        points: number,
        innerRadiusRatio: number,
        rotation = 0
      ) => {
        if (!ctx) return;
        ctx.beginPath();
        const outerRadius = radius;
        const innerRadius = radius * innerRadiusRatio;

        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points - Math.PI / 2 + rotation;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          ctx.lineTo(
            x + Math.cos(angle) * radius,
            y + Math.sin(angle) * radius
          );
        }

        ctx.closePath();
      };

      // Animation loop
      const animate = (timestamp: number) => {
        animationFrameRef.current = requestAnimationFrame(animate);

        // Clear canvases
        if (starsCtx) {
          starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        }
        if (shootingCtx) {
          shootingCtx.clearRect(
            0,
            0,
            shootingCanvas.width,
            shootingCanvas.height
          );
        }
        if (constellationCtx) {
          constellationCtx.clearRect(
            0,
            0,
            constellationCanvas.width,
            constellationCanvas.height
          );
        }

        // Draw twinkling stars
        stars.forEach((star) => {
          const twinkle =
            0.4 + 0.6 * Math.sin(timestamp * 0.0008 * star.speed + star.phase);
          const currentBrightness = star.brightness * twinkle;

          // Update rotation
          star.rotation += star.rotationSpeed;

          // Glow effect
          if (starsCtx) {
            const gradient = starsCtx.createRadialGradient(
              star.x,
              star.y,
              0,
              star.x,
              star.y,
              star.size * 2
            );
            gradient.addColorStop(
              0,
              `rgba(255, 255, 255, ${currentBrightness * 0.7})`
            );
            gradient.addColorStop(
              0.5,
              `rgba(255, 255, 255, ${currentBrightness * 0.3})`
            );
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            starsCtx.fillStyle = gradient;
            drawStar(
              starsCtx,
              star.x,
              star.y,
              star.size * 2,
              star.points,
              star.innerRadiusRatio,
              star.rotation
            );
            starsCtx.fill();
          }

          // Core star
          const starColor = document.documentElement.classList.contains("dark")
            ? `hsla(200, 80%, 90%, ${currentBrightness})`
            : `hsla(220, 80%, 50%, ${currentBrightness * 0.7})`;

          if (starsCtx) {
            starsCtx.fillStyle = starColor;
            drawStar(
              starsCtx,
              star.x,
              star.y,
              star.size,
              star.points,
              star.innerRadiusRatio,
              star.rotation
            );
            starsCtx.fill();
          }
        });

        // Update constellation progress
        constellationProgressRef.current =
          (constellationProgressRef.current + 0.002) % 100; // Faster progress

        // Draw constellations with sequential line drawing
        constellations.forEach((constellation) => {
          const pulseIntensity =
            0.5 +
            0.5 *
              Math.sin(
                timestamp * constellation.pulseSpeed + constellation.pulsePhase
              );

          // Update drawing progress faster
          constellation.drawProgress = Math.min(
            1,
            constellation.drawProgress + 0.004 * constellation.drawSpeed
          );

          // Draw connections between stars sequentially
          constellation.connections.forEach(
            ([starA, starB]: any, connectionIndex: number) => {
              const star1 = stars[constellation.stars[starA]];
              const star2 = stars[constellation.stars[starB]];

              // Only draw this connection if we've reached its turn
              const connectionStartThreshold =
                connectionIndex / constellation.connections.length;
              if (constellation.drawProgress < connectionStartThreshold) return;

              // Calculate progress for this specific connection (0 to 1)
              const connectionProgress = Math.min(
                1,
                (constellation.drawProgress - connectionStartThreshold) *
                  constellation.connections.length
              );

              constellation.connectionProgress[connectionIndex] = Math.min(
                1,
                constellation.connectionProgress[connectionIndex] + 0.02
              ); // Faster connection progress

              const lineColor = document.documentElement.classList.contains(
                "dark"
              )
                ? `hsla(200, 60%, 80%, ${0.2 + 0.3 * pulseIntensity})`
                : `hsla(220, 60%, 50%, ${0.15 + 0.2 * pulseIntensity})`;

              if (constellationCtx) {
                constellationCtx.strokeStyle = lineColor;
                constellationCtx.lineWidth = 0.8 + pulseIntensity * 0.3;
                constellationCtx.beginPath();

                // Draw line partially based on progress
                if (connectionProgress < 1) {
                  const partialX =
                    star1.x + (star2.x - star1.x) * connectionProgress;
                  const partialY =
                    star1.y + (star2.y - star1.y) * connectionProgress;
                  constellationCtx.moveTo(star1.x, star1.y);
                  constellationCtx.lineTo(partialX, partialY);
                } else {
                  constellationCtx.moveTo(star1.x, star1.y);
                  constellationCtx.lineTo(star2.x, star2.y);
                }

                constellationCtx.stroke();

                // Add subtle dots at connection points
                if (connectionProgress > 0.3) {
                  const dotSize =
                    1.5 * constellation.connectionProgress[connectionIndex];
                  const dotColor = document.documentElement.classList.contains(
                    "dark"
                  )
                    ? `hsla(200, 80%, 90%, ${0.7 * constellation.connectionProgress[connectionIndex]})`
                    : `hsla(220, 80%, 60%, ${0.5 * constellation.connectionProgress[connectionIndex]})`;

                  constellationCtx.fillStyle = dotColor;
                  constellationCtx.beginPath();
                  constellationCtx.arc(
                    star1.x,
                    star1.y,
                    dotSize,
                    0,
                    Math.PI * 2
                  );
                  constellationCtx.fill();

                  if (connectionProgress === 1) {
                    constellationCtx.beginPath();
                    constellationCtx.arc(
                      star2.x,
                      star2.y,
                      dotSize,
                      0,
                      Math.PI * 2
                    );
                    constellationCtx.fill();
                  }
                }
              }
            }
          );
        });

        // Draw shooting stars
        const deltaTime = timestamp - lastUpdateRef.current;
        lastUpdateRef.current = timestamp;

        shootingStars.forEach((star) => {
          if (!star.active && star.delay > 0) {
            star.delay -= deltaTime;
            return;
          }

          star.active = true;
          star.x += star.speed * (deltaTime / 16);
          star.y += star.speed * 0.3 * (deltaTime / 16);

          if (
            star.x > starsCanvas.width + star.tailLength ||
            star.y > starsCanvas.height + star.tailLength
          ) {
            star.x = -star.tailLength;
            star.y = Math.random() * starsCanvas.height * 0.3;
            star.delay = 5000 + Math.random() * 10000;
            star.active = false;
            return;
          }

          // Tail
          if (shootingCtx) {
            const gradient = shootingCtx.createLinearGradient(
              star.x,
              star.y,
              star.x - star.tailLength,
              star.y - star.tailLength * 0.3
            );
            gradient.addColorStop(0, `${star.color.replace(")", ", 0.8)")}`);
            gradient.addColorStop(0.7, `${star.color.replace(")", ", 0.4)")}`);
            gradient.addColorStop(1, `${star.color.replace(")", ", 0)")}`);

            shootingCtx.strokeStyle = gradient;
            shootingCtx.lineWidth = star.size;
            shootingCtx.beginPath();
            shootingCtx.moveTo(star.x, star.y);
            shootingCtx.lineTo(
              star.x - star.tailLength,
              star.y - star.tailLength * 0.3
            );
            shootingCtx.stroke();

            // Head
            const headGradient = shootingCtx.createRadialGradient(
              star.x,
              star.y,
              0,
              star.x,
              star.y,
              star.size * 2
            );
            headGradient.addColorStop(
              0,
              `${star.color.replace(")", ", 0.9)")}`
            );
            headGradient.addColorStop(1, `${star.color.replace(")", ", 0)")}`);

            shootingCtx.fillStyle = headGradient;
            shootingCtx.beginPath();
            shootingCtx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
            shootingCtx.fill();
          }
        });
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("resize", resizeCanvases);
      };
    };

    initCanvasAnimations();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-[#070707] overflow-hidden">
      {/* Canvas containers */}
      <div className="stars-container fixed inset-0 pointer-events-none z-0" />
      <div className="shooting-stars-container fixed inset-0 pointer-events-none z-0" />
      <div className="constellation-container fixed inset-0 pointer-events-none z-0" />

      {/* Main content */}
      {/* <div className="flex relative z-10"> */}
      {/* <div className="flex justify-center w-full text-gray-900 dark:text-white"> */}
      {children}
      {/* </div> */}
      {/* </div> */}

      <div className="">{/* <Footer /> */}</div>

      {/* Global styles */}
      <style jsx global>{`
        .stars-canvas,
        .shooting-canvas,
        .constellation-canvas {
          transition: opacity 0.8s ease;
        }

        :root:not(.dark) .stars-canvas {
          filter: brightness(0.8) saturate(0.7);
        }

        :root:not(.dark) .shooting-canvas,
        :root:not(.dark) .constellation-canvas {
          filter: brightness(0.7);
        }

        .dark .stars-canvas {
          filter: brightness(1.1) contrast(1.2);
        }

        .constellation-canvas {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default Layout;
