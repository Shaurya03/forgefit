const supportsHover =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    borderRadius: 10,
    borderColor: state.isFocused
      ? "var(--primary)"
      : "var(--border)",
    backgroundColor: "var(--background)",
    boxShadow: "none",
    cursor: "pointer",
    transition: "all .15s ease",

    ...(supportsHover && {
      "&:hover": {
        borderColor: "var(--primary)"
      }
    })
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 12px"
  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--text-primary)"
  }),

  indicatorSeparator: () => ({
    display: "none"
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? "var(--primary)"
      : "var(--text-secondary)",

    ...(supportsHover && {
      "&:hover": {
        color: "var(--primary)"
      }
    })
  }),

  menu: (base) => ({
    ...base,
    marginTop: 6,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)"
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 10000
  }),

  menuList: (base) => ({
    ...base,
    padding: 4,
    backgroundColor: "var(--surface)",
    scrollbarWidth: "none",
    msOverflowStyle: "none"
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    cursor: "pointer",

    backgroundColor: state.isSelected
      ? "var(--primary)"
      : (state.isFocused && supportsHover)
        ? "var(--surface-hover)"
        : "var(--surface)",

    color: state.isSelected
      ? "white"
      : "var(--text-primary)",

    transition: "all .15s ease",

    "&:active": {
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : "var(--surface-hover)"
    }
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--text-secondary)"
  }),

  input: (base) => ({
    ...base,
    color: "var(--text-primary)"
  }),
};