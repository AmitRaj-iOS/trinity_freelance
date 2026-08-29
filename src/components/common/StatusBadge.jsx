import Badge from "./Badge";
import { STATUS } from "../../data/properties";

const STATUS_VARIANT = {
  [STATUS.UNDER_CONSTRUCTION]: "navy",
  [STATUS.NEWLY_LAUNCHED]: "brand",
  [STATUS.READY_TO_MOVE]: "mint",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <Badge variant={STATUS_VARIANT[status] || "navy"} className={className}>
      {status}
    </Badge>
  );
}
