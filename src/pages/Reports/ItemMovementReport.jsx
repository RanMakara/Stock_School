import ReportPage from "../../components/common/ReportPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { reportConfigs } from "../../utils/moduleConfigs";

export default function ItemMovementReport() {
  useDocumentTitle("Item Movement Report • School Stock Management");
  return <ReportPage config={{ ...reportConfigs.movement, title: "Item Movement Report" }} />;
}
