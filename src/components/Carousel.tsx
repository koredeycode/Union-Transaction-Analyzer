import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

import BasicMetricsCard from "./cards/BasicMetricsCard";
import TemporalActivityCard from "./cards/TemporalActivityCard";
import ChainUsageCard from "./cards/ChainUsageCard";
import PopularRoutesCard from "./cards/PopularRoutesCard";
import TokenUsageCard from "./cards/TokenUsageCard";
import SummaryCard from "./cards/SummaryCard";
import type { TransferAnalysisResult } from "../types";

const STORY_DURATION = 5000;

interface CarouselProps {
  slideData: TransferAnalysisResult;
  onRestart: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ slideData, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAuto, setIsAuto] = useState<boolean>(true);
  const intervalRef = useRef<any>(null);

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
  ];

  useEffect(() => {
    if (isAuto) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((i) => (i + 1 < slides.length ? i + 1 : i));
      }, STORY_DURATION);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isAuto, slides.length]);

  const showSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAuto(false);
  };

  const handleDownload = (index: number) => {
    const card = document.getElementById(`card-${index}`);
    const isDark = document.documentElement.classList.contains("dark");

    if (!card) return;

    html2canvas(card, {
      background: isDark ? "#0d1117" : "#ffffff",
      useCORS: true,
    }).then((canvas) => {
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const link = document.createElement("a");
      link.download = `card-${index}-chainstory-analysis.png`;
      link.href = image;
      link.click();
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 animate-view-in p-6">
      <h3 className="text-3xl font-bold mb-2 text-center text-[var(--text-primary)]">
        Your Chain Story
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
              style={{ animationDuration: `${STORY_DURATION}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Download Button */}
      <div className="flex justify-end mx-6">
        <button
          onClick={() => handleDownload(currentIndex)}
          className="glass-effect flex items-center gap-2 bg-[var(--card-background)] hover:bg-opacity-80 border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all px-3 py-2 rounded-lg shadow"
        >
          <span className="material-icons-outlined">download</span>
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => showSlide(currentIndex - 1)}
        className={`absolute top-1/2 -translate-y-1/2 left-2 glass-effect rounded-full p-1 z-10 ${
          currentIndex === 0 ? "invisible" : ""
        }`}
      >
        <span className="material-icons-outlined text-[var(--text-primary)]">
          chevron_left
        </span>
      </button>
      <button
        onClick={() => showSlide(currentIndex + 1)}
        className={`absolute top-1/2 -translate-y-1/2 right-2 glass-effect rounded-full p-1 z-10 ${
          currentIndex === slides.length - 1 ? "invisible" : ""
        }`}
      >
        <span className="material-icons-outlined text-[var(--text-primary)]">
          chevron_right
        </span>
      </button>

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
                href="#"
              >
                @korefomo
              </a>
            </p>
          </div>
        ))}
      </div>

      {/* Final Slide Actions */}
      {currentIndex === slides.length - 1 && (
        <div className="px-6 pb-6 pt-4">
          <button
            className="mb-4 w-full bg-slate-800 dark:bg-black hover:bg-slate-700 dark:hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => {
              const tweetText = encodeURIComponent(
                "Check out my on-chain story from @Union_build! 🚀"
              );
              const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
              window.open(tweetUrl, "_blank");
            }}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.205 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Share on X</span>
          </button>
          <button
            className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
            onClick={onRestart}
          >
            Analyze Another Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
