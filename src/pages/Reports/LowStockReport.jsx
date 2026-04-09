import ReportPage from "../../components/common/ReportPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { reportConfigs } from "../../utils/moduleConfigs";

export default function LowStockReport() {
  useDocumentTitle("Low Stock Report • School Stock Management");
  return <ReportPage config={{ ...reportConfigs.lowStock, title: "Low Stock Report" }} />;
}
