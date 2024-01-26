import { useNavigate } from "react-router-dom";

export const useCancelNavigate = (path) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(path);
  };

  return handleCancel;
};
