import ReportPage from "../../components/common/ReportPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { reportConfigs } from "../../utils/moduleConfigs";

export default function StockReport() {
  useDocumentTitle("Stock Report • School Stock Management");
  return <ReportPage config={{ ...reportConfigs.stock, title: "Stock Report" }} />;
}
