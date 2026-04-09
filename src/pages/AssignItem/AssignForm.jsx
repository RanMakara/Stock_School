import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { assignConfig } from "../../utils/moduleConfigs";

export default function AssignForm() {
  useDocumentTitle("Assign Item • School Stock Management");
  return <CrudPage config={assignConfig} mode="form" />;
}
