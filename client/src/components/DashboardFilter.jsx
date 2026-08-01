import { useState, forwardRef, useRef } from "react";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { reactSelectStyles } from "../styles/reactSelectStyles";
import { Backdrop } from "./Backdrop";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import DashboardCalendarModal from "./DashboardCalendarModal";
import Select from "react-select";
import "./DashboardFilter.css";

const DateButton = forwardRef(({ label, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    className="date-display"
    onClick={onClick}
  >
    {label}
  </button>
));

DateButton.displayName = "DateButton";

function DashboardFilter({
  selectedPeriod,
  onPeriodChange,
  periodLabel,
  onPrevious,
  onNext,
  disableNext,
  customRange,
  setCustomRange
}) {

  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const periodSelectRef = useRef(null);

  const closePeriodMenu = () => {
    setIsPeriodMenuOpen(false);
    periodSelectRef.current?.blur();
  };

  useBackButtonClose(isPeriodMenuOpen, () => setIsPeriodMenuOpen(false));

  const rangeLabel = (() => {
    const { startDate, endDate } = customRange;

    if (!startDate) {
      return "Select Date Range";
    }

    if (!endDate) {
      return `${format(startDate, "dd MMM yyyy")} to ...`;
    }

    return `${format(startDate, "dd MMM yyyy")} - ${format(
      endDate,
      "dd MMM yyyy"
    )}`;
  })();

  const periodOptions = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
    { value: "custom", label: "Custom" }
  ];

  return (
    <div className="dashboard-filter">

      <div className="filter-toolbar">

        <div className="filter-period">

          {isPeriodMenuOpen && (
            <Backdrop
              onClose={closePeriodMenu}
            />
          )}
          <Select
            ref={periodSelectRef}
            options={periodOptions}
            value={periodOptions.find(
              option => option.value === selectedPeriod
            )}
            onChange={option => onPeriodChange(option.value)}
            isSearchable={false}
            menuIsOpen={isPeriodMenuOpen}
            onMenuOpen={() => setIsPeriodMenuOpen(true)}
            onMenuClose={closePeriodMenu}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={reactSelectStyles}
            blurInputOnSelect
          />
        </div>

        {selectedPeriod !== "all" &&
          selectedPeriod !== "custom" && (
            <div className="period-navigation">
              <button
                className="period-nav-btn"
                onClick={onPrevious}
              >
                <FaChevronLeft />
              </button>

              <span className="period-label">
                {periodLabel}
              </span>

              <button
                className="period-nav-btn"
                onClick={onNext}
                disabled={disableNext}
              >
                <FaChevronRight />
              </button>
            </div>
          )}

        {selectedPeriod === "custom" && (
          <div className="period-navigation">

            <DateButton
              label={rangeLabel}
              onClick={() => setIsCalendarOpen(true)}
            />

            <DashboardCalendarModal
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              customRange={customRange}
              setCustomRange={setCustomRange}
            />

          </div>
        )}
      </div>
    </div >
  );
}

export default DashboardFilter;
