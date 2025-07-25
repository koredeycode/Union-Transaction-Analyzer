import { useState } from "react";
// import html2canvas from "html2canvas";

import BasicMetricsCard from "./cards/BasicMetricsCard";
import TemporalActivityCard from "./cards/TemporalActivityCard";
import ChainUsageCard from "./cards/ChainUsageCard";
import PopularRoutesCard from "./cards/PopularRoutesCard";
import TokenUsageCard from "./cards/TokenUsageCard";
import SummaryCard from "./cards/SummaryCard";
import FinalCard from "./cards/FinalCard";
import type { TransferAnalysisResult } from "../types";

// const STORY_DURATION = 5000;

interface CarouselProps {
  analysis: TransferAnalysisResult;
  onRestart: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ analysis, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const slides = [
    <BasicMetricsCard
      key="basic"
      total={analysis.basic.total}
      uniqueChains={analysis.basic.uniqueChains}
      duration={{
        label: `${analysis.basic.durationDays} days`,
        range: `${new Date(
          analysis.basic.timeRange.from
        ).toDateString()} - ${new Date(
          analysis.basic.timeRange.to
        ).toDateString()}`,
      }}
      success={analysis.basic.completed}
      pending={analysis.basic.pending}
      failed={analysis.basic.failed}
    />,
    <TemporalActivityCard
      key="temporal"
      weekdayData={analysis.temporal.weekdayData}
      monthlyData={analysis.temporal.monthlyData}
      total={analysis.basic.total}
    />,
    <ChainUsageCard
      key="chains"
      sourceChains={analysis.chains.topSource}
      destinationChains={analysis.chains.topDestination}
      total={analysis.basic.total}
    />,
    <PopularRoutesCard key="routes" routes={analysis.routes} />,
    <TokenUsageCard
      key="tokens"
      tokens={analysis.tokens}
      total={analysis.basic.total}
    />,
    <SummaryCard
      key="summary"
      total={analysis.summary.total}
      uniqueChains={analysis.summary.uniqueChains}
      topDay={analysis.summary.topDay}
      topMonth={analysis.summary.topMonth}
      topRoute={analysis.summary.topRoute}
      topToken={analysis.summary.topToken}
    />,
    <FinalCard
      total={analysis.summary.total}
      uniqueChains={analysis.basic.uniqueChains}
      topRoute={analysis.summary.topRoute}
      topToken={analysis.summary.topToken}
      days={analysis.basic.durationDays}
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
    <div className="relative w-full max-w-4xl mx-auto px-4 animate-view-in p-4">
      <h3 className="text-lg font-bold mb-2 text-center text-[var(--text-primary)]">
        Your Union Story
      </h3>

      {/* Progress Indicators */}
      <div
        className="mb-2 h-1 w-full max-w-sm mx-auto flex space-x-1"
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
            } relative md:m-4 p-3 glass-effect rounded-xl capture-card`}
          >
            {slide}
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
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
      <div className="pt-2">
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
