import ReportPage from "../../components/common/ReportPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { reportConfigs } from "../../utils/moduleConfigs";

export default function AssignReport() {
  useDocumentTitle("Assign Report • School Stock Management");
  return <ReportPage config={{ ...reportConfigs.assign, title: "Assign Report" }} />;
}
