import { useState } from "react";
// import html2canvas from "html2canvas";

import BasicMetricsCard from "./cards/BasicMetricsCard";
import TemporalActivityCard from "./cards/TemporalActivityCard";
import ChainUsageCard from "./cards/ChainUsageCard";
import PopularRoutesCard from "./cards/PopularRoutesCard";
import TokenUsageCard from "./cards/TokenUsageCard";
import SummaryCard from "./cards/SummaryCard";
import type { TransferAnalysisResult } from "../types";
import FinalCard from "./cards/FinalCard";

// const STORY_DURATION = 5000;

interface CarouselProps {
  slideData: TransferAnalysisResult;
  onRestart: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ slideData, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const slides = [
    <BasicMetricsCard
      key="basic"
      total={slideData.basic.total}
      uniqueChains={slideData.basic.uniqueChains}
      duration={{
        label: `${slideData.basic.durationDays} days`,
        range: `${new Date(
          slideData.basic.timeRange.from
        ).toDateString()} - ${new Date(
          slideData.basic.timeRange.to
        ).toDateString()}`,
      }}
      success={slideData.basic.completed}
      failed={slideData.basic.pending}
    />,
    <TemporalActivityCard
      key="temporal"
      weekdayData={slideData.temporal.weekdayData}
      monthlyData={slideData.temporal.monthlyData}
      total={slideData.basic.total}
    />,
    <ChainUsageCard
      key="chains"
      sourceChains={slideData.chains.topSource}
      destinationChains={slideData.chains.topDestination}
      total={slideData.basic.total}
    />,
    <PopularRoutesCard key="routes" routes={slideData.routes} />,
    <TokenUsageCard
      key="tokens"
      tokens={slideData.tokens}
      total={slideData.basic.total}
    />,
    <SummaryCard
      key="summary"
      total={slideData.summary.total}
      uniqueChains={slideData.summary.uniqueChains}
      topDay={slideData.summary.topDay}
      topMonth={slideData.summary.topMonth}
      topRoute={slideData.summary.topRoute}
      topToken={slideData.summary.topToken}
    />,
    <FinalCard
      total={slideData.summary.total}
      uniqueChains={slideData.basic.uniqueChains}
      topRoute={slideData.summary.topRoute}
      topToken={slideData.summary.topToken}
      days={slideData.basic.durationDays}
      onRestart={onRestart}
    />,
  ];

  const showSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // const handleDownload = (index: number) => {
  //   const card = document.getElementById(`card-${index}`);
  //   const isDark = document.documentElement.classList.contains("dark");

  //   if (!card) return;

  //   html2canvas(card, {
  //     background: isDark ? "#0d1117" : "#ffffff",
  //     useCORS: true,
  //   }).then((canvas) => {
  //     const image = canvas
  //       .toDataURL("image/png")
  //       .replace("image/png", "image/octet-stream");

  //     const link = document.createElement("a");
  //     link.download = `card-${index}-chainstory-analysis.png`;
  //     link.href = image;
  //     link.click();
  //   });
  // };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 animate-view-in p-6">
      <h3 className="text-3xl font-bold mb-2 text-center text-[var(--text-primary)]">
        Your Union Story
      </h3>

      {/* Progress Indicators */}
      <div
        className="mb-4 h-1 w-full max-w-sm mx-auto flex space-x-1"
        id="carousel-indicators"
      >
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 bg-slate-200 dark:bg-slate-600 overflow-hidden"
          >
            <div
              className={`h-1 rounded-full bg-[var(--accent)] transition-all duration-500 ${
                i < currentIndex
                  ? "w-full"
                  : i === currentIndex
                  ? "animate-story-progress-bar"
                  : "w-0"
              }`}
              // style={{ animationDuration: `${STORY_DURATION}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Download Button */}
      {/* <div className="flex justify-end mx-6">
        <button
          onClick={() => handleDownload(currentIndex)}
          className="glass-effect flex items-center gap-2 bg-[var(--card-background)] hover:bg-opacity-80 border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all px-3 py-2 rounded-lg shadow"
        >
          <span className="material-icons-outlined">download</span>
        </button>
      </div> */}

      {/* Slide Cards */}
      <div className="relative overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            id={`card-${idx}`}
            className={`carousel-item ${
              idx === currentIndex ? "active" : "hidden"
            } relative md:m-4 md:p-6 p-3 glass-effect rounded-xl capture-card`}
          >
            {slide}
            <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
              designed by{" "}
              <a
                className="font-semibold text-[var(--accent)] hover:underline"
                href="https://twitter.com/intent/follow?screen_name=korefomo"
                target="_blank"
                rel="noopener noreferrer"
              >
                @korefomo
              </a>
            </p>
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <div className="pt-4">
        <button
          onClick={() => showSlide(currentIndex - 1)}
          className={`rounded-full p-1 z-10 ${
            currentIndex === 0 ? "invisible" : ""
          }`}
        >
          <span className="material-icons-outlined text-3xl text-[var(--text-primary)]">
            chevron_left
          </span>
        </button>
        <button
          onClick={() => showSlide(currentIndex + 1)}
          className={`rounded-full p-1 z-10 ${
            currentIndex === slides.length - 1 ? "invisible" : ""
          }`}
        >
          <span className="material-icons-outlined text-3xl text-[var(--text-primary)]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
