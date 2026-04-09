import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { assignConfig } from "../../utils/moduleConfigs";

export default function AssignDetail() {
  useDocumentTitle("Assign Item • School Stock Management");
  return <CrudPage config={assignConfig} mode="detail" />;
}
