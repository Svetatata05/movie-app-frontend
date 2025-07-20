type Metric = {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries?: PerformanceEntry[];
};

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
