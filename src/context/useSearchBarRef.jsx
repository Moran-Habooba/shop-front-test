import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export const useSearchBarRef = () => {
  const searchInput = useRef();
  const location = useLocation();
  useEffect(() => {
    if (searchInput.current) {
      searchInput.current.value = "";
    }
  }, [location]);
  return searchInput;
};
